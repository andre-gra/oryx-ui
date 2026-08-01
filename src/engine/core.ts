/**
 * Oryx Engine — binding TypeScript del modulo WASM (Zig -> wasm32-freestanding).
 *
 * Due strade:
 *  - `wasm`:  il modulo compilato (zero-copy, veloce). Fallback automatico.
 *  - `js`:    implementazione identica in TS (f64). Usata come baseline del
 *             benchmark e come fallback se `WebAssembly` non e' disponibile.
 *
 * L'algoritmo e' deterministico; la versione wasm usa f32, quella JS f64:
 * gli hex possono differire al massimo di 1 unita' per canale (verificato nel demo).
 */

export type ThemeMode = 'light' | 'dark'

export interface ThemeA11yResult {
  ratio: number
  bg: string
  fg: string
  passAA: boolean
}

export interface EngineApi {
  /** 'wasm' se il modulo compilato e' attivo, altrimenti 'js' */
  mode: 'wasm' | 'js'
  version: number
  /** Dimensione in byte del modulo WASM (solo se caricato) */
  wasmBytes?: number
  relativeLuminance(hex: string): number
  contrast(a: string, b: string): number
  themeFromSeed(seed: string, mode: ThemeMode): string[]
  themeA11y(seed: string, mode: ThemeMode): ThemeA11yResult
  contrastMatrix(colors: string[]): Float32Array
}

// ---------------------------------------------------------------------------
// Utils colore condivise
// ---------------------------------------------------------------------------

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

// ---------------------------------------------------------------------------
// Implementazione JS (f64) — identica alla controparte Zig (f32)
// ---------------------------------------------------------------------------

function srgbToLinearJS(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function linearToSrgbJS(v: number): number {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, s)) * 255)
}

function relativeLuminanceJS([r, g, b]: [number, number, number]): number {
  return (
    0.2126 * srgbToLinearJS(r) + 0.7152 * srgbToLinearJS(g) + 0.0722 * srgbToLinearJS(b)
  )
}

function contrastJS(a: [number, number, number], b: [number, number, number]): number {
  const la = relativeLuminanceJS(a)
  const lb = relativeLuminanceJS(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

function srgbToOklchJS([r, g, b]: [number, number, number]): { L: number; C: number; H: number } {
  const lr = srgbToLinearJS(r)
  const lg = srgbToLinearJS(g)
  const lb = srgbToLinearJS(b)

  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l3 = Math.cbrt(l_)
  const m3 = Math.cbrt(m_)
  const s3 = Math.cbrt(s_)

  const L = 0.2104542553 * l3 + 0.793617785 * m3 - 0.0040720468 * s3
  const a = 1.9779984951 * l3 - 2.428592205 * m3 + 0.4505937099 * s3
  const b_ = 0.0259040371 * l3 + 0.7827717662 * m3 - 0.808675766 * s3

  return { L, C: Math.sqrt(a * a + b_ * b_), H: Math.atan2(b_, a) }
}

function oklchToSrgbJS(oc: { L: number; C: number; H: number }): [number, number, number] {
  const a = oc.C * Math.cos(oc.H)
  const b_ = oc.C * Math.sin(oc.H)

  const l_ = oc.L + 0.3963377774 * a + 0.2158037573 * b_
  const m_ = oc.L - 0.1055613458 * a - 0.0638541728 * b_
  const s_ = oc.L - 0.0894841775 * a - 1.291485548 * b_

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  return [linearToSrgbJS(r), linearToSrgbJS(g), linearToSrgbJS(b)]
}

// Curve Radix-like (light/dark) — devono combaciare con theme.zig
const L_LIGHT = [0.992, 0.99, 0.982, 0.962, 0.93, 0.897, 0.858, 0.804, 0.688, 0.604, 0.49, 0.36]
const L_DARK = [0.022, 0.038, 0.056, 0.084, 0.112, 0.146, 0.18, 0.222, 0.29, 0.36, 0.45, 0.57]
const C_LIGHT = [0.02, 0.03, 0.055, 0.075, 0.095, 0.115, 0.13, 0.14, 0.125, 0.11, 0.095, 0.08]
const C_DARK = [0.005, 0.008, 0.012, 0.017, 0.023, 0.03, 0.04, 0.055, 0.07, 0.075, 0.07, 0.06]
const REF_CHROMA = 0.13
const MAX_CHROMA = 0.3

function themeFromSeedJS(seedHex: string, dark: boolean): string[] {
  const seed = srgbToOklchJS(hexToRgb(seedHex))
  const scale = Math.max(0.15, Math.min(2.0, seed.C / REF_CHROMA))
  const out: string[] = []
  for (let i = 0; i < 12; i++) {
    const L = dark ? L_DARK[i] : L_LIGHT[i]
    const baseC = dark ? C_DARK[i] : C_LIGHT[i]
    const C = Math.max(0, Math.min(MAX_CHROMA, baseC * scale))
    const [r, g, b] = oklchToSrgbJS({ L, C, H: seed.H })
    out.push(rgbToHex(r, g, b))
  }
  return out
}

function themeA11yJS(seedHex: string, dark: boolean): ThemeA11yResult {
  const ramp = themeFromSeedJS(seedHex, dark)
  const bg = ramp[0]
  const fg = ramp[11]
  const ratio = contrastJS(hexToRgb(bg), hexToRgb(fg))
  return { ratio, bg, fg, passAA: ratio >= 4.5 }
}

// ---------------------------------------------------------------------------
// Binding WASM (zero-copy su linear memory)
// ---------------------------------------------------------------------------

type WasmExports = {
  memory: WebAssembly.Memory
  engine_version(): number
  get_input_ptr(): number
  get_output_ptr(): number
  get_theme_ptr(): number
  relative_luminance(r: number, g: number, b: number): number
  contrast(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number
  contrast_matrix(count: number): number
  theme_from_seed(r: number, g: number, b: number, dark: number): number
  theme_a11y(r: number, g: number, b: number, dark: number, out: number): number
  get_agent_input_ptr(): number
  get_agent_output_ptr(): number
  agent_recommend(count: number, current_hour: number, current_day: number, now_ms: number): number
}

let wasm: WasmExports | null = null
let ready: Promise<boolean> | null = null
let wasmBytes = 0

/** Carica il modulo WASM una sola volta (lazy). Fallback JS se non disponibile. */
export function initEngine(): Promise<EngineApi> {
  if (ready) return ready.then(() => engine)
  ready = (async () => {
    try {
      if (typeof WebAssembly === 'undefined') return false
      const url = new URL('./oryx-engine.wasm', import.meta.url)
      const res = await fetch(url)
      const bytes = await res.arrayBuffer()
      wasmBytes = bytes.byteLength
      const { instance } = await WebAssembly.instantiate(bytes)
      wasm = instance.exports as unknown as WasmExports
      return true
    } catch (err) {
      console.warn('[oryx-engine] WASM non disponibile, uso fallback JS:', err)
      return false
    }
  })()
  return ready.then(() => engine)
}

export const isWasmActive = () => wasm !== null

/** Accesso all'istanza WASM caricata (usata dai moduli specializzati come agent.ts). */
export function getWasmInstance(): WasmExports | null {
  return wasm
}

// ---------------------------------------------------------------------------
// API pubblica (doppia implementazione: wasm / js)
// ---------------------------------------------------------------------------

function contrastMatrixWasm(colors: string[]): Float32Array {
  const ex = wasm!
  const count = Math.min(colors.length, 128)
  const inPtr = ex.get_input_ptr()
  const view = new Uint8Array(ex.memory.buffer)
  for (let i = 0; i < count; i++) {
    const [r, g, b] = hexToRgb(colors[i])
    view[inPtr + i * 3] = r
    view[inPtr + i * 3 + 1] = g
    view[inPtr + i * 3 + 2] = b
  }
  const written = ex.contrast_matrix(count)
  const outPtr = ex.get_output_ptr()
  return new Float32Array(ex.memory.buffer, outPtr, written)
}

function themeFromSeedWasm(seedHex: string, mode: ThemeMode): string[] {
  const ex = wasm!
  const [r, g, b] = hexToRgb(seedHex)
  ex.theme_from_seed(r, g, b, mode === 'dark' ? 1 : 0)
  const ptr = ex.get_theme_ptr()
  const view = new Uint8Array(ex.memory.buffer)
  const out: string[] = []
  for (let i = 0; i < 12; i++) {
    const o = ptr + i * 3
    out.push(rgbToHex(view[o], view[o + 1], view[o + 2]))
  }
  return out
}

function themeA11yWasm(seedHex: string, mode: ThemeMode): ThemeA11yResult {
  const ex = wasm!
  const [r, g, b] = hexToRgb(seedHex)
  const outPtr = ex.get_output_ptr()
  ex.theme_a11y(r, g, b, mode === 'dark' ? 1 : 0, outPtr)
  const view = new Float32Array(ex.memory.buffer, outPtr, 8)
  return {
    ratio: view[0],
    bg: rgbToHex(view[1], view[2], view[3]),
    fg: rgbToHex(view[4], view[5], view[6]),
    passAA: view[7] === 1,
  }
}

export const engine: EngineApi = {
  get mode() {
    return wasm ? 'wasm' : 'js'
  },
  get version() {
    return wasm ? wasm!.engine_version() : 1
  },
  get wasmBytes() {
    return wasmBytes
  },
  relativeLuminance(hex: string): number {
    if (wasm) {
      const [r, g, b] = hexToRgb(hex)
      return wasm.relative_luminance(r, g, b)
    }
    return relativeLuminanceJS(hexToRgb(hex))
  },
  contrast(a: string, b: string): number {
    if (wasm) {
      const [r1, g1, b1] = hexToRgb(a)
      const [r2, g2, b2] = hexToRgb(b)
      return wasm.contrast(r1, g1, b1, r2, g2, b2)
    }
    return contrastJS(hexToRgb(a), hexToRgb(b))
  },
  themeFromSeed(seed: string, mode: ThemeMode): string[] {
    return wasm ? themeFromSeedWasm(seed, mode) : themeFromSeedJS(seed, mode === 'dark')
  },
  themeA11y(seed: string, mode: ThemeMode): ThemeA11yResult {
    return wasm ? themeA11yWasm(seed, mode) : themeA11yJS(seed, mode === 'dark')
  },
  contrastMatrix(colors: string[]): Float32Array {
    return wasm ? contrastMatrixWasm(colors) : jsContrastMatrix(colors)
  },
}

function jsContrastMatrix(colors: string[]): Float32Array {
  const n = Math.min(colors.length, 128)
  const rgb = colors.slice(0, n).map(hexToRgb)
  const out = new Float32Array(n * n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      out[i * n + j] = contrastJS(rgb[i], rgb[j])
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Validazione: WASM (f32) vs JS fallback (f64) — max delta per canale
// ---------------------------------------------------------------------------

export interface ValidationResult {
  maxDelta: number
  identical: boolean
  wasm: string[]
  js: string[]
}

/** Confronta la rampa generata dalla wasm con quella del fallback JS. */
export function validate(seed: string, mode: ThemeMode): ValidationResult {
  const wasmRamp = wasm ? themeFromSeedWasm(seed, mode) : themeFromSeedJS(seed, mode === 'dark')
  const jsRamp = themeFromSeedJS(seed, mode === 'dark')
  let maxDelta = 0
  for (let i = 0; i < 12; i++) {
    const a = hexToRgb(wasmRamp[i])
    const b = hexToRgb(jsRamp[i])
    for (let c = 0; c < 3; c++) maxDelta = Math.max(maxDelta, Math.abs(a[c] - b[c]))
  }
  return { maxDelta, identical: maxDelta === 0, wasm: wasmRamp, js: jsRamp }
}

// ---------------------------------------------------------------------------
// Benchmark (JS vs WASM, stessi dati)
// ---------------------------------------------------------------------------

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

export interface BenchResult {
  n: number
  iterations: number
  wasmMs: number
  jsMs: number
  speedup: number
}

/** Matrice di contrasto n x n (op = n^2 confronti), confronto wasm vs js. */
export function benchContrastMatrix(n: number, iterations: number): BenchResult {
  const colors: string[] = []
  let seed = 42
  for (let i = 0; i < n; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    colors.push(rgbToHex(seed & 0xff, (seed >> 8) & 0xff, (seed >> 16) & 0xff))
  }
  const m = Math.min(n, 128)

  // warmup
  engine.contrastMatrix(colors)
  jsContrastMatrix(colors)

  let wasmMs = Infinity
  let jsMs = Infinity
  if (wasm) {
    let t0 = now()
    for (let i = 0; i < iterations; i++) engine.contrastMatrix(colors)
    wasmMs = now() - t0
  }
  let t1 = now()
  for (let i = 0; i < iterations; i++) jsContrastMatrix(colors)
  jsMs = now() - t1

  return { n: m, iterations, wasmMs, jsMs, speedup: jsMs / wasmMs }
}

/** Generazione rampa 12-step: wasm vs js. */
export function benchTheme(iterations: number): BenchResult {
  const seed = '#3366ff'
  if (wasm) {
    let t0 = now()
    for (let i = 0; i < iterations; i++) engine.themeFromSeed(seed, 'light')
    let t1 = now()
    for (let i = 0; i < iterations; i++) themeFromSeedJS(seed, false)
    let t2 = now()
    return { n: 12, iterations, wasmMs: t1 - t0, jsMs: t2 - t1, speedup: (t2 - t1) / (t1 - t0) }
  }
  let t1 = now()
  for (let i = 0; i < iterations; i++) themeFromSeedJS(seed, false)
  let t2 = now()
  return { n: 12, iterations, wasmMs: NaN, jsMs: t2 - t1, speedup: NaN }
}
