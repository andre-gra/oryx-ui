/**
 * Bridge tra la preferenza esplicita dell'utente (Sprint 1/2) e il sistema tema (ThemeProvider).
 *
 * Quando l'utente seleziona 'dark', il bridge cambia il theme nella sua variante scura
 * (es. theme-amber -> theme-amber-dark). Quando 'light', torna alla variante chiara.
 * Quando 'system' o null: nessuna azione automatica.
 */
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../themes/useTheme'
import type { Theme } from '../../themes/themeProvider'
import { themePreferenceStore, type ThemePreference } from '../../types/themePreference'

const toDarkVariant = (theme: Theme): Theme => {
  const stripped = theme.replace('theme-', '')
  if (stripped.endsWith('Dark')) return theme
  return `theme-${stripped}Dark` as Theme
}

const toLightVariant = (theme: Theme): Theme => {
  const stripped = theme.replace('theme-', '')
  if (!stripped.endsWith('Dark')) return theme
  return `theme-${stripped.replace(/Dark$/, '')}` as Theme
}

export const ThemeModeBridge = () => {
  const { theme, changeTheme } = useTheme()
  const [preference, setPreference] = useState<ThemePreference>(themePreferenceStore.get())
  const lastApplied = useRef<string | null>(null)

  // Iscriviti alle variazioni della preferenza dallo store
  useEffect(() => {
    const unsubscribe = themePreferenceStore.subscribe((p) => setPreference(p))
    return unsubscribe
  }, [])

  // Quando la preferenza o il tema cambiano, applica la variante dark/light
  useEffect(() => {
    const isDark = theme.endsWith('Dark')
    const currentKey = `${preference ?? 'auto'}:${theme}`

    if (lastApplied.current === currentKey) return
    lastApplied.current = currentKey

    if (preference === 'dark' && !isDark) {
      try {
        changeTheme(toDarkVariant(theme))
      } catch {
        console.warn('ThemeModeBridge: dark variant missing for', theme)
      }
    } else if (preference === 'light' && isDark) {
      try {
        changeTheme(toLightVariant(theme))
      } catch {
        console.warn('ThemeModeBridge: light variant missing for', theme)
      }
    }
  }, [preference, theme, changeTheme])

  return null
}

export default ThemeModeBridge
