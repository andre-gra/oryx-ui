import { useContext } from "react";
import { ThemeAgentContext, ThemeAgentContextValue } from "./themeAgentProvider";

/**
 * Hook to access the theme agent from components
 */
export const useThemeAgent = (): ThemeAgentContextValue => {
  const context = useContext(ThemeAgentContext);
  if (!context) {
    throw new Error("useThemeAgent must be used within ThemeAgentProvider");
  }
  return context;
};
