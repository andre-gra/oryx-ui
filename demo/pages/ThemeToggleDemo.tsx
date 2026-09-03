import { useThemeAgent } from '../../src/agents/useThemeAgent'
import { ThemePreferenceToggle } from '../../src/components/ThemePreferenceToggle'
import { STORAGE_KEY_THEME_PREFERENCE } from '../../src/types/themePreference'
import { useState, useEffect } from 'react'

const ThemeToggleDemo = () => {
  const { preference, engineMode, interactionCount, aiProfile, setPreference, clearPreference, acceptAiProfile } = useThemeAgent()
  const [storageValue, setStorageValue] = useState<string | null>(null)

  useEffect(() => {
    const read = () => setStorageValue(localStorage.getItem(STORAGE_KEY_THEME_PREFERENCE))
    read()
    window.addEventListener('storage', read)
    return () => window.removeEventListener('storage', read)
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme Toggle Demo</h1>
      <p className="text-sm opacity-80">Punto 4 — UX Theme Preference & Personalization</p>

      <section className="p-6 rounded-xl border border-color7 bg-color2">
        <h2 className="text-xl font-semibold mb-4">Toggle</h2>
        <div className="flex gap-4 items-center">
          <ThemePreferenceToggle />
          <ThemePreferenceToggle popoverMode />
        </div>
        <p className="mt-2 text-xs opacity-70">Ciclo: system → light → dark → clear (solo esplicito)</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-color7 bg-color2">
          <h3 className="font-medium">Stato Agent</h3>
          <pre className="text-xs mt-2">{JSON.stringify({ preference, engineMode, interactionCount }, null, 2)}</pre>
        </div>
        <div className="p-4 rounded-xl border border-color7 bg-color2">
          <h3 className="font-medium">localStorage</h3>
          <pre className="text-xs mt-2">{STORAGE_KEY_THEME_PREFERENCE} = {storageValue ?? 'null (auto)'}</pre>
        </div>
        <div className="p-4 rounded-xl border border-color7 bg-color2">
          <h3 className="font-medium">AI Profile</h3>
          <pre className="text-xs mt-2">{aiProfile ? aiProfile.name : 'Nessun profilo accettato'}</pre>
        </div>
      </section>

      <section className="p-4 rounded-xl border border-color7 bg-color2 text-xs">
        <h3 className="font-medium mb-2">API check</h3>
        <div className="flex gap-2 flex-wrap">
          <button className="px-2 py-1 bg-color4 rounded" onClick={() => setPreference?.('system')}>system</button>
          <button className="px-2 py-1 bg-color4 rounded" onClick={() => setPreference?.('light')}>light</button>
          <button className="px-2 py-1 bg-color4 rounded" onClick={() => setPreference?.('dark')}>dark</button>
          <button className="px-2 py-1 bg-red-400 rounded" onClick={() => clearPreference?.()}>clear</button>
        </div>
      </section>
    </div>
  )
}

export default ThemeToggleDemo
