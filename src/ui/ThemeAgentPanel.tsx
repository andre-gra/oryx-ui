import { useThemeAgent } from "../agents/useThemeAgent";

export const ThemeAgentPanel = () => {
  const { state, recommendation, getInsights } = useThemeAgent();

  const insights = getInsights();

  if (!state.isActive) {
    return null;
  }

  return (
    <div className="theme-agent-panel bg-color2 border-color6 text-color11 rounded-lg border p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-color12 text-sm font-semibold">🤖 AI Theme Assistant</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            state.isLearning ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
          }`}
        >
          {state.mode === "full-automatic" ? "Auto" : "Manual"}
        </span>
      </div>

      {/* Insights */}
      <div className="space-y-2 mb-3">
        {insights.map((insight, index) => (
          <p key={index} className="text-xs text-color11">
            {insight}
          </p>
        ))}
      </div>

      {/* Current Recommendation */}
      {recommendation && (
        <div className="bg-color3 border-color7 mt-3 rounded border p-3">
          <p className="text-color12 mb-1 text-xs font-medium">Current Suggestion:</p>
          <p className="text-xs text-color11 mb-2">{recommendation.reason}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-color10">
              Confidence: {Math.round(recommendation.confidence * 100)}%
            </span>
            {state.mode === "full-automatic" && (
              <span className="text-xs text-green-600 font-medium">✓ Auto-Applied</span>
            )}
          </div>
        </div>
      )}

      {/* Learning Status */}
      {state.interactionCount < 5 && (
        <div className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-3 rounded border p-2">
          <p className="text-xs">
            🌱 Still learning... Try switching themes to help me understand your preferences!
          </p>
        </div>
      )}
    </div>
  );
};
