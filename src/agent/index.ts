// Re-exports from original agents location
export {
  default as ThemeAgentProvider,
  ThemeAgentContext,
  type ThemeAgentContextValue,
} from '../agents/themeAgentProvider'
export { useThemeAgent } from '../agents/useThemeAgent'
export { ThemeAgent } from '../agents/themeAgent'
export { InteractionTracker } from '../agents/interactionTracker'
export { AgentInteractionTracker } from '../agents/AgentInteractionTracker'
export type {
  StyleInteraction,
  StylePreference,
  AgentRecommendation,
  AgentState,
  AgentMode,
  EngineMode,
  ThemeAgentContextValue as AgentContextValue,
} from '../agents/agentTypes'

// Sprint 1: preferenza tema e profilo AI
export type { ThemePreference } from '../types/themePreference'
export { STORAGE_KEY_THEME_PREFERENCE, themePreferenceStore } from '../types/themePreference'
export type { ThemeProfile } from '../types/themeProfile'
