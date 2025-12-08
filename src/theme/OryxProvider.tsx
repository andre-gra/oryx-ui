import { type ReactNode } from "react";
import ThemeProvider from "../themes/themeProvider";
import SizeProvider from "../themes/sizeProvider";
import ThemeAgentProvider from "../agents/themeAgentProvider";
import { AgentInteractionTracker } from "../agents/AgentInteractionTracker";
import { useTheme } from "../themes/useTheme";
import { useSize } from "../themes/useSize";
import type { AgentRecommendation } from "../agents/agentTypes";
import { useCallback } from "react";
import type { Theme } from "../themes/themeProvider";
import type { Size } from "../themes/sizeProvider";

/**
 * Props for OryxProvider
 */
export interface OryxProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default theme (reserved for future use) */
  defaultTheme?: Theme;
  /** Default size (reserved for future use) */
  defaultSize?: Size;
  /** Enable AI theme agent (defaults to true) */
  enableAgent?: boolean;
}

/**
 * Inner component that handles agent integration
 */
const OryxProviderInner = ({
  children,
  enableAgent = true,
}: {
  children: ReactNode;
  enableAgent?: boolean;
}) => {
  const { changeTheme } = useTheme();
  const { changeSize } = useSize();

  const handleRecommendation = useCallback(
    (rec: AgentRecommendation) => {
      changeTheme(rec.theme);
      changeSize(rec.size);
    },
    [changeTheme, changeSize],
  );

  if (!enableAgent) {
    return <>{children}</>;
  }

  return (
    <ThemeAgentProvider onRecommendation={handleRecommendation}>
      <AgentInteractionTracker />
      {children}
    </ThemeAgentProvider>
  );
};

/**
 * Unified provider that wraps all Oryx UI context providers.
 * Use this at the root of your application to enable theming, sizing, and AI agent features.
 *
 * @example
 * ```tsx
 * import { OryxProvider } from 'oryx-ui';
 * import 'oryx-ui/styles';
 *
 * function App() {
 *   return (
 *     <OryxProvider>
 *       <YourApp />
 *     </OryxProvider>
 *   );
 * }
 * ```
 */
export const OryxProvider = ({
  children,
  // Reserved for future use when providers support initial values
  defaultTheme: _defaultTheme,
  defaultSize: _defaultSize,
  enableAgent = true,
}: OryxProviderProps) => {
  // Suppress unused variable warnings - these are reserved for future implementation
  void _defaultTheme;
  void _defaultSize;

  return (
    <ThemeProvider>
      <SizeProvider>
        <OryxProviderInner enableAgent={enableAgent}>{children}</OryxProviderInner>
      </SizeProvider>
    </ThemeProvider>
  );
};

export default OryxProvider;
