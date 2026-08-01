import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import {
  initEngine,
  benchContrastMatrix,
  benchTheme,
  validate,
  type EngineApi,
  type ThemeMode,
  type BenchResult,
  type ValidationResult,
} from '../../src/engine/core'
import {
  agentRecommend,
  validateAgent,
  benchAgent,
  syntheticInteractions,
  type AgentValidationResult,
  type AgentRecommendationResult,
} from '../../src/engine/agent'

type Status = 'loading' | 'ready'

const PRESETS = ['#ff6b00', '#3366ff', '#22c55e', '#8b5cf6', '#ef4444', '#0ea5e9']

const formatMs = (ms: number) => (Number.isFinite(ms) ? `${ms.toFixed(2)} ms` : '—')

export const WasmPocPage = () => {
  const [status, setStatus] = useState<Status>('loading')
  const [api, setApi] = useState<EngineApi | null>(null)
  const [seed, setSeed] = useState('#ff6b00')
  const [mode, setMode] = useState<ThemeMode>('light')
  const [matrixN, setMatrixN] = useState(128)
  const [matrixIter, setMatrixIter] = useState(30)
  const [themeIter, setThemeIter] = useState(5000)
  const [matrixBench, setMatrixBench] = useState<BenchResult | null>(null)
  const [themeBench, setThemeBench] = useState<BenchResult | null>(null)
  const [running, setRunning] = useState(false)

  const [agentN, setAgentN] = useState(300)
  const [agentIter, setAgentIter] = useState(20000)
  const [agentBench, setAgentBench] = useState<BenchResult | null>(null)
  const [agentCheck, setAgentCheck] = useState<AgentValidationResult | null>(null)
  const [agentRec, setAgentRec] = useState<AgentRecommendationResult | null>(null)

  useEffect(() => {
    let cancelled = false
    initEngine().then((e) => {
      if (!cancelled) {
        setApi(e)
        setStatus('ready')
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const ramp = useMemo(() => (api ? api.themeFromSeed(seed, mode) : []), [api, seed, mode])
  const a11y = useMemo(() => (api ? api.themeA11y(seed, mode) : null), [api, seed, mode])
  const check = useMemo<ValidationResult | null>(() => (api ? validate(seed, mode) : null), [api, seed, mode])

  const runMatrix = async () => {
    setRunning(true)
    // yield al browser per aggiornare l'UI prima del benchmark
    await new Promise((r) => setTimeout(r, 30))
    const r = benchContrastMatrix(matrixN, matrixIter)
    setMatrixBench(r)
    setRunning(false)
  }

  const runTheme = async () => {
    setRunning(true)
    await new Promise((r) => setTimeout(r, 30))
    const r = benchTheme(themeIter)
    setThemeBench(r)
    setRunning(false)
  }

  const runAgent = async () => {
    setRunning(true)
    await new Promise((r) => setTimeout(r, 30))
    const inputs = syntheticInteractions(agentN)
    const hour = 9
    const day = 1
    const nowMs = 1_700_000_000_000
    setAgentCheck(validateAgent(inputs, hour, day, nowMs))
    setAgentRec(agentRecommend(inputs, hour, day, nowMs))
    const r = benchAgent(agentN, agentIter)
    setAgentBench(r)
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-color12">POC: oryx-engine (Zig → WASM)</h2>
        <p className="text-color10">
          Core compilato per theming e colori. L'algoritmo gira identico in Zig (f32) e nel fallback JS
          (f64), con fallback automatico quando WebAssembly non è disponibile.
        </p>
      </div>

      {/* Stato engine */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-color11 text-lg font-semibold">Engine status</h3>
            {status === 'loading' ? (
              <p className="text-color10">Caricamento del modulo WASM…</p>
            ) : (
              <p className="text-color10">
                Mode:{' '}
                <span
                  className={classNames(
                    'font-mono font-bold',
                    api?.mode === 'wasm' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
                  )}
                >
                  {api?.mode === 'wasm' ? 'wasm (Zig)' : 'js (fallback)'}
                </span>{' '}
                · version {api?.version}
                {api?.wasmBytes ? ` · ${(api.wasmBytes / 1024).toFixed(1)} KB` : ''}
              </p>
            )}
          </div>
          {api?.mode === 'wasm' && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-sm font-medium">
              ✓ Core compilato attivo
            </span>
          )}
        </div>
      </div>

      {/* Controlli */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-color12 text-sm font-semibold block mb-1" htmlFor="seed">
              Seed color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="seed"
                type="color"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-12 h-10 rounded-md border border-color6 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-28 px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-color12 text-sm font-semibold block mb-1">Presets</label>
            <div className="flex gap-1.5">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSeed(c)}
                  className="w-8 h-8 rounded-md border border-color6 transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  aria-label={`preset ${c}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-color12 text-sm font-semibold block mb-1">Mode</label>
            <div className="flex rounded-md overflow-hidden border border-color6">
              {(['light', 'dark'] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={classNames(
                    'px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                    mode === m ? 'bg-color9 text-color1' : 'bg-color2 text-color11 hover:bg-color3',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rampa */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-color11 text-lg font-semibold mb-3">
          Rampa 12-step generata dal seed (theme_from_seed)
        </h3>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {ramp.map((hex, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={classNames(
                  'w-full h-16 rounded-lg border border-color6',
                  (i === 0 || i === 11) && 'ring-2 ring-color9',
                )}
                style={{ backgroundColor: hex }}
                title={`step ${i + 1}: ${hex}`}
              />
              <span className="text-[10px] text-color10 font-mono">s{i + 1}</span>
              <span className="text-[10px] text-color10 font-mono">{hex}</span>
            </div>
          ))}
        </div>
        <p className="text-color10 text-xs mt-3">
          Step 1 (sfondo) e step 12 (testo) evidenziati. La hue del brand è preservata lungo tutta la
          rampa; lightness/chroma seguono curve light/dark.
        </p>
      </div>

      {/* A11y + validazione */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-color11 text-lg font-semibold mb-3">Accessibilità del tema</h3>
          {a11y && (
            <div className="space-y-2 text-sm text-color11">
              <div
                className="flex items-center justify-between rounded-lg p-3 border border-color6"
                style={{ backgroundColor: a11y.bg, color: a11y.fg }}
              >
                <span className="font-mono">bg {a11y.bg}</span>
                <span className="font-mono">fg {a11y.fg}</span>
              </div>
              <p>
                Contrasto (WCAG 2.x): <span className="font-mono font-semibold">{a11y.ratio.toFixed(2)}</span>
              </p>
              <p>
                Testo normale AA (≥4.5):{' '}
                <span
                  className={classNames(
                    'font-semibold',
                    a11y.passAA ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {a11y.passAA ? '✓ PASS' : '✗ FAIL'}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-color11 text-lg font-semibold mb-3">Determinismo WASM vs JS</h3>
          {check && (
            <div className="space-y-2 text-sm text-color11">
              <p>
                Max delta per canale:{' '}
                <span className="font-mono font-semibold">{check.maxDelta}</span>{' '}
                <span className="text-color10">(atteso ≤1, dovuto a f32 vs f64)</span>
              </p>
              <p>
                Output identici:{' '}
                <span
                  className={classNames(
                    'font-semibold',
                    check.identical ? 'text-emerald-600 dark:text-emerald-400' : 'text-color11',
                  )}
                >
                  {check.identical ? '✓ sì' : `~ ${check.maxDelta <= 1 ? 'sì (entro tolleranza)' : 'no'}`}
                </span>
              </p>
              <div className="flex gap-3 flex-wrap">
                <div>
                  <div className="text-xs text-color10 mb-1">WASM</div>
                  <div className="flex gap-1">
                    {check.wasm.map((c, i) => (
                      <span key={i} className="w-4 h-6 rounded-sm border border-color6" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-color10 mb-1">JS fallback</div>
                  <div className="flex gap-1">
                    {check.js.map((c, i) => (
                      <span key={i} className="w-4 h-6 rounded-sm border border-color6" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-color11 text-lg font-semibold mb-3">Benchmark: JS vs WASM</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-color10 font-medium text-sm">Matrice di contrasto (n×n confronti)</h4>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-color12 text-xs font-semibold block mb-1">n colori</label>
                <select
                  value={matrixN}
                  onChange={(e) => setMatrixN(Number(e.target.value))}
                  className="px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 text-sm"
                >
                  {[16, 32, 64, 128].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-color12 text-xs font-semibold block mb-1">iterazioni</label>
                <input
                  type="number"
                  value={matrixIter}
                  onChange={(e) => setMatrixIter(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 text-sm"
                />
              </div>
              <button
                onClick={runMatrix}
                disabled={running || api?.mode !== 'wasm'}
                className="px-4 py-1.5 rounded-md bg-color9 text-color1 text-sm font-medium disabled:opacity-50"
              >
                Run
              </button>
            </div>
            {matrixBench && (
              <div className="text-sm text-color11 space-y-1 font-mono">
                <p>ops = {matrixBench.n * matrixBench.n} × {matrixBench.iterations}</p>
                <p>wasm: {formatMs(matrixBench.wasmMs)}</p>
                <p>js:   {formatMs(matrixBench.jsMs)}</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {Number.isFinite(matrixBench.speedup) ? `speedup ×${matrixBench.speedup.toFixed(1)}` : '—'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-color10 font-medium text-sm">Generazione rampa 12-step</h4>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-color12 text-xs font-semibold block mb-1">iterazioni</label>
                <input
                  type="number"
                  value={themeIter}
                  onChange={(e) => setThemeIter(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 text-sm"
                />
              </div>
              <button
                onClick={runTheme}
                disabled={running}
                className="px-4 py-1.5 rounded-md bg-color9 text-color1 text-sm font-medium disabled:opacity-50"
              >
                Run
              </button>
            </div>
            {themeBench && (
              <div className="text-sm text-color11 space-y-1 font-mono">
                <p>× {themeBench.iterations} rampe</p>
                <p>wasm: {formatMs(themeBench.wasmMs)}</p>
                <p>js:   {formatMs(themeBench.jsMs)}</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {Number.isFinite(themeBench.speedup) ? `speedup ×${themeBench.speedup.toFixed(1)}` : '—'}
                </p>
              </div>
            )}
          </div>
        </div>

        {api?.mode !== 'wasm' && (
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-3">
            ⚠ Il modulo WASM non è attivo: il benchmark JS è mostrato come baseline.
          </p>
        )}
      </div>

      {/* Benchmark agent */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-color11 text-lg font-semibold mb-1">
          Agent: scoring preferenze (agent_recommend)
        </h3>
        <p className="text-color10 text-sm mb-3">
          Aggregazione interazioni → preferenze → raccomandazione. Stesso algoritmo in Zig (agent.zig)
          e nel fallback JS (agent.ts), confrontato per determinismo e prestazioni.
        </p>

        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label className="text-color12 text-xs font-semibold block mb-1">n interazioni</label>
            <input
              type="number"
              value={agentN}
              onChange={(e) => setAgentN(Math.max(5, Number(e.target.value)))}
              className="w-24 px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 text-sm"
            />
          </div>
          <div>
            <label className="text-color12 text-xs font-semibold block mb-1">iterazioni</label>
            <input
              type="number"
              value={agentIter}
              onChange={(e) => setAgentIter(Math.max(1, Number(e.target.value)))}
              className="w-28 px-2 py-1.5 rounded-md bg-color2 border border-color6 text-color11 text-sm"
            />
          </div>
          <button
            onClick={runAgent}
            disabled={running}
            className="px-4 py-1.5 rounded-md bg-color9 text-color1 text-sm font-medium disabled:opacity-50"
          >
            Run
          </button>
        </div>

        {agentRec && (
          <p className="text-sm text-color11 font-mono mb-2">
            raccomandazione: theme #{agentRec.themeId} · size #{agentRec.sizeId} · confidence{' '}
            {agentRec.confidence.toFixed(4)}
          </p>
        )}

        {agentCheck && (
          <div className="text-sm text-color11 space-y-1 mb-3">
            <p>
              Determinismo WASM vs JS:{' '}
              <span
                className={classNames(
                  'font-semibold',
                  agentCheck.identical ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                )}
              >
                {agentCheck.identical ? '✓ identico' : '✗ diverso'}
              </span>{' '}
              <span className="text-color10">(max Δ confidence {agentCheck.maxConfidenceDelta.toExponential(2)})</span>
            </p>
          </div>
        )}

        {agentBench && (
          <div className="text-sm text-color11 space-y-1 font-mono">
            <p>{agentBench.iterations} raccomandazioni × {agentBench.n} interazioni</p>
            <p>wasm: {formatMs(agentBench.wasmMs)}</p>
            <p>js:   {formatMs(agentBench.jsMs)}</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {Number.isFinite(agentBench.speedup) ? `speedup ×${agentBench.speedup.toFixed(1)}` : '—'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
