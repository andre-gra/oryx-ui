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
