/**
 * Oryx UI - A React component library with intelligent theming
 *
 * @packageDocumentation
 */

// Import CSS for bundling
import "./oryx.css";

// ============================================================================
// COMPONENTS
// ============================================================================

export { Accordion, type AccordionProps, type AccordionItem } from "./components/Accordion";

export {
  Select,
  type SelectProps,
  type SelectOption,
  type SelectOptionGroup,
} from "./components/Select";

export {
  AlertDialog,
  type AlertDialogProps,
  type AlertDialogTexts,
} from "./components/AlertDialog";

export {
  NavigationMenu,
  type NavigationMenuProps,
  type NavigationMenuSection,
  type NavigationMenuItem,
} from "./components/NavigationMenu";

export {
  Popover,
  type PopoverProps,
  type PopoverField,
  type PopoverFieldGroup,
} from "./components/Popover";

// ============================================================================
// THEMING
// ============================================================================

export { OryxProvider, type OryxProviderProps } from "./theme/OryxProvider";

export {
  ThemeProvider,
  SizeProvider,
  useTheme,
  useSize,
  type Theme,
  type Size,
  type ThemeContextProps,
  type SizeContextProps,
  ThemeContext,
  SizeContext,
} from "./theme";

// ============================================================================
// AI THEME AGENT
// ============================================================================

export {
  ThemeAgentProvider,
  useThemeAgent,
  ThemeAgent,
  InteractionTracker,
  AgentInteractionTracker,
  ThemeAgentContext,
  type ThemeAgentContextValue,
  type StyleInteraction,
  type StylePreference,
  type AgentRecommendation,
  type AgentState,
  type AgentMode,
} from "./agent";

// ============================================================================
// UI COMPONENTS (Additional)
// ============================================================================

export { ThemeAgentPanel } from "./ui/ThemeAgentPanel";
