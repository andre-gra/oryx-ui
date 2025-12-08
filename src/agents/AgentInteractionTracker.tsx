import { useEffect } from "react";
import { useTheme } from "../themes/useTheme";
import { useSize } from "../themes/useSize";
import { useThemeAgent } from "./useThemeAgent";

/**
 * Component that tracks theme and size changes and reports to the agent
 * Should be placed inside ThemeProvider, SizeProvider, and ThemeAgentProvider
 */
export const AgentInteractionTracker = () => {
  const { theme } = useTheme();
  const { size } = useSize();
  const { recordInteraction } = useThemeAgent();

  useEffect(() => {
    // Record interaction whenever theme or size changes
    recordInteraction(theme, size);
  }, [theme, size, recordInteraction]);

  // This component doesn't render anything
  return null;
};
