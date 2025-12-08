import { useCallback } from "react";
import CollectionPage from "./pages/CollectionPage";
import ThemeProvider from "./themes/themeProvider";
import SizeProvider from "./themes/sizeProvider";
import ThemeAgentProvider from "./agents/themeAgentProvider";
import { AgentInteractionTracker } from "./agents/AgentInteractionTracker";
import { useTheme } from "./themes/useTheme";
import { useSize } from "./themes/useSize";
import type { AgentRecommendation } from "./agents/agentTypes";

// Inner component that has access to theme and size contexts
const AppContent = () => {
  const { changeTheme } = useTheme();
  const { changeSize } = useSize();

  const handleRecommendation = useCallback(
    (rec: AgentRecommendation) => {
      // Apply AI recommendation automatically
      changeTheme(rec.theme);
      changeSize(rec.size);
      localStorage.setItem("theme", rec.theme);
      localStorage.setItem("size", rec.size);
    },
    [changeTheme, changeSize],
  );

  return (
    <ThemeAgentProvider onRecommendation={handleRecommendation}>
      <AgentInteractionTracker />
      <CollectionPage />
    </ThemeAgentProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SizeProvider>
        <AppContent />
      </SizeProvider>
    </ThemeProvider>
  );
}

export default App;
