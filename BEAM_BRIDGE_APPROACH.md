# Approccio BEAM + Stack Attuale (Oryx UI)

Stack corrente: TypeScript (React/Vite), Zig WASM, ThemeAgent, Tailwind.
Stack aggiunto: BEAM (Elixir/Erlang) come servizio concorrente.

---

## Opzione 1: BEAM come Micro-Servizio (Consigliato — Minimo impatto)

Architettura:
```
┌─────────────────────┐         WebSocket (JSON Stream)        ┌─────────────────┐
│  React / Vite       │ ◄─────────────────────────────────────── │  Elixir / BEAM  │
│  (Oryx UI)          │         SSE / WebSocket                 │  (LLM Stream) │
│  ThemeAgent         │                                         │  GenUI Engine │
│  Componenti Nativi  │         HTTP / REST (fallback)         │  Sessioni        │
└─────────────────────┘                                         └─────────────────┘
```

Perché funziona con il tuo stack:
- Il frontend React resta esattamente lo stesso.
- Il ThemeAgent (o un nuovo `GenUIAgent`) apre una connessione WebSocket verso il servizio BEAM.
- BEAM gestisce milioni di sessioni concorrenti (uno processo per connessione WebSocket, pochi KB ciascuno).
- Quando arriva un frame JSON (widget generativo), React lo decodifica e renderizza i componenti nativi (Button, MetricCard, etc.) tramite pattern matching — esattamente come nel modello Lustre ma in TypeScript.

Vantaggi:
- Zero cambiamenti ai componenti UI esistenti.
- Il servizio BEAM può crashare o rallentare senza impattare il frontend (isolamento per sessione).
- Si mantiene il WASM engine Zig per il calcolo locale, delegando solo lo stream LLM a BEAM.

Come implementare:
```typescript
// src/agents/genUIAgent.ts (nuovo file, affianca ThemeAgent)
import { WebSocketClient } from './wsClient';

export type Widget =
  | { type: 'MetricCard'; title: string; value: string }
  | { type: 'BarChart'; labels: string[]; data: number[] }
  | { type: 'TextWidget'; content: string };

export class GenUIAgent {
  private socket: WebSocketClient;
  private model: Widget[] = [];
  private draft: Widget | null = null;

  constructor(url: string) {
    this.socket = new WebSocketClient(url);
    this.socket.onMessage((raw) => {
      const frame = JSON.parse(raw);
      if (frame.event === 'delta') {
        this.draft = this.buildDraft(frame.payload); // accumula token
      } else if (frame.event === 'completed') {
        if (this.draft) this.model.push(this.draft);
        this.draft = null;
        this.notifyUpdate();
      }
    });
  }

  sendPrompt(text: string) {
    this.socket.send(JSON.stringify({ event: 'prompt', payload: text }));
  }

  getWidgets(): Widget[] { return [ ...this.model, ...(this.draft ? [this.draft] : []) ]; }
}
```

---
## Opzione 2: Elixir + Phoenix Channels (Integrazione più stretta)

Se vuoi un backend BEAM più strutturato, Phoenix Channels offre un protocollo WebSocket maturo con gestione delle sessioni integrata.

Architettura:
```
React App (Vite) ──WebSocket──► Phoenix Channel (Elixir/BEAM)
                                    │
                                    ▼
                              LLM Orchestrator (GenServer per sessione)
                              │
                              ▼
                              RAG / Memory / Context
                              │
                              ▼
                              Structured JSON Stream (Widget Schema)
```

Il codice Elixir per una sessione:
```elixir
# lib/gen_ui/channels/ui_channel.ex
defmodule GenUI.UIChannel do
  use Phoenix.Channel

  def join("genui:stream", _payload, socket) do
    # Un GenServer per ogni connessione WebSocket
    {:ok, GenServer.start_link(UIStreamWorker, %{})}
  end

  def handle_in("prompt", %{"text" => text}, socket) do
    # Invio all'LLM con structured output
    UIStreamWorker.start_stream(socket.assigns.session_pid, text)
    {:noreply, socket}
  end
end
```

Il frontend React usa `phoenix-channels` via npm o una semplice connessione WebSocket nativa verso `/socket/websocket`.

Perché questa opzione è potente:
- Phoenix gestisce automaticamente la riconnessione, l'autenticazione e la presenza.
- Ogni utente ha un GenServer isolato: se un LLM va in timeout, il crash non impatta altri utenti (filosofia "Let it crash").
- Si mantiene il frontend TypeScript senza dover riscrivere nulla.

---
## Opzione 3: ErlPort / Erlang Node (Bridge Nativo)

Se preferisci non avere un servizio separato, puoi usare `erlang-node` o `erlport` per collegare direttamente il processo Node.js/Vite con la VM BEAM.

Questo è il più invasivo ma il più integrato: il server Vite o un processo Node separato comunica via messaggi con un nodo Erlang che gestisce la concorrenza.

Non consigliato per il caso d'uso attuale (il Micro-Servizio è più pulito), ma utile se in futuro vuoi che BEAM sia un'embedded engine all'interno dell'app React.

---
## Raccomandazione per Oryx UI

Data la natura della libreria (componenti React + theming AI), **l'Opzione 1 (BEAM Micro-Servizio)** è il percorso più naturale:

1. **Non si tocca il codice esistente**: i componenti (Button, Accordion, ThemeAgent) restano invariati.
2. **Il WASM engine Zig continua a funzionare** per il calcolo locale (gamut mapping, contrasto).
3. **BEAM assume solo il ruolo di orchestratore concorrente**: gestisce gli stream LLM, la memoria RAG e la generazione dei widget.
4. **Il frontend TypeScript decodifica e renderizza**: esattamente come il modello Lustre ma con `type Widget = ...` nativo di TypeScript, pattern matching tramite `switch(widget.type)`.

Questo ti permette di dire: "Abbiamo la potenza della concorrenza BEAM per milioni di utenti, ma il rendering resta il nostro React nativo con Tailwind — nessun lock-in, nessun abbandono dello stack attuale."
