import type { Theme } from "../themes/themeProvider";
import type { Size } from "../themes/sizeProvider";
import type {
  StyleInteraction,
  StylePreference,
  AgentRecommendation,
  AgentMode,
} from "./agentTypes";
import { InteractionTracker } from "./interactionTracker";

const PREFERENCES_KEY = "oryx-theme-preferences";
const MIN_INTERACTIONS = 5; // Minimum interactions before making confident recommendations

/**
 * AI Agent that learns user preferences and recommends theme/size combinations
 */
export class ThemeAgent {
  private tracker: InteractionTracker;
  private preferences: Map<string, StylePreference> = new Map();
  private mode: AgentMode = "full-automatic";

  constructor() {
    this.tracker = new InteractionTracker();
    this.loadPreferences();
  }

  /**
   * Record a theme/size change
   */
  recordChange(theme: Theme, size: Size): void {
    this.tracker.startSession(theme, size);
    this.updatePreferences();
  }

  /**
   * Generates a theme based on a natural language prompt.
   * For now, this is a simplified version using keyword matching.
   */
  generateThemeFromPrompt(prompt: string): Theme {
    const lowerPrompt = prompt.toLowerCase();
    let selectedTheme: Theme = "theme-amber"; // Default theme

    if (lowerPrompt.includes("dark")) {
      selectedTheme = "theme-slateDark"; // Example dark theme
      if (lowerPrompt.includes("blue")) selectedTheme = "theme-blueDark";
      else if (lowerPrompt.includes("red")) selectedTheme = "theme-redDark";
      else if (lowerPrompt.includes("green")) selectedTheme = "theme-greenDark";
    } else if (lowerPrompt.includes("light")) {
      selectedTheme = "theme-amber"; // Example light theme
      if (lowerPrompt.includes("blue")) selectedTheme = "theme-blue";
      else if (lowerPrompt.includes("red")) selectedTheme = "theme-red";
      else if (lowerPrompt.includes("green")) selectedTheme = "theme-green";
    } else {
        // More specific color keywords for light themes by default if no light/dark specified
        if (lowerPrompt.includes("blue")) selectedTheme = "theme-blue";
        else if (lowerPrompt.includes("red")) selectedTheme = "theme-red";
        else if (lowerPrompt.includes("green")) selectedTheme = "theme-green";
        else if (lowerPrompt.includes("orange")) selectedTheme = "theme-orange";
        else if (lowerPrompt.includes("pink")) selectedTheme = "theme-pink";
        else if (lowerPrompt.includes("purple")) selectedTheme = "theme-purple";
        else if (lowerPrompt.includes("grass")) selectedTheme = "theme-grass";
        else if (lowerPrompt.includes("sky")) selectedTheme = "theme-sky";
        else if (lowerPrompt.includes("mint")) selectedTheme = "theme-mint";
        else if (lowerPrompt.includes("teal")) selectedTheme = "theme-teal";
        else if (lowerPrompt.includes("violet")) selectedTheme = "theme-violet";
        else if (lowerPrompt.includes("crimson")) selectedTheme = "theme-crimson";
        else if (lowerPrompt.includes("brown")) selectedTheme = "theme-brown";
        else if (lowerPrompt.includes("indigo")) selectedTheme = "theme-indigo";
        else if (lowerPrompt.includes("yellow")) selectedTheme = "theme-yellow";
        else if (lowerPrompt.includes("lime")) selectedTheme = "theme-lime";
        else if (lowerPrompt.includes("plum")) selectedTheme = "theme-plum";
        else if (lowerPrompt.includes("cyan")) selectedTheme = "theme-cyan";

        // Check for specific dark themes if no 'dark' keyword but specific dark color is mentioned
        if (lowerPrompt.includes("mauve")) selectedTheme = "theme-mauveDark";
        else if (lowerPrompt.includes("olive")) selectedTheme = "theme-oliveDark";
        else if (lowerPrompt.includes("sage")) selectedTheme = "theme-sageDark";
        else if (lowerPrompt.includes("sand")) selectedTheme = "theme-sandDark";
        else if (lowerPrompt.includes("slate")) selectedTheme = "theme-slateDark";
    }

    return selectedTheme;
  }

  /**
   * Get current recommendation based on learned preferences
   */
  getRecommendation(): AgentRecommendation | null {
    const interactions = this.tracker.getRecentInteractions(30);

    // Not enough data to make recommendations
    if (interactions.length < MIN_INTERACTIONS) {
      return null;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Update preferences before recommending
    this.updatePreferences();

    // Score each preference based on context
    let bestScore = 0;
    let bestPreference: StylePreference | null = null;

    for (const pref of this.preferences.values()) {
      let score = pref.score;

      // Boost score based on time of day match
      const timeBoost = this.getTimeBoost(pref, currentHour);
      score *= 1 + timeBoost;

      // Boost score based on day of week match
      const dayBoost = pref.dayPatterns[currentDay] / Math.max(...pref.dayPatterns, 1);
      score *= 1 + dayBoost * 0.3;

      // Recency boost
      const daysSinceUse = (Date.now() - pref.lastUsed) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, 1 - daysSinceUse / 30);
      score *= 1 + recencyBoost * 0.2;

      if (score > bestScore) {
        bestScore = score;
        bestPreference = pref;
      }
    }

    if (!bestPreference) return null;

    // Calculate confidence (0-1)
    const totalInteractions = interactions.length;
    const confidence = Math.min(
      1,
      (bestPreference.usageCount / totalInteractions) * (totalInteractions / 20),
    );

    return {
      theme: bestPreference.theme,
      size: bestPreference.size,
      confidence,
      reason: this.generateReason(bestPreference, currentHour),
    };
  }

  /**
   * Get insights about user preferences
   */
  getInsights(): string[] {
    const insights: string[] = [];
    const interactions = this.tracker.getRecentInteractions(30);

    if (interactions.length < MIN_INTERACTIONS) {
      insights.push(
        `Learning your preferences... (${interactions.length}/${MIN_INTERACTIONS} interactions recorded)`,
      );
      return insights;
    }

    // Find most used combination
    const sorted = Array.from(this.preferences.values()).sort((a, b) => b.score - a.score);

    if (sorted.length > 0) {
      const favorite = sorted[0];
      const themeLabel = favorite.theme.replace("theme-", "");
      insights.push(`Your favorite combination: ${themeLabel} theme with size ${favorite.size}`);
    }

    // Time preference
    const timePrefs = this.getTimePreferences();
    if (timePrefs) {
      insights.push(timePrefs);
    }

    // Total tracking info
    insights.push(`Tracking ${interactions.length} recent interactions`);

    return insights;
  }

  /**
   * Set agent mode
   */
  setMode(mode: AgentMode): void {
    this.mode = mode;
  }

  /**
   * Get current mode
   */
  getMode(): AgentMode {
    return this.mode;
  }

  /**
   * Get interaction count
   */
  getInteractionCount(): number {
    return this.tracker.getInteractionCount();
  }

  /**
   * Update preferences based on interaction history
   */
  private updatePreferences(): void {
    const interactions = this.tracker.getRecentInteractions(30);
    this.preferences.clear();

    // Aggregate interactions into preferences
    for (const interaction of interactions) {
      const key = this.getPreferenceKey(interaction.theme, interaction.size);
      const existing = this.preferences.get(key);

      if (existing) {
        existing.usageCount++;
        existing.totalDuration += interaction.duration || 0;
        existing.lastUsed = Math.max(existing.lastUsed, interaction.timestamp);
        this.updateTimePattern(existing, interaction);
        existing.dayPatterns[interaction.dayOfWeek]++;
      } else {
        const newPref: StylePreference = {
          theme: interaction.theme,
          size: interaction.size,
          usageCount: 1,
          totalDuration: interaction.duration || 0,
          lastUsed: interaction.timestamp,
          score: 0,
          timePatterns: { morning: 0, afternoon: 0, evening: 0, night: 0 },
          dayPatterns: [0, 0, 0, 0, 0, 0, 0],
        };
        this.updateTimePattern(newPref, interaction);
        newPref.dayPatterns[interaction.dayOfWeek]++;
        this.preferences.set(key, newPref);
      }
    }

    // Calculate scores
    for (const pref of this.preferences.values()) {
      pref.score = this.calculateScore(pref, interactions.length);
    }

    this.savePreferences();
  }

  /**
   * Calculate preference score
   */
  private calculateScore(pref: StylePreference, totalInteractions: number): number {
    const usageRatio = pref.usageCount / totalInteractions;
    const avgDuration = pref.totalDuration / pref.usageCount;
    const durationScore = Math.min(1, avgDuration / (30 * 60 * 1000)); // Normalize to 30 min

    return usageRatio * 0.7 + durationScore * 0.3;
  }

  /**
   * Update time pattern for a preference
   */
  private updateTimePattern(pref: StylePreference, interaction: StyleInteraction): void {
    const hour = interaction.hourOfDay;
    if (hour >= 6 && hour < 12) pref.timePatterns.morning++;
    else if (hour >= 12 && hour < 18) pref.timePatterns.afternoon++;
    else if (hour >= 18 && hour < 24) pref.timePatterns.evening++;
    else pref.timePatterns.night++;
  }

  /**
   * Get time-based boost for a preference
   */
  private getTimeBoost(pref: StylePreference, currentHour: number): number {
    let pattern: keyof StylePreference["timePatterns"];
    if (currentHour >= 6 && currentHour < 12) pattern = "morning";
    else if (currentHour >= 12 && currentHour < 18) pattern = "afternoon";
    else if (currentHour >= 18 && currentHour < 24) pattern = "evening";
    else pattern = "night";

    const total = Object.values(pref.timePatterns).reduce((a, b) => a + b, 0);
    return total > 0 ? pref.timePatterns[pattern] / total : 0;
  }

  /**
   * Get user's time preferences as a string
   */
  private getTimePreferences(): string | null {
    const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    for (const pref of this.preferences.values()) {
      timeCounts.morning += pref.timePatterns.morning;
      timeCounts.afternoon += pref.timePatterns.afternoon;
      timeCounts.evening += pref.timePatterns.evening;
      timeCounts.night += pref.timePatterns.night;
    }

    const entries = Object.entries(timeCounts);
    const max = Math.max(...entries.map(([, v]) => v));
    const preferredTime = entries.find(([, v]) => v === max)?.[0];

    return preferredTime ? `You're most active in the ${preferredTime}` : null;
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private generateReason(pref: StylePreference, currentHour: number): string {
    const themeLabel = pref.theme.replace("theme-", "");
    let timeContext = "";

    if (currentHour >= 6 && currentHour < 12) timeContext = "morning";
    else if (currentHour >= 12 && currentHour < 18) timeContext = "afternoon";
    else if (currentHour >= 18 && currentHour < 24) timeContext = "evening";
    else timeContext = "night";

    return `You often use ${themeLabel} (size ${pref.size}) in the ${timeContext}`;
  }

  /**
   * Get preference key
   */
  private getPreferenceKey(theme: Theme, size: Size): string {
    return `${theme}-${size}`;
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.preferences = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn("Failed to load preferences:", error);
    }
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    try {
      const data = Object.fromEntries(this.preferences);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save preferences:", error);
    }
  }
}
