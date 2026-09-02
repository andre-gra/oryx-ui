# Roadmap & Piano Futuro — Oryx UI (WASM Engine)

## Stato Attuale
- **Engine Zig / WASM**: ✅ Porting completato, 22 test Zig verdi, zero-copy, endianness corretta (`littleEndian: true`), 0 mismatch su 500 contesti.
- **Integrazione Agent**: `ThemeAgent.getRecommendation` delega all'engine con fallback JS. ✅ Completa:
  - **Auto-init lazy**: `initEngine()` fire-and-forget nel constructor di `ThemeAgent` (zero impatto sul page load).
  - **Stato esposto**: `AgentState.engineMode` (`'wasm' | 'js' | 'loading'`), badge nel `ThemeAgentPanel`.
  - **Fallback silenzioso**: se WASM non è disponibile, l'algoritmo JS identico prende il controllo senza rotture.
- **Demo**: Pagina `/wasm-poc` operativa con benchmark e validazione (dev-only, accessibile via URL diretto).

---

## Task & Promemoria Futuri

### 1. ✅ Nascondere WasmPocPage agli utenti (Dev-only) — DONE
- [x] **Rimuovere il pulsante dalla navbar**: In `demo/components/Layout.tsx`, rimosso il link visibile che porta a `/wasm-poc`.
- [x] **Mantenere la rotta via URL**: la rotta `/wasm-poc` in `demo/App.tsx` resta registrata, accessibile solo tramite URL diretto per debug/sviluppo.

### 2. ✅ Gamut Mapping Percettivo (Color.zig)
- [x] Implementare `oklchToSrgbMapped` in `oryx-engine/src/color.zig` (riduzione iterativa del chroma per evitare alterazioni di hue con il clamp grezzo). **Completed**: function added, tests written, verified convergence and gamut mapping.
- [x] Scrivere i test nativi in Zig e aggiornare la validazione nella demo. **Completed**: unit tests added covering in‑gamut pass‑through, chroma reduction, hue preservation, lightness preservation, and edge cases.

### 3. ✅ Ottimizzazione Engine Core — DONE (lazy init)
- [x] **Auto-init dell'engine**: `initEngine()` ora parte automaticamente alla creazione di `ThemeAgent` (lazy, fire-and-forget) anziché solo nella pagina di POC. Se l'agent non viene usato, nessun costo al load della libreria.

### 4. UX theme preference & personalization
**Goal:** Bring AI‑driven theme personalization, compact two‑state toggle, and intelligent override handling to Oryx UI.

**Planned sub‑tasks:**
- **Refined toggle API** – Define a `ThemePreference` type (`system`, `light`, `dark`, `null`) and update `ThemeAgent` to manage explicit overrides while keeping internal engine modes (`wasm | js | loading`) hidden from the UI.
- **Compact two‑state UI component** – Build a single‑click toggle (icon + tooltip) that expresses “Follow system” vs “Custom”. Persist overrides in `localStorage` and auto‑clear only after explicit user interaction.
- **AI‑assisted personalization** – Integrate palette‑suggestion and context‑aware contrast using `Color.zig` gamut‑mapping; call an LLM (e.g., Gemini) to generate light/dark palettes from dominant page colors; store accepted palettes in a `ThemeProfile`.
- **Demo / Documentation** – Add an interactive `/theme-toggle-demo` page that replicates the Verou toggle lifecycle; document the behavior in `docs/roadmap/4-theme-personalization.md`.
- **Verify & Iterate** – Conduct usability testing, collect opt‑in telemetry on toggle usage, and refine tooltip/UX based on feedback.

**Milestones (target sprints)**
| Sprint | Deliverable |
|--------|-------------|
| 1️⃣ | API design & `ThemeAgent` updates (API & override logic) |
| 2️⃣ | UI component implementation & persistence logic |
| 3️⃣ | AI palette suggestion prototype + LLM integration |
| 4️⃣ | Demo page, documentation, and initial user testing |
| 5️⃣ | Final polish, telemetry validation, and roadmap update |

*All tasks will be tracked in the project board and linked to this roadmap entry.*

---

### 5. Generative UI — Architettura End-to-End (BEAM Micro-Service + React)

**Goal:** Progettare e implementare il backend (BEAM micro-service) e l'orchestrazione per una piattaforma di Generative UI, mantenendo lo stack attuale (React/Vite, TypeScript, Tailwind, ThemeAgent, Color.zig).

**Motivazione:** La BEAM VM è progettata per gestire milioni di connessioni concorrenti ad alta affidabilità; usiamo un micro-servizio BEAM per gestire gli stream LLM e la generazione dei widget, mantenendo il frontend React nativo senza riscrivere componenti UI.

**Planned sub-tasks:**
- **Design del tipo Widget condiviso** — Definire `type Widget = { MetricCard: { title: string; value: string } | BarChart: { labels: string[]; data: number[] } | TextWidget: { content: string } }` in un modulo condiviso (TypeScript o schema JSON) che sia usato sia dal backend BEAM che dal frontend React. Validazione dello stream LLM via schema (Zod) con fallimento sicuro su allucinazioni.
- **Orchestratore LLM su BEAM** — Implementare un processo BEAM (Actor) che riceve prompt via WebSocket, richiama l'LLM, e streamma token JSON (widget) al client. Usare LangChain/LlamaIndex o Vercel AI SDK per RAG, memoria e contesto.
- **Server-Driven Rendering via WebSocket** — Implementare il trasporto: connessione WebSocket bidirezionale da BEAM al client React. Il server serializza i widget tipizzati e li pusha come eventi parziali (draft → completed).
- **Gestione dello stream React (Model/Msg/Effect)** — Implementare il ciclo Elm-Architecture in React (usando hooks o un contesto) per gestire lo stato della connessione, i widget ricevuti e le patch. `Model` contiene `socket_status`, `widgets`, `draft_widget`; `Msg` include `OnServerMessage`, `OnSocketConnected`, `UserSentPrompt`; `Effect` gestisce la connessione WebSocket nativa tramite FFI o libreria WebSocket.
- **Rendering determinista & pattern matching** — La funzione `view` esegue pattern matching sui widget tipizzati per produrre componenti React nativi (Button, MetricCard, BarChart, etc.). Niente codice arbitrario generato dall'IA: il client rende solo costrutti che il tipo condiviso conosce.
- **Streaming progressivo (token per token)** — Aggiungere stato `draft_widget: Widget | null` per accumulare frammenti delta dall'LLM e aggiornare la bozza in tempo reale finché il frame non si chiude.
- **Documentazione & Demo** — Documentare l'architettura in `docs/roadmap/5-generative-ui-beam-micro.md`; creare una demo interattiva `/genui-stream-demo` che mostra l'interfaccia che si 'disegna da sola' in tempo reale.

**Piano a 4 sprint:**
| Sprint | Deliverable |
|--------|-------------|
| 1️⃣ | Tipi Widget condivisi + decoder + validazione schema (backend e frontend) |
| 2️⃣ | Orchestratore LLM su BEAM + WebSocket stream processo (backend) |
| 3️⃣ | Loop React (Model/Msg/Effect) + WebSocket FFI + rendering determinista |
| 4️⃣ | Streaming progressivo, demo interattiva, documentazione |

**Architettura di riferimento (BEAM Micro-Service + React):**
```
[ Input Utente ]
       │
       ▼
React App (Vite) ──WebSocket──► BEAM WS Process (Actor) ──► LLM Orchestrator (structured JSON stream)
       │                           │
       │ JSON / WebSocket Stream   │ Output Struct
       ▼                           ▼
React Renderer (pattern matching) ◄───── Type-Safe Decoders (Zod)
       │
       ▼
Dynamic View (pattern matching su Widget) → VNode nativi
```

**Vantaggi chiave della scelta:**
- Concorrenza senza lock: centinaia di contesti IA e socket aperti con poche risorse.
- Codice condiviso: stessi tipi e decodificatori nel backend BEAM e nel frontend.
- Zero XSS / allucinazioni nel rendering: il client rende solo costrutti conosciuti dal tipo condiviso.
- Mantenimento dello stack attuale: React, Tailwind, ThemeAgent, Color.zig continuano a funzionare senza modifiche invasive.

*Questo lavoro esplora l'accoppiata BEAM + React come stack ideale per la Generative UI, differenziandosi dalla stack tradizionale Node/React/Next in favore di type-safety end-to-end e affidabilità concorrente.*