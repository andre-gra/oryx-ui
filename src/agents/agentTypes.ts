import type { Theme } from "../themes/themeProvider";
import type { Size } from "../themes/sizeProvider";

/**
 * Represents a single interaction event when user changes theme or size
 */
export interface StyleInteraction {
  theme: Theme;
  size: Size;
  timestamp: number;
  duration?: number; // How long this combination was active (in milliseconds)
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hourOfDay: number; // 0-23
}

/**
 * Aggregated preference data for a specific theme+size combination
 */
export interface StylePreference {
  theme: Theme;
  size: Size;
  usageCount: number;
  totalDuration: number; // Total time spent with this combination
  lastUsed: number; // Timestamp
  score: number; // Computed preference score
  timePatterns: {
    morning: number; // 6-12
    afternoon: number; // 12-18
    evening: number; // 18-24
    night: number; // 0-6
  };
  dayPatterns: number[]; // Usage count per day [Sun, Mon, Tue, ...]
}

/**
 * AI agent recommendation with confidence score
 */
export interface AgentRecommendation {
  theme: Theme;
  size: Size;
  confidence: number; // 0-1
  reason: string; // Human-readable explanation
}

/**
 * Overall agent state and configuration
 */
export interface AgentState {
  mode: AgentMode;
  isActive: boolean;
  isLearning: boolean;
  interactionCount: number;
  lastRecommendation?: AgentRecommendation;
  currentSession: {
    theme: Theme;
    size: Size;
    startTime: number;
  };
}

/**
 * Agent automation mode
 */
export type AgentMode = "passive" | "semi-automatic" | "full-automatic";

/**
 * Stored data structure in localStorage
 */
export interface AgentStorage {
  interactions: StyleInteraction[];
  preferences: Map<string, StylePreference>;
  state: AgentState;
  version: string; // For future migrations
}

/**
 * Context value for the theme agent provider
 */
export interface ThemeAgentContextValue {
  state: AgentState;
  recommendation: AgentRecommendation | null;
  enableAgent: () => void;
  disableAgent: () => void;
  setMode: (mode: AgentMode) => void;
  getInsights: () => string[];
  forceRecommendation: () => void;
}
