/**
 * Oryx Engine — agent di theming (scoring delle preferenze).
 *
 * Stesso pattern di core.ts: l'algoritmo gira identico in WASM (Zig, f64) e nel
 * fallback JS (f64), con fallback automatico quando WebAssembly non è attivo.
 * Il binding è id-based: tema e size passano come interi (indici in
 * availableThemes / SIZES), la mappatura resta in TS.
 */

import { getWasmInstance, type BenchResult } from './core'

export const AGENT_MAX_INTERACTIONS = 1024
export const AGENT_MIN_INTERACTIONS = 5

const DAY_MS = 1000 * 60 * 60 * 24
const DURATION_NORM_MS = 30 * 60 * 1000
const INTERACTION_BYTES = 24

/** Interazione utente in formato numerico (per il confine WASM). */
export interface AgentInput {
  themeId: number
  sizeId: number
  timestampMs: number
  durationMs: number
  dayOfWeek: number // 0-6
  hourOfDay: number // 0-23
}

/** Raccomandazione prodotta dal motore (id + confidence). */
export interface AgentRecommendationResult {
  themeId: number
  sizeId: number
  confidence: number
}

// ---------------------------------------------------------------------------
// Implementazione JS (f64) — identica a agent.zig
// ---------------------------------------------------------------------------

interface JsPreference {
  themeId: number
  sizeId: number
  usageCount: number
  totalDuration: number
  lastUsed: number
  score: number
  timePatterns: [number, number, number, number]
  dayPatterns: number[]
}

function timeSlot(hour: number): number {
  if (hour >= 6 && hour < 12) return 0
  if (hour >= 12 && hour < 18) return 1
  if (hour >= 18 && hour < 24) return 2
  return 3
}

function calculateScoreJS(pref: JsPreference, totalInteractions: number): number {
  const usageRatio = pref.usageCount / totalInteractions
  const avgDuration = pref.totalDuration / pref.usageCount
  const durationScore = Math.min(1, avgDuration / DURATION_NORM_MS)
  return usageRatio * 0.7 + durationScore * 0.3
}

function getTimeBoostJS(pref: JsPreference, currentHour: number): number {
  const total = pref.timePatterns[0] + pref.timePatterns[1] + pref.timePatterns[2] + pref.timePatterns[3]
  if (total === 0) return 0
  return pref.timePatterns[timeSlot(currentHour)] / total
}

function buildPreferencesJS(inputs: AgentInput[]): JsPreference[] {
  const prefs: JsPreference[] = []
  for (const it of inputs) {
    let found = -1
    for (let i = 0; i < prefs.length; i++) {
      if (prefs[i].themeId === it.themeId && prefs[i].sizeId === it.sizeId) {
        found = i
        break
      }
    }
    if (found >= 0) {
      const p = prefs[found]
      p.usageCount++
      p.totalDuration += it.durationMs
      p.lastUsed = Math.max(p.lastUsed, it.timestampMs)
      p.timePatterns[timeSlot(it.hourOfDay)]++
      p.dayPatterns[it.dayOfWeek]++
    } else {
      const p: JsPreference = {
        themeId: it.themeId,
        sizeId: it.sizeId,
        usageCount: 1,
        totalDuration: it.durationMs,
        lastUsed: it.timestampMs,
        score: 0,
        timePatterns: [0, 0, 0, 0],
        dayPatterns: [0, 0, 0, 0, 0, 0, 0],
      }
      p.timePatterns[timeSlot(it.hourOfDay)]++
      p.dayPatterns[it.dayOfWeek]++
      prefs.push(p)
    }
  }
  for (const p of prefs) p.score = calculateScoreJS(p, inputs.length)
  return prefs
}

/** Raccomandazione (riferimento JS, identica a agent.zig). */
export function agentRecommendJS(
  inputs: AgentInput[],
  currentHour: number,
  currentDay: number,
  nowMs: number,
): AgentRecommendationResult | null {
  if (inputs.length < AGENT_MIN_INTERACTIONS) return null

  const prefs = buildPreferencesJS(inputs)

  let bestScore = 0
  let best: JsPreference | null = null
  for (const p of prefs) {
    let score = p.score
    const timeBoost = getTimeBoostJS(p, currentHour)
    score *= 1 + timeBoost
    const dayMax = Math.max(...p.dayPatterns, 1)
    const dayBoost = p.dayPatterns[currentDay % 7] / dayMax
    score *= 1 + dayBoost * 0.3
    const daysSinceUse = (nowMs - p.lastUsed) / DAY_MS
    const recencyBoost = Math.max(0, 1 - daysSinceUse / 30)
    score *= 1 + recencyBoost * 0.2
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }

  if (!best) return null

  const total = inputs.length
  const confidence = Math.min(1, (best.usageCount / total) * (total / 20))
  return { themeId: best.themeId, sizeId: best.sizeId, confidence }
}

// ---------------------------------------------------------------------------
// Binding WASM (zero-copy su linear memory)
// ---------------------------------------------------------------------------

function agentRecommendWasm(
  inputs: AgentInput[],
  currentHour: number,
  currentDay: number,
  nowMs: number,
): AgentRecommendationResult | null {
  const ex = getWasmInstance()!
  const count = Math.min(inputs.length, AGENT_MAX_INTERACTIONS)
  const inPtr = ex.get_agent_input_ptr()
  const view = new DataView(ex.memory.buffer)

  for (let i = 0; i < count; i++) {
    const it = inputs[i]
    const o = inPtr + i * INTERACTION_BYTES
    view.setUint8(o, it.themeId)
    view.setUint8(o + 1, it.sizeId)
    view.setUint8(o + 2, it.dayOfWeek)
    view.setUint8(o + 3, it.hourOfDay)
    // DataView.setFloat64 default è big-endian; WASM è little-endian
    view.setFloat64(o + 8, it.timestampMs, true)
    view.setFloat64(o + 16, it.durationMs, true)
  }

  const found = ex.agent_recommend(count, currentHour, currentDay, nowMs)
  if (!found) return null

  const outPtr = ex.get_agent_output_ptr()
  const outView = new DataView(ex.memory.buffer)
  return {
    themeId: outView.getUint8(outPtr),
    sizeId: outView.getUint8(outPtr + 1),
    confidence: outView.getFloat64(outPtr + 8, true),
  }
}

/** Raccomandazione: usa WASM se attivo, altrimenti il fallback JS. */
export function agentRecommend(
  inputs: AgentInput[],
  currentHour: number,
  currentDay: number,
  nowMs: number,
): AgentRecommendationResult | null {
  if (getWasmInstance()) return agentRecommendWasm(inputs, currentHour, currentDay, nowMs)
  return agentRecommendJS(inputs, currentHour, currentDay, nowMs)
}

// ---------------------------------------------------------------------------
// Validazione WASM vs JS
// ---------------------------------------------------------------------------

export interface AgentValidationResult {
  identical: boolean
  maxConfidenceDelta: number
  wasm: AgentRecommendationResult | null
  js: AgentRecommendationResult | null
}

/** Confronta il risultato WASM con il riferimento JS sugli stessi input. */
export function validateAgent(
  inputs: AgentInput[],
  currentHour: number,
  currentDay: number,
  nowMs: number,
): AgentValidationResult {
  const wasm = agentRecommendWasm(inputs, currentHour, currentDay, nowMs)
  const js = agentRecommendJS(inputs, currentHour, currentDay, nowMs)

  if (wasm === null || js === null) {
    return { identical: wasm === js, maxConfidenceDelta: wasm === js ? 0 : 1, wasm, js }
  }

  const maxConfidenceDelta = Math.abs(wasm.confidence - js.confidence)
  const identical =
    wasm.themeId === js.themeId &&
    wasm.sizeId === js.sizeId &&
    maxConfidenceDelta < 1e-9

  return { identical, maxConfidenceDelta, wasm, js }
}

// ---------------------------------------------------------------------------
// Benchmark (JS vs WASM, stessi dati)
// ---------------------------------------------------------------------------

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

/** Genera interazioni sintetiche deterministiche. */
export function syntheticInteractions(n: number, seedValue: number = 42): AgentInput[] {
  const out: AgentInput[] = []
  let seed = seedValue
  for (let i = 0; i < n; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    out.push({
      themeId: seed % 40,
      sizeId: seed % 3,
      timestampMs: 1_700_000_000_000 - (seed % 30) * DAY_MS,
      durationMs: (seed % 61) * 60_000,
      dayOfWeek: seed % 7,
      hourOfDay: seed % 24,
    })
  }
  return out
}

/** Benchmark della raccomandazione agent: wasm vs js. */
export function benchAgent(n: number, iterations: number): BenchResult {
  const inputs = syntheticInteractions(n)
  const hour = 9
  const day = 1
  const nowMs = 1_700_000_000_000

  agentRecommendJS(inputs, hour, day, nowMs) // warmup

  let wasmMs = Infinity
  if (getWasmInstance()) {
    let t0 = now()
    for (let i = 0; i < iterations; i++) agentRecommendWasm(inputs, hour, day, nowMs)
    wasmMs = now() - t0
  }
  let t1 = now()
  for (let i = 0; i < iterations; i++) agentRecommendJS(inputs, hour, day, nowMs)
  const jsMs = now() - t1

  return { n, iterations, wasmMs, jsMs, speedup: jsMs / wasmMs }
}
