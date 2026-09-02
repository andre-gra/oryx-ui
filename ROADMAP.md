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