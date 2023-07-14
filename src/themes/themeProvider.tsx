import React, { createContext, useState } from 'react'

type Theme = 'light' | 'dark'

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
      : 'light'
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
