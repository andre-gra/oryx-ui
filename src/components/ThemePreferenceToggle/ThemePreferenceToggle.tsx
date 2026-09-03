import { useThemeAgent } from '../../agents/useThemeAgent'
import { useTheme } from '../../theme'
import { useSize } from '../../theme'
import classnames from 'classnames'
import type { ThemePreference } from '../../types/themePreference'

export interface ThemePreferenceToggleProps {
  /** Classi extra applicate al bottone. */
  className?: string
  /** Mostra il tooltip testuale (default: true). */
  showTooltip?: boolean
  /** Modalita' ciclica: al click ruota attraverso system -> light -> dark -> null. */
  cycleMode?: boolean
  /** Modalita' popover con 3 opzioni (system, light, dark). */
  popoverMode?: boolean
  /** aria-label per il bottone. */
  ariaLabel?: string
}

const ICONS = {
  system: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  light: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  dark: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  auto: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L9.91 8.26 3 9.27l5.46 4.73L6.82 21 12 17.77 17.18 21l-1.64-7 5.46-4.73-6.91-1.01L12 2z" />
    </svg>
  ),
}

const TOOLTIP = {
  system: 'Theme: Follow system',
  light: 'Theme: Light',
  dark: 'Theme: Dark',
  auto: 'Theme: Auto (default)',
} as const

/**
 * Toggle compatto per la preferenza esplicita di tema dell'utente.
 *
 * - Click singolo (cycle): system -> light -> dark -> null (se cycleMode)
 * - Popover: 3 opzioni esplicite system/light/dark (se popoverMode)
 * - Default: ciclico a 3 stati
 *
 * Persiste tramite themePreferenceStore (vedi src/types/themePreference.ts).
 * L'auto-clear avviene solo su interazione esplicita.
 */
export const ThemePreferenceToggle = ({
  className,
  showTooltip = true,
  cycleMode: _cycleMode,
  popoverMode = false,
  ariaLabel = 'Theme preference',
}: ThemePreferenceToggleProps) => {
  const { preference, setPreference, clearPreference } = useThemeAgent()
  const { theme } = useTheme()
  const { size } = useSize()

  const effectivePref: ThemePreference = preference ?? 'system'

  /**
   * Cicla attraverso le 4 preferenze: system -> light -> dark -> null (auto-clear esplicito).
   */
  const handleCycle = () => {
    switch (preference) {
      case null:
        // Da auto (null) → esplicito system
        setPreference('system')
        break
      case 'system':
        setPreference('light')
        break
      case 'light':
        setPreference('dark')
        break
      case 'dark':
        clearPreference()
        break
    }
  }

  /**
   * Apre un popover-style selector (inline a 3 bottoni).
   */
  const handlePopoverSelect = (pref: ThemePreference) => {
    if (pref === null) {
      clearPreference()
    } else {
      setPreference(pref)
    }
  }

  const icon = preference === null ? ICONS.auto : ICONS[effectivePref]
  const tooltip = preference === null ? TOOLTIP.auto : TOOLTIP[effectivePref]

  const sizeClass = `button${size}`
  const baseClass = classnames(
    theme,
    sizeClass,
    'inline-flex items-center justify-center gap-1 font-medium leading-none select-none outline-none transition-colors duration-200',
    'bg-transparent text-color11 hover:bg-color4 focus-visible:ring-2 focus-visible:ring-color7',
    'rounded-md border border-color7 px-2',
    className,
  )

  if (popoverMode) {
    return (
      <div
        className={classnames('inline-flex items-center gap-1', theme)}
        role="group"
        aria-label={ariaLabel}
      >
        {(['system', 'light', 'dark'] as const).map((opt) => {
          const isActive = effectivePref === opt
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={isActive}
              aria-label={TOOLTIP[opt]}
              title={showTooltip ? TOOLTIP[opt] : undefined}
              onClick={() => handlePopoverSelect(opt)}
              className={classnames(
                sizeClass,
                'inline-flex items-center justify-center gap-1 font-medium leading-none select-none outline-none transition-colors duration-200 rounded-md border px-2',
                isActive
                  ? 'bg-color4 text-color11 border-color8'
                  : 'bg-transparent text-color11 border-color7 hover:bg-color4',
              )}
            >
              {ICONS[opt]}
              <span className="text-xs capitalize">{opt}</span>
            </button>
          )
        })}
      </div>
    )
  }

  // cycleMode (default)
  return (
    <button
      type="button"
      onClick={handleCycle}
      aria-label={ariaLabel}
      title={showTooltip ? tooltip : undefined}
      className={baseClass}
    >
      {icon}
      {showTooltip && (
        <span className="text-xs">
          {preference === null ? 'Auto' : effectivePref}
        </span>
      )}
    </button>
  )
}

export default ThemePreferenceToggle
