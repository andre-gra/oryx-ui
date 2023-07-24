import React, { createContext, useState } from 'react'
import type { Amber, Teal, AmberDark, MintDark } from './palettes'

// TODO fare in modo di collegare i type con i nomi dei temi importati
// utilizzando Enum tipi -> export enum Theme { Light = 'theme-light', Dark = 'theme-dark', Melomys = 'theme-melomys' }
export type Theme = `theme-${Amber | Teal | AmberDark | MintDark}`

export interface ThemeContextProps {
  theme: Theme
  changeTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

type ProviderProps = {
  children: React.ReactNode
};

const ThemeProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const localTheme = localStorage.getItem('theme')
    return localTheme !== null
      ? localTheme as Theme
      : 'theme-amber'
  })

  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      changeTheme: setCurrentTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
