import { useContext } from "react";
import { ThemeContext, ThemeContextProps } from "./themeProvider";

export const useTheme = () => useContext(ThemeContext) as ThemeContextProps;
