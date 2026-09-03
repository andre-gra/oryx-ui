/**
 * Verifica se un oggetto è un ThemeProfile valido.
 * Type guard che valida manualmente tutti i campi obbligatori.
 */
export function isValidThemeProfile(obj: unknown): obj is ThemeProfile {
  // Hex color regex: # followed by exactly 6 hex digits
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

  // Must be an object
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const profile = obj as Record<string, unknown>

  // Validate id: non-empty string
  if (typeof profile.id !== 'string' || profile.id.trim().length === 0) {
    return false
  }

  // Validate name: non-empty string
  if (typeof profile.name !== 'string' || profile.name.trim().length === 0) {
    return false
  }

  // Validate light palette
  if (typeof profile.light !== 'object' || profile.light === null) {
    return false
  }
  const light = profile.light as Record<string, unknown>
  if (
    typeof light.primary !== 'string' ||
    !hexColorRegex.test(light.primary) ||
    typeof light.bg !== 'string' ||
    !hexColorRegex.test(light.bg) ||
    typeof light.text !== 'string' ||
    !hexColorRegex.test(light.text)
  ) {
    return false
  }

  // Validate dark palette
  if (typeof profile.dark !== 'object' || profile.dark === null) {
    return false
  }
  const dark = profile.dark as Record<string, unknown>
  if (
    typeof dark.primary !== 'string' ||
    !hexColorRegex.test(dark.primary) ||
    typeof dark.bg !== 'string' ||
    !hexColorRegex.test(dark.bg) ||
    typeof dark.text !== 'string' ||
    !hexColorRegex.test(dark.text)
  ) {
    return false
  }

  // acceptedAt must be null for AI-generated profiles
  if (profile.acceptedAt !== null) {
    return false
  }

  return true
}

/**
 * Profilo palette generato dall'AI.
 * Creato da un LLM a partire dai colori dominanti della pagina.
 */
export type ThemeProfile = {
  /** Identificatore unico del profilo. */
  id: string
  /** Nome descrittivo del profilo. */
  name: string
  /** Palette per il tema chiaro. */
  light: {
    primary: string
    bg: string
    text: string
  }
  /** Palette per il tema scuro. */
  dark: {
    primary: string
    bg: string
    text: string
  }
  /** Data di accettazione esplicita da parte dell'utente, o null se non ancora accettato. */
  acceptedAt: Date | null
}
