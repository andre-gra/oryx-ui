import { useNavigate } from 'react-router-dom'
import { useStory } from '../context/StoryProvider'
import { Button } from '../../src'

const chapterNames = ['Ideation', 'Setup', 'Navigation', 'Decisions', 'Refinement', 'Launch']
const chapterIcons = ['💡', '📋', '🧭', '⚖️', '🔧', '🚀']
const chapterDescriptions = [
  'Chose the target market and set the vision',
  'Planned the roadmap and organized features',
  'Structured the app with clear navigation',
  'Made critical strategic decisions',
  'Polished every detail to perfection',
  'Launched the product successfully',
]

export const FinalePage = () => {
  const navigate = useNavigate()
  const { chapters, resetStory } = useStory()
  const completedCount = chapters.filter((c) => c.completed).length
  const completed = chapters.filter((c) => c.completed)

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <span className="text-6xl">🎉</span>
        <h2 className="text-3xl font-bold text-color12 mt-4">Your Theme Journey</h2>
        <p className="text-color11 mt-2">
          You completed {completedCount} of 6 chapters
          {completedCount === 6 && ' — the product is ready to ship!'}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-color6 hidden md:block" />

        <div className="space-y-6">
          {chapters.map((ch, i) => {
            const isDone = ch.completed
            return (
              <div
                key={ch.chapterId}
                className={`relative flex flex-col md:flex-row gap-6 p-6 rounded-xl border-2 transition-all ${
                  isDone
                    ? 'border-color9 bg-color4'
                    : 'border-color6 bg-color2 opacity-50'
                }`}
              >
                <div className="hidden md:flex absolute left-6 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center text-sm font-bold z-10 bg-color9 text-color1">
                  {isDone ? '✓' : ch.chapterId}
                </div>

                <div className="md:ml-12 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{chapterIcons[i]}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-color12">
                        Chapter {ch.chapterId}: {chapterNames[i]}
                      </h3>
                      <p className="text-color10 text-sm">{chapterDescriptions[i]}</p>
                    </div>
                  </div>

                  {isDone && ch.theme ? (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-color3 border border-color6">
                        <span className="text-xs text-color10">Theme:</span>
                        <span className="text-sm font-medium text-color11">
                          {ch.theme.replace('theme-', '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-color3 border border-color6">
                        <span className="text-xs text-color10">Size:</span>
                        <span className="text-sm font-medium text-color11">
                          {ch.size === '2' ? 'Small' : ch.size === '3' ? 'Medium' : 'Large'}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {['color1', 'color9', 'color4', 'color6'].map((c) => (
                          <div
                            key={c}
                            className={`w-5 h-5 rounded-full bg-${c} border border-color6`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-color9 text-sm italic mt-2">Not completed yet</p>
                  )}
                </div>

                <div className="flex items-center">
                  {isDone ? (
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/chapter/${ch.chapterId}`)}
                    >
                      Revisit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/chapter/${ch.chapterId}`)}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={() => navigate('/sandbox')}>
          Explore Sandbox
        </Button>
        <Button variant="ghost" onClick={resetStory}>
          Start Fresh
        </Button>
      </div>
    </div>
  )
}
