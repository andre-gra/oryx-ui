import { createContext, useEffect, useRef, useState, useCallback } from "react";
import type { AgentMode, AgentRecommendation, AgentState } from "./agentTypes";
import { ThemeAgent } from "./themeAgent";
import type { Theme } from "../themes/themeProvider";
import type { Size } from "../themes/sizeProvider";

export interface ThemeAgentContextValue {
  state: AgentState;
  recommendation: AgentRecommendation | null;
  enableAgent: () => void;
  disableAgent: () => void;
  setMode: (mode: AgentMode) => void;
  getInsights: () => string[];
  recordInteraction: (theme: Theme, size: Size) => void;
  applyRecommendation: ((rec: AgentRecommendation) => void) | null;
}

export const ThemeAgentContext = createContext<ThemeAgentContextValue | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  onRecommendation?: (recommendation: AgentRecommendation) => void;
};

const ThemeAgentProvider: React.FC<ProviderProps> = ({ children, onRecommendation }) => {
  const agentRef = useRef<ThemeAgent | null>(null);
  const [state, setState] = useState<AgentState>({
    mode: "full-automatic",
    isActive: true,
    isLearning: true,
    interactionCount: 0,
    currentSession: {
      theme: "theme-amber",
      size: "3",
      startTime: Date.now(),
    },
  });
  const [recommendation, setRecommendation] = useState<AgentRecommendation | null>(null);

  // Initialize agent
  useEffect(() => {
    if (!agentRef.current) {
      agentRef.current = new ThemeAgent();
      setState((prev) => ({
        ...prev,
        interactionCount: agentRef.current!.getInteractionCount(),
      }));
    }
  }, []);

  // Check for recommendations periodically
  useEffect(() => {
    if (!state.isActive || !agentRef.current) return;

    const checkRecommendation = () => {
      const rec = agentRef.current!.getRecommendation();
      setRecommendation(rec);

      // In full-automatic mode, apply recommendation immediately
      if (rec && state.mode === "full-automatic" && onRecommendation) {
        // Only apply if confidence is high enough
        if (rec.confidence >= 0.3) {
          onRecommendation(rec);
        }
      }

      setState((prev) => ({
        ...prev,
        lastRecommendation: rec || undefined,
      }));
    };

    // Check immediately
    checkRecommendation();

    // Then check every 5 minutes
    const interval = setInterval(checkRecommendation, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.isActive, state.mode, onRecommendation]);

  const recordInteraction = useCallback((theme: Theme, size: Size) => {
    if (!agentRef.current) return;

    agentRef.current.recordChange(theme, size);
    setState((prev) => ({
      ...prev,
      interactionCount: agentRef.current!.getInteractionCount(),
      currentSession: {
        theme,
        size,
        startTime: Date.now(),
      },
    }));
  }, []);

  const enableAgent = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: true }));
  }, []);

  const disableAgent = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }));
  }, []);

  const setMode = useCallback((mode: AgentMode) => {
    if (agentRef.current) {
      agentRef.current.setMode(mode);
    }
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const getInsights = useCallback((): string[] => {
    if (!agentRef.current) return [];
    return agentRef.current.getInsights();
  }, []);

  const value: ThemeAgentContextValue = {
    state,
    recommendation,
    enableAgent,
    disableAgent,
    setMode,
    getInsights,
    recordInteraction,
    applyRecommendation: onRecommendation || null,
  };

  return <ThemeAgentContext.Provider value={value}>{children}</ThemeAgentContext.Provider>;
};

export default ThemeAgentProvider;
