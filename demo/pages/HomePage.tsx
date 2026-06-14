import { useNavigate } from 'react-router-dom'
import { useStory } from '../context/StoryProvider'
import { Button } from '../../src'

export const HomePage = () => {
  const navigate = useNavigate()
  const { chapters, resetStory } = useStory()
  const hasProgress = chapters.some((c) => c.completed)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-color12 mb-4">
          Build a Product with Oryx
        </h2>
        <p className="text-color11 text-lg leading-relaxed">
          Follow Oryx the antelope through <strong>6 chapters</strong> of building a digital product.
          At each step, you'll use a different component and design a theme that captures the mood.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg w-full">
        {chapters.map((ch) => (
          <div
            key={ch.chapterId}
            className={`p-4 rounded-xl border-2 transition-colors ${
              ch.completed
                ? 'border-color9 bg-color4'
                : 'border-color6 bg-color2 opacity-60'
            }`}
          >
            <div className="text-2xl font-bold text-color12 mb-1">
              {ch.completed ? '✓' : ch.chapterId}
            </div>
            <div className="text-xs text-color10">
              {['Ideation', 'Setup', 'Navigation', 'Decisions', 'Refinement', 'Launch'][ch.chapterId - 1]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => navigate('/chapter/1')}>
          {hasProgress ? 'Continue Journey' : 'Start Journey'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/sandbox')}>
          Skip to Sandbox
        </Button>
        {hasProgress && (
          <Button variant="ghost" onClick={resetStory}>
            Reset Progress
          </Button>
        )}
      </div>

      <div className="max-w-xl text-color10 text-sm mt-8 space-y-2">
        <p>✨ At each chapter you'll:</p>
        <ul className="list-disc list-inside text-left space-y-1">
          <li>Interact with a component in a real scenario</li>
          <li>Design a theme that fits the chapter's mood</li>
          <li>Preview your choices live on all components</li>
        </ul>
        <p className="mt-4">At the end, see your complete <strong>theme journey</strong>!</p>
      </div>
    </div>
  )
}
