# Oryx UI

A React component library with intelligent theming based on Radix UI primitives. Features an AI-powered theme agent that learns your preferences and automatically applies optimal theme combinations.

## ⚠️ Please note that this package is currently in alpha and is not ready for production use !!

## Installation

```bash
npm install oryx-ui
```

## Quick Start

```tsx
import { OryxProvider, Accordion, Select, AlertDialog } from 'oryx-ui';
import 'oryx-ui/styles.css';

function App() {
  return (
    <OryxProvider defaultTheme="theme-amber">
      <YourApp />
    </OryxProvider>
  );
}
```

## Features

- 🎨 **40+ Theme Variants** - Beautiful color palettes with light and dark modes
- 📐 **3 Size Options** - Compact, default, and large component sizes
- 🤖 **AI Theme Agent** - Learns preferences and auto-applies themes based on time/context
- ♿ **Accessible** - Built on Radix UI primitives with full ARIA support
- 🎯 **TypeScript** - Complete type definitions included

## Components

### Accordion

```tsx
import { Accordion } from 'oryx-ui';

<Accordion
  items={[
    { mainText: "Section 1", collapsibleText: "Content 1" },
    { mainText: "Section 2", collapsibleText: "Content 2" }
  ]}
/>
```

### Select

```tsx
import { Select } from 'oryx-ui';

<Select
  label="Choose fruit"
  placeholder="Select..."
  options={[
    { label: "Fruits", group: [{ value: "apple", label: "Apple" }] }
  ]}
  onValueChange={(value) => console.log(value)}
/>
```

### AlertDialog

```tsx
import { AlertDialog } from 'oryx-ui';

<AlertDialog
  texts={{
    buttonTrigger: "Delete",
    content: "Are you sure?",
    description: "This action cannot be undone.",
    buttonCancel: "Cancel",
    action: "Delete"
  }}
  onAction={() => handleDelete()}
/>
```

### NavigationMenu

```tsx
import { NavigationMenu } from 'oryx-ui';

<NavigationMenu
  items={[
    {
      title: "Products",
      item: [
        { type: "card", title: "Featured", href: "/", text: "Our main product" },
        { type: "text", title: "Other", href: "/other", text: "Description" }
      ]
    },
    { title: "About", href: "/about" }
  ]}
/>
```

### Popover

```tsx
import { Popover } from 'oryx-ui';

<Popover
  buttonTriggerLabel="Settings"
  fields={[
    {
      fieldTitle: "Dimensions",
      field: [{ label: "Width", htmlFor: "width", id: "width", defaultValue: "100%" }]
    }
  ]}
/>
```

### Radio

```tsx
import { Radio } from 'oryx-ui';

// Basic group
<Radio
  label="Plan"
  name="plan"
  defaultValue="basic"
  items={[
    { value: "basic", label: "Basic" },
    { value: "pro", label: "Pro" }
  ]}
/>

// Nested radio groups
<Radio
  label="Plan"
  name="plan"
  items={[
    { value: "basic", label: "Basic" },
    {
      label: "Enterprise",
      defaultValue: "eu",
      items: [
        { value: "eu", label: "EU" },
        { value: "us", label: "US" }
      ]
    }
  ]}
/>

// Reset from a Form
const ref = useRef();
<Radio
  ref={ref}
  label="Plan"
  name="plan"
  defaultValue="basic"
  resetKey={formResetKey}
  items={[{ value: "basic", label: "Basic" }, { value: "pro", label: "Pro" }]}
/>
// ref.current.reset()          — imperative reset
// ref.current.getValues()      — { plan: "basic", "plan-1": "us" }
```

## Theming

### Available Themes

Themes follow the naming pattern `theme-{color}` or `theme-{color}Dark`:

- `theme-amber`, `theme-amberDark`
- `theme-blue`, `theme-blueDark`
- `theme-crimson`, `theme-crimsonDark`
- `theme-cyan`, `theme-cyanDark`
- `theme-green`, `theme-greenDark`
- `theme-indigo`, `theme-indigoDark`
- `theme-mint`, `theme-mintDark`
- `theme-orange`, `theme-orangeDark`
- `theme-pink`, `theme-pinkDark`
- `theme-plum`, `theme-plumDark`
- `theme-purple`, `theme-purpleDark`
- `theme-red`, `theme-redDark`
- `theme-sky`, `theme-skyDark`
- `theme-teal`, `theme-tealDark`
- `theme-tomato`, `theme-tomatoDark`
- `theme-violet`, `theme-violetDark`
- `theme-yellow`, `theme-yellowDark`
- And more...

### Using Theme Hooks

```tsx
import { useTheme, useSize } from 'oryx-ui';

function MyComponent() {
  const { theme, changeTheme } = useTheme();
  const { size, changeSize } = useSize();

  return (
    <button onClick={() => changeTheme('theme-blueDark')}>
      Current: {theme}
    </button>
  );
}
```

## AI Theme Agent

The library includes an intelligent agent that learns from user interactions:

```tsx
import { OryxProvider, useThemeAgent, ThemeAgentPanel } from 'oryx-ui';

// Enable agent (on by default)
<OryxProvider enableAgent={true}>
  <App />
</OryxProvider>

// Access agent in components
function Settings() {
  const { state, recommendation, getInsights } = useThemeAgent();
  
  return (
    <div>
      <p>Interactions tracked: {state.interactionCount}</p>
      <ThemeAgentPanel /> {/* Built-in UI panel */}
    </div>
  );
}
```

## Oryx Engine (Zig → WASM)

Il core di scoring dell'agente è compilato in **Zig** ed eseguito come modulo **WebAssembly** (`oryx-engine.wasm`), con un fallback **JavaScript identico** (f64, deterministico) quando WASM non è disponibile (browser vecchi, CSP restrittive).

- **Auto-init lazy**: il modulo viene caricato al primo utilizzo dell'agente (una sola fetch, fire-and-forget) — nessun impatto sul page load.
- **Zero-copy**: le interazioni vengono scritte direttamente nella linear memory WASM (struct a 24 byte, little-endian), senza serializzazione né allocazioni nel path di scoring.
- **Stato osservabile**: `state.engineMode` espone `'wasm' | 'js' | 'loading'`; il `ThemeAgentPanel` mostra un badge con il core attivo.
- **Parità verificata**: `validateAgent()` confronta WASM e JS sugli stessi input (0 mismatch su 500+ contesti); benchmark in `/wasm-poc` (dev, via URL diretto).

Theming e colori usano lo stesso pattern: `engine.themeFromSeed()`, `engine.contrast()` ecc. (vedi `src/engine/core.ts`).

```ts
import { initEngine, engine, isWasmActive } from 'oryx-ui';

// Init esplicito (opzionale: l'agente lo fa già in lazy)
await initEngine();
console.log(engine.mode); // 'wasm' | 'js'
```

## Peer Dependencies

```json
{
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0"
}
```

## License

MIT

## Author

[andre-gra](https://github.com/andre-gra)
