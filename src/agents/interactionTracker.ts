import type { Theme } from "../themes/themeProvider";
import type { Size } from "../themes/sizeProvider";
import type { StyleInteraction } from "./agentTypes";

const STORAGE_KEY = "oryx-theme-interactions";

/**
 * Tracks user interactions with theme and size selections
 */
export class InteractionTracker {
  private interactions: StyleInteraction[] = [];
  private currentSession: {
    theme: Theme;
    size: Size;
    startTime: number;
  } | null = null;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Start tracking a new theme/size session
   */
  startSession(theme: Theme, size: Size): void {
    // End previous session if exists
    if (this.currentSession) {
      this.endSession();
    }

    this.currentSession = {
      theme,
      size,
      startTime: Date.now(),
    };
  }

  /**
   * End the current session and record the interaction
   */
  endSession(): void {
    if (!this.currentSession) return;

    const now = Date.now();
    const duration = now - this.currentSession.startTime;
    const date = new Date(this.currentSession.startTime);

    const interaction: StyleInteraction = {
      theme: this.currentSession.theme,
      size: this.currentSession.size,
      timestamp: this.currentSession.startTime,
      duration,
      dayOfWeek: date.getDay(),
      hourOfDay: date.getHours(),
    };

    this.interactions.push(interaction);
    this.currentSession = null;

    // Keep only last 1000 interactions to prevent excessive storage
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-1000);
    }

    this.saveToStorage();
  }

  /**
   * Get all recorded interactions
   */
  getInteractions(): StyleInteraction[] {
    return [...this.interactions];
  }

  /**
   * Get interactions within a time range
   */
  getInteractionsInRange(startTime: number, endTime: number): StyleInteraction[] {
    return this.interactions.filter((i) => i.timestamp >= startTime && i.timestamp <= endTime);
  }

  /**
   * Get recent interactions (last N days)
   */
  getRecentInteractions(days: number = 30): StyleInteraction[] {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.interactions.filter((i) => i.timestamp >= cutoff);
  }

  /**
   * Clear all interaction history
   */
  clearHistory(): void {
    this.interactions = [];
    this.currentSession = null;
    this.saveToStorage();
  }

  /**
   * Get total number of interactions
   */
  getInteractionCount(): number {
    return this.interactions.length;
  }

  /**
   * Load interactions from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.interactions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load interaction history:", error);
      this.interactions = [];
    }
  }

  /**
   * Save interactions to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.interactions));
    } catch (error) {
      console.warn("Failed to save interaction history:", error);
    }
  }
}
