/**
 * Tipo dell'esplicita preferenza di tema dell'utente.
 * Separato da engineMode (wasm|js|loading) per isolare la logica di personalizzazione.
 */
export type ThemePreference = 'system' | 'light' | 'dark' | null

/** Chiave localStorage per persistire la preferenza. */
export const STORAGE_KEY_THEME_PREFERENCE = 'oryx-theme-pref'

/** Listener chiamato quando la preferenza cambia. */
export type ThemePreferenceListener = (pref: ThemePreference) => void

/** Interfaccia dello store della preferenza di tema. */
export interface ThemePreferenceStore {
  /** Legge la preferenza corrente. */
  get(): ThemePreference
  /** Scrive la preferenza e notifica i listener. */
  set(pref: ThemePreference): void
  /** Rimuove la preferenza da localStorage (solo esplicita). */
  clear(): void
  /** Iscrive un listener; ritorna la funzione di unsubscribe. */
  subscribe(listener: ThemePreferenceListener): () => void
}

/**
 * Implementazione di default del ThemePreferenceStore.
 * Usa localStorage con fallback in-memory per ambienti SSR/Node.
 */
export const themePreferenceStore: ThemePreferenceStore = {
  get(): ThemePreference {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY_THEME_PREFERENCE)
        if (raw === null || raw === 'null') return null
        if (raw === 'system' || raw === 'light' || raw === 'dark') return raw
        return null
      }
    } catch {
      // localStorage non disponibile o bloccato
    }
    return null
  },

  set(pref: ThemePreference): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (pref === null) {
          window.localStorage.removeItem(STORAGE_KEY_THEME_PREFERENCE)
        } else {
          window.localStorage.setItem(STORAGE_KEY_THEME_PREFERENCE, pref)
        }
      }
    } catch {
      // Ignora errori di scrittura
    }
    // Notifica i listener iscritti
    notifyListeners(pref)
  },

  clear(): void {
    this.set(null)
  },

  subscribe(listener: ThemePreferenceListener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

/** Set interno per i listener attivi. */
const listeners = new Set<ThemePreferenceListener>()

/** Notifica tutti i listener iscritti con la nuova preferenza. */
function notifyListeners(pref: ThemePreference): void {
  for (const listener of listeners) {
    try {
      listener(pref)
    } catch {
      // Ignora errori individuali
    }
  }
}
