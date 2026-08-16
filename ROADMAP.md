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

### 2. Gamut Mapping Percettivo (Color.zig)
- [x] Implementare `oklchToSrgbMapped` in `oryx-engine/src/color.zig` (riduzione iterativa del chroma per evitare alterazioni di hue con il clamp grezzo). **Completed**: function added, tests written, verified convergence and gamut mapping.
- [x] Scrivere i test nativi in Zig e aggiornare la validazione nella demo. **Completed**: unit tests added covering in‑gamut pass‑through, chroma reduction, hue preservation, lightness preservation, and edge cases.

### 3. ✅ Ottimizzazione Engine Core — DONE (lazy init)
- [x] **Auto-init dell'engine**: `initEngine()` ora parte automaticamente alla creazione di `ThemeAgent` (lazy, fire-and-forget) anziché solo nella pagina di POC. Se l'agent non viene usato, nessun costo al load della libreria.