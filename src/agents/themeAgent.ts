import type { Theme } from '../themes/themeProvider'
import type { Size } from '../themes/sizeProvider'
import type {
  StyleInteraction,
  StylePreference,
  AgentRecommendation,
  AgentMode,
  EngineMode,
} from './agentTypes'
import { InteractionTracker } from './interactionTracker'
import { GoogleGenAI } from '@google/genai'
import { GEMINI_API_KEY } from '../config'
import { availableThemes } from './availableThemes'
import { agentRecommend, type AgentInput } from '../engine/agent'
import { initEngine } from '../engine/core'
import {
  themePreferenceStore,
  type ThemePreference,
} from '../types/themePreference'
import type { ThemeProfile } from '../types/themeProfile'
import { isValidThemeProfile } from '../types/themeProfile'

const PREFERENCES_KEY = 'oryx-theme-preferences'
const MIN_INTERACTIONS = 5 // Minimum interactions before making confident recommendations
const SIZES: Size[] = ['2', '3', '4']

/**
 * AI Agent that learns user preferences and recommends theme/size combinations
 */
export class ThemeAgent {
  private tracker: InteractionTracker
  private preferences: Map<string, StylePreference> = new Map()
  private mode: AgentMode = 'full-automatic'
  private genAI?: GoogleGenAI
  private engineMode: EngineMode = 'loading'
  private engineReady: Promise<EngineMode>
  private currentPreference: ThemePreference = themePreferenceStore.get()
  private currentAiProfile: ThemeProfile | null = null
  private preferenceListeners: Set<(pref: ThemePreference) => void> = new Set()

  constructor() {
    this.tracker = new InteractionTracker()
    this.loadPreferences()
    // Lazy init del core Zig/WASM: fire-and-forget, nessun impatto sul page load.
    // Alla prima raccomandazione il motore sarà pronto; se manca, fallback JS automatico.
    this.engineReady = initEngine()
      .then((e) => {
        this.engineMode = e.mode
        return e.mode
      })
      .catch(() => {
        this.engineMode = 'js'
        return 'js' as EngineMode
      })
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
    } else {
      console.warn(
        'Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file. AI features will be limited.',
      )
    }
    // Sprint 1: sincronizza preferenza iniziale da localStorage
    this.currentPreference = themePreferenceStore.get()
    themePreferenceStore.subscribe((p) => {
      this.currentPreference = p
      this.notifyPreferenceChange()
    })
  }

  /**
   * Record a theme/size change
   */
  recordChange(theme: Theme, size: Size): void {
    this.tracker.startSession(theme, size)
    this.updatePreferences()
  }

  /**
   * Generates a theme based on a natural language prompt using an LLM.
   */
  async generateThemeFromPrompt(prompt: string): Promise<Theme> {
    if (!this.genAI) {
      console.warn('Gemini API not initialized. Falling back to default theme.')
      return 'theme-amber'
    }

    const llmPrompt = `You are a theme selection expert for a UI library.
Based on the user's prompt, select the most appropriate theme from the following list.
Return ONLY the name of the theme from the list, and nothing else.

Available themes: ${availableThemes.join(', ')}

User prompt: "${prompt}"`

    try {
      const result = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: llmPrompt,
      })

      const text = (result.text || '').trim()

      // Validate the response is a valid theme
      if (availableThemes.includes(text as Theme)) {
        return text as Theme
      } else {
        console.warn(`LLM returned an invalid theme: ${text}. Falling back to default.`)
        return 'theme-amber'
      }
    } catch (error) {
      console.error('Error generating theme from prompt:', error)
      return 'theme-amber' // Fallback on error
    }
  }

  /**
   * Estrae i colori CSS --oryx-* dominanti dal documento corrente.
   * Restituisce un oggetto con i valori delle variabili CSS rilevanti.
   */
  private extractCssColors(): Record<string, string> {
    if (typeof document === 'undefined' || !document.documentElement) {
      return {}
    }

    const computed = getComputedStyle(document.documentElement)
    const cssVars: Record<string, string> = {}

    // Lista delle variabili CSS --oryx-* da leggere
    const varNames = [
      '--oryx-color-primary',
      '--oryx-color-primary-50',
      '--oryx-color-primary-100',
      '--oryx-color-primary-200',
      '--oryx-color-primary-300',
      '--oryx-color-primary-400',
      '--oryx-color-primary-500',
      '--oryx-color-primary-600',
      '--oryx-color-primary-700',
      '--oryx-color-primary-800',
      '--oryx-color-primary-900',
      '--oryx-color-bg',
      '--oryx-color-bg-surface',
      '--oryx-color-text',
      '--oryx-color-text-primary',
      '--oryx-color-text-secondary',
    ]

    for (const varName of varNames) {
      const value = computed.getPropertyValue(varName).trim()
      if (value) {
        cssVars[varName] = value
      }
    }

    return cssVars
  }

  /**
   * Genera una palette AI personalizzata basata sui colori dominanti della pagina.
   * Usa Gemini con structured output per restituire un ThemeProfile validato.
   */
  async suggestPalette(prompt?: string): Promise<ThemeProfile | null> {
    if (!this.genAI) {
      console.warn(
        'Gemini API not initialized. Cannot suggest AI palette. Set VITE_GEMINI_API_KEY in your .env file.',
      )
      return null
    }

    // 1. Estrai i colori CSS --oryx-* dal documento corrente
    const domColors = this.extractCssColors()

    // 2. Costruisci il prompt strutturato per Gemini
    const llmPrompt = `You are a color palette expert for a UI library.
Based on the dominant colors found on the current page, generate a harmonious theme palette
${prompt ? `that matches this user request: "${prompt}".\n` : '.\n'}
You MUST return ONLY a valid JSON object (no markdown, no code fences, no comments) matching exactly this schema:

{
  "id": "ai-palette-<unique-suffix>",
  "name": "<descriptive name of the palette>",
  "light": {
    "primary": "#RRGGBB",
    "bg": "#RRGGBB",
    "text": "#RRGGBB"
  },
  "dark": {
    "primary": "#RRGGBB",
    "bg": "#RRGGBB",
    "text": "#RRGGBB"
  },
  "acceptedAt": null
}

Rules:
- All colors MUST be hex format: # followed by exactly 6 hex digits (e.g. #ff8800, #1A2B3C).
- "id" must be a non-empty string, unique for palette (suggest "ai-palette-1", "ai-palette-2", etc.).
- "name" must be a non-empty human-readable description (e.g. "Warm sunset palette").
- "light.bg" should be a light background, "light.text" should be a dark text for contrast.
- "dark.bg" should be a dark background, "dark.text" should be a light text for contrast.
- "primary" is the accent color and should be harmonious with the dominant page colors.
- "acceptedAt" MUST be null.

Dominant colors found on the page (CSS custom properties --oryx-*):
${JSON.stringify(domColors, null, 2)}

Return ONLY the JSON object.`

    try {
      // 3. Chiama Gemini chiedendo JSON in risposta
      const result = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: llmPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      })

      const text = (result.text || '').trim()

      // 4. Parse del JSON
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch (parseError) {
        console.warn('AI palette response is not valid JSON:', text, parseError)
        return null
      }

      // 5. Validazione con type guard
      if (isValidThemeProfile(parsed)) {
        // acceptedAt è garantito null dal type guard
        return {
          id: parsed.id,
          name: parsed.name,
          light: { ...parsed.light },
          dark: { ...parsed.dark },
          acceptedAt: null,
        }
      }

      console.warn('AI palette response failed validation:', parsed)
      return null
    } catch (error) {
      console.error('Error generating AI palette suggestion:', error)
      return null
    }
  }

  /**
   * Get current recommendation based on learned preferences
   */
  getRecommendation(): AgentRecommendation | null {
    const interactions = this.tracker.getRecentInteractions(30)

    // Not enough data to make recommendations
    if (interactions.length < MIN_INTERACTIONS) {
      return null
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay()
    const nowMs = Date.now()

    // Map interactions to numeric ids (index into availableThemes / SIZES)
    const inputs: AgentInput[] = interactions.map((i) => ({
      themeId: availableThemes.indexOf(i.theme),
      sizeId: SIZES.indexOf(i.size),
      timestampMs: i.timestamp,
      durationMs: i.duration || 0,
      dayOfWeek: i.dayOfWeek,
      hourOfDay: i.hourOfDay,
    }))

    // Scoring delegated to the oryx-engine (Zig -> WASM, con fallback JS)
    const rec = agentRecommend(inputs, currentHour, currentDay, nowMs)
    if (!rec) return null

    const theme = availableThemes[rec.themeId]
    const size = SIZES[rec.sizeId]

    return {
      theme: theme || 'theme-amber',
      size,
      confidence: rec.confidence,
      reason: this.generateReason(theme || 'theme-amber', size, currentHour),
    }
  }

  /**
   * Get insights about user preferences
   */
  getInsights(): string[] {
    const insights: string[] = []
    const interactions = this.tracker.getRecentInteractions(30)

    if (interactions.length < MIN_INTERACTIONS) {
      insights.push(
        `Learning your preferences... (${interactions.length}/${MIN_INTERACTIONS} interactions recorded)`,
      )
      return insights
    }

    // Find most used combination
    const sorted = Array.from(this.preferences.values()).sort((a, b) => b.score - a.score)

    if (sorted.length > 0) {
      const favorite = sorted[0]
      const themeLabel = favorite.theme?.replace('theme-', '') ?? 'unknown'
      insights.push(`Your favorite combination: ${themeLabel} theme with size ${favorite.size}`)
    }

    // Time preference
    const timePrefs = this.getTimePreferences()
    if (timePrefs) {
      insights.push(timePrefs)
    }

    // Total tracking info
    insights.push(`Tracking ${interactions.length} recent interactions`)

    return insights
  }

  /**
   * Stato del core di scoring: 'wasm' (Zig) | 'js' (fallback) | 'loading'
   */
  getEngineMode(): EngineMode {
    return this.engineMode
  }

  /**
   * Risolve quando l'engine è pronto (con il mode effettivo).
   */
  awaitEngineReady(): Promise<EngineMode> {
    return this.engineReady
  }

  /**
   * Set agent mode
   */
  setMode(mode: AgentMode): void {
    this.mode = mode
  }

  getMode(): AgentMode {
    return this.mode
  }

  /** Sprint 1: preferenza esplicita e profilo AI */
  getPreference(): ThemePreference {
    return themePreferenceStore.get()
  }

  /** Imposta la preferenza utente (persiste e notifica). */
  setPreference(pref: ThemePreference): void {
    themePreferenceStore.set(pref)
    this.currentPreference = pref
    this.notifyPreferenceChange()
  }

  /** Rimuove esplicitamente la preferenza (solo interazione utente). */
  clearPreference(): void {
    themePreferenceStore.clear()
    this.currentPreference = null
    this.notifyPreferenceChange()
  }

  /** Profilo AI corrente. */
  getAiProfile(): ThemeProfile | null {
    return this.currentAiProfile
  }

  /** Accetta e memorizza un profilo AI. */
  acceptAiProfile(profile: ThemeProfile): void {
    this.currentAiProfile = { ...profile, acceptedAt: new Date() }
  }

  /** Registra un listener per i cambi di preferenza. Ritorna unsubscribe. */
  onPreferenceChange(listener: (pref: ThemePreference) => void): () => void {
    this.preferenceListeners.add(listener)
    return () => {
      this.preferenceListeners.delete(listener)
    }
  }

  /** Notifica tutti i listener iscritti. */
  private notifyPreferenceChange(): void {
    for (const listener of this.preferenceListeners) {
      try {
        listener(this.currentPreference)
      } catch {
        // Ignora errori individuali
      }
    }
  }

  /**
   * Get interaction count
   */
  getInteractionCount(): number {
    return this.tracker.getInteractionCount()
  }

  /**
   * Update preferences based on interaction history
   */
  private updatePreferences(): void {
    const interactions = this.tracker.getRecentInteractions(30)
    this.preferences.clear()

    // Aggregate interactions into preferences
    for (const interaction of interactions) {
      const key = this.getPreferenceKey(interaction.theme, interaction.size)
      const existing = this.preferences.get(key)

      if (existing) {
        existing.usageCount++
        existing.totalDuration += interaction.duration || 0
        existing.lastUsed = Math.max(existing.lastUsed, interaction.timestamp)
        this.updateTimePattern(existing, interaction)
        existing.dayPatterns[interaction.dayOfWeek]++
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
        }
        this.updateTimePattern(newPref, interaction)
        newPref.dayPatterns[interaction.dayOfWeek]++
        this.preferences.set(key, newPref)
      }
    }

    // Calculate scores
    for (const pref of this.preferences.values()) {
      pref.score = this.calculateScore(pref, interactions.length)
    }

    this.savePreferences()
  }

  /**
   * Calculate preference score
   */
  private calculateScore(pref: StylePreference, totalInteractions: number): number {
    const usageRatio = pref.usageCount / totalInteractions
    const avgDuration = pref.totalDuration / pref.usageCount
    const durationScore = Math.min(1, avgDuration / (30 * 60 * 1000)) // Normalize to 30 min

    return usageRatio * 0.7 + durationScore * 0.3
  }

  /**
   * Update time pattern for a preference
   */
  private updateTimePattern(pref: StylePreference, interaction: StyleInteraction): void {
    const hour = interaction.hourOfDay
    if (hour >= 6 && hour < 12) pref.timePatterns.morning++
    else if (hour >= 12 && hour < 18) pref.timePatterns.afternoon++
    else if (hour >= 18 && hour < 24) pref.timePatterns.evening++
    else pref.timePatterns.night++
  }

  /**
   * Get user's time preferences as a string
   */
  private getTimePreferences(): string | null {
    const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 }

    for (const pref of this.preferences.values()) {
      timeCounts.morning += pref.timePatterns.morning
      timeCounts.afternoon += pref.timePatterns.afternoon
      timeCounts.evening += pref.timePatterns.evening
      timeCounts.night += pref.timePatterns.night
    }

    const entries = Object.entries(timeCounts)
    const max = Math.max(...entries.map(([, v]) => v))
    const preferredTime = entries.find(([, v]) => v === max)?.[0]

    return preferredTime ? `You're most active in the ${preferredTime}` : null
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private generateReason(theme: Theme, size: Size, currentHour: number): string {
    const themeLabel = theme.replace('theme-', '')
    let timeContext = ''

    if (currentHour >= 6 && currentHour < 12) timeContext = 'morning'
    else if (currentHour >= 12 && currentHour < 18) timeContext = 'afternoon'
    else if (currentHour >= 18 && currentHour < 24) timeContext = 'evening'
    else timeContext = 'night'

    return `You often use ${themeLabel} (size ${size}) in the ${timeContext}`
  }

  /**
   * Get preference key
   */
  private getPreferenceKey(theme: Theme, size: Size): string {
    return `${theme}-${size}`
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        this.preferences = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error)
    }
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    try {
      const data = Object.fromEntries(this.preferences)
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save preferences:', error)
    }
  }
}
