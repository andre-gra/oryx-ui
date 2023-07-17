import React, { createContext, useState } from 'react'

// TODO fare in modo di collegare i type con i nomi dei temi importati
export type Theme = 'oryx' | 'melomys'

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
      : 'oryx'
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