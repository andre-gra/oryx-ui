# POC — oryx-engine (Zig → WASM)

Proof of concept: un **core compilato in Zig** per theming, colore e accessibilità,
esposto a React/TS tramite un modulo **WebAssembly** (wasm32-freestanding).

> Obiettivo del POC: dimostrare che (1) il motore è fattibile in Zig, (2) è
> deterministico e testabile (`zig test`), (3) porta un guadagno di prestazioni
> reale su operazioni O(n²) come la matrice di contrasto, (4) il fallback JS è
> trasparente.

---

## Struttura

```
oryx-engine/                 # progetto Zig
├── build.zig                # build wasm32-freestanding ReleaseSmall + `zig build test`
└── src/
    ├── color.zig            # sRGB<->OKLCH, luminanza WCAG, contrast ratio (+ test)
    ├── theme.zig            # themeFromSeed: rampa 12-step light/dark (+ test)
    ├── agent.zig            # scoring preferenze: buildPreferences, recommend (+ test)
    └── engine.zig           # root: export fn WASM + buffer zero-copy

src/engine/
├── core.ts                  # binding TS (loader WASM + fallback JS identico)
├── agent.ts                 # binding agent (id-based) + fallback JS + validate + bench
└── oryx-engine.wasm         # artefatto compilato (commitato per il POC)

demo/pages/WasmPocPage.tsx   # pagina demo: rampa, a11y, determinismo, benchmark, agent
```

## Cosa espone la WASM

| funzione | descrizione |
|---|---|
| `engine_version()` | versione engine |
| `relative_luminance(r,g,b)` | luminanza relativa WCAG 2.x |
| `contrast(r1,g1,b1,r2,g2,b2)` | contrast ratio WCAG |
| `contrast_matrix(count)` | matrice n×n di contrasti (O(n²)), input/output su buffer |
| `theme_from_seed(r,g,b,dark)` | rampa 12-step dal colore seed (stile Radix), 36 byte in output |
| `theme_a11y(r,g,b,dark,out)` | verifica AA del tema (bg step1 / testo step12) |
| `get_agent_input_ptr()` | puntatore al buffer interazioni (Interaction a 24 byte) |
| `get_agent_output_ptr()` | puntatore al risultato (theme_id, size_id, confidence f64) |
| `agent_recommend(count,hour,day,now_ms)` | raccomandazione best-slot dalle preferenze |

Il design è **zero-allocation**: JS scrive gli input nei buffer esposti e legge i
risultati direttamente dalla linear memory (zero-copy, nessun marshalling JSON).

## Agent (agent.zig)

Lo scoring dell'agent di theming (`ThemeAgent.getRecommendation`) ora gira
nell'engine Zig, con un riferimento JS identico mantenuto in `agent.ts` per
confronti e benchmark:

- Input **id-based**: tema = indice in `availableThemes` (0-39), size = indice in
  `['2','3','4']`. La mappatura resta in TS.
- Pipeline: `buildPreferences` (aggregazione usage/durata/time/day patterns) →
  `calculateScore` (`usageRatio*0.7 + durationScore*0.3`) → `recommend` con
  boost di fascia oraria, giorno della settimana e recenza → confidence
  `min(1, usageCount/20)`.
- Vincoli fedeli al TS: `MIN_INTERACTIONS=5`, finestra 30 giorni, score cap a 1.
- `ThemeAgent` delega a `agentRecommend()` (WASM con fallback JS automatico);
  il codice JS originale di scoring resta in `agent.ts` come baseline benchmark.

## Prestazioni

- Compilazione `wasm32-freestanding -OReleaseSmall` → **~12.7 KB**.
- Nella build **ESM** Vite inlina il `.wasm` come data-URL: nessun fetch extra.
- Operazioni O(n²) (matrice di contrasto) eseguite off-main-thread senza GC pause.
- F32 in WASM vs F64 in JS: gli hex possono differire di **≤1 unità per canale**
  (verificato in pagina con `validate()`).

## Test

```bash
npm run test:wasm    # zig build test  (22 test nativi su host)
npm run build:wasm   # ricompila il .wasm in src/engine/
```

## Demo

```bash
npm run dev          # pagina /wasm-poc
```

La pagina mostra: stato engine (wasm/fallback), rampa generata, punteggio AA,
delta wasm-vs-js, benchmark (matrice contrasto + generazione tema) e la sezione
agent (determinismo + benchmark dello scoring preferenze).

## Limiti noti (POC)

1. **UMD**: `import.meta.url` non è disponibile → l'engine usa il fallback JS.
   La build ESM (percorso consigliato) inlina la WASM correttamente.
2. **`@min` bug in Zig 0.15.2**: `@min(param_runtime, comptime_int)` produce
   risultati errati; workaround con `if`. Rivedere quando il bug sarà fixato.
3. **Endianness `DataView`**: `get/setFloat64` di `DataView` usano big-endian di
   default; la WASM è little-endian → passare sempre `true` come ultimo argomento
   (a differenza dei `Float32Array`, nativi LE). Verificato: 0 mismatch su 500
   contesti casuali.
4. **Gamut**: l'oklch→sRGB clampato sposta leggermente la hue sui passi a chroma
   alta; per un tema "vero" serve gamut mapping percettivo (OKLCH fit).
5. **SSR/Node**: `fetch(dataURL)` non disponibile in Node → fallback JS.
   Il path WASI (`wasm32-wasip1`) permetterà lo stesso engine lato server.

## Prossimi passi

- [x] Spostare lo scoring dell'agent (themeAgent.ts) in `agent.zig`
- [ ] Gamut mapping percettivo in `color.zig`
- [ ] Worker + lazy-load esplicito per non pesare sul primo render
- [ ] Build WASI per generare i temi a build-time (SSG)
