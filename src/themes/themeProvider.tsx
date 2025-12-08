import React, { createContext, useState, useEffect } from "react";
import type {
  Amber,
  Teal,
  AmberDark,
  MintDark,
  TomatoDark,
  Tomato,
  Red,
  RedDark,
  Crimson,
  CrimsonDark,
  Pink,
  PinkDark,
  Plum,
  PlumDark,
  Purple,
  PurpleDark,
  Violet,
  VioletDark,
  Indigo,
  IndigoDark,
  Blue,
  BlueDark,
  Cyan,
  CyanDark,
  TealDark,
  GreenDark,
  Green,
  GrassDark,
  Grass,
  OrangeDark,
  Orange,
  BrownDark,
  Brown,
  SkyDark,
  Sky,
  Mint,
  Lime,
  LimeDark,
  Yellow,
  YellowDark,
} from "./palettes";

export type Theme = `theme-${
  | Amber
  | Teal
  | TealDark
  | AmberDark
  | Mint
  | MintDark
  | TomatoDark
  | Tomato
  | Red
  | RedDark
  | Crimson
  | CrimsonDark
  | Pink
  | PinkDark
  | Plum
  | PlumDark
  | Purple
  | PurpleDark
  | Violet
  | VioletDark
  | Indigo
  | IndigoDark
  | Blue
  | BlueDark
  | Cyan
  | CyanDark
  | GreenDark
  | Green
  | GrassDark
  | Grass
  | OrangeDark
  | Orange
  | BrownDark
  | Brown
  | SkyDark
  | Sky
  | Lime
  | LimeDark
  | Yellow
  | YellowDark}`;

export interface ThemeContextProps {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const localTheme = localStorage.getItem("theme");
    return localTheme !== null ? (localTheme as Theme) : "theme-amber";
  });

  // Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        changeTheme: setCurrentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
