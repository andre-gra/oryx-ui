# Roadmap & Piano Futuro — Oryx UI (WASM Engine)

## Stato Attuale
- **Engine Zig / WASM**: Porting completato, 22 test Zig verdi, zero-copy, endianness corretta (`littleEndian: true`), 0 mismatch su 500 contesti.
- **Integrazione Agent**: `ThemeAgent.getRecommendation` delega all'engine con fallback JS.
- **Demo**: Pagina `/wasm-poc` operativa con benchmark e validazione.

---

## Task & Promemoria Futuri

### 1. Nascondere WasmPocPage agli utenti (Dev-only)
- [ ] **Rimuovere il pulsante dalla navbar**: In `demo/components/Layout.tsx`, rimuovere il link visibile agli utenti che porta a `/wasm-poc`.
- [ ] **Mantenere la rotta via URL**: Lasciare registrata la rotta `/wasm-poc` in `demo/App.tsx` in modo che resti accessibile solo tramite URL diretto per scopi di debug/sviluppo.

### 2. Gamut Mapping Percettivo (Color.zig)
- [ ] Implementare `oklchToSrgbMapped` in `oryx-engine/src/color.zig` (riduzione iterativa del chroma per evitare alterazioni di hue con il clamp grezzo).
- [ ] Scrivere i test nativi in Zig e aggiornare la validazione nella demo.

### 3. Ottimizzazione Engine Core
- [ ] Valutare se inizializzare automaticamente l'engine (`initEngine()`) all'avvio della libreria anziché demandarlo solo alla pagina di POC.