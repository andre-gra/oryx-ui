import { Stepper, Button } from '../../src'
import { useStory } from '../context/StoryProvider'
import { useNavigate, useLocation } from 'react-router-dom'

const chapters = [
  { label: 'Ideation', description: 'Choose your market' },
  { label: 'Setup', description: 'Plan your features' },
  { label: 'Navigation', description: 'Structure your app' },
  { label: 'Decisions', description: 'Confirm your choices' },
  { label: 'Refinement', description: 'Polish the details' },
  { label: 'Launch', description: 'Go live' },
]

/**
 * Estrae l'id del capitolo visualizzato dalla rotta corrente (/chapter/:id).
 * La navigazione è relativa alla posizione (URL), non al progresso di completamento:
 * Next/Previous non possono più "saltare" o "rimanere bloccati" su capitoli inattesi.
 */
const getChapterIdFromPath = (pathname: string): number => {
  const match = pathname.match(/\/chapter\/(\d+)/)
  if (!match) return 1
  const id = parseInt(match[1], 10)
  return Math.min(6, Math.max(1, Number.isFinite(id) ? id : 1))
}

export const ChapterNavigation = () => {
  const { chapters: records } = useStory()
  const navigate = useNavigate()
  const location = useLocation()

  const currentId = getChapterIdFromPath(location.pathname)
  const completedCount = records.filter((r) => r.completed).length
  const isCurrentCompleted = records[currentId - 1]?.completed ?? false

  return (
    <div className="w-full space-y-4">
      <Stepper
        steps={chapters}
        currentStep={currentId - 1}
        // Cliccabili solo i capitoli già completati + il prossimo da fare (maxClickableStep 0-based)
        maxClickableStep={completedCount}
        onStepClick={(i) => {
          if (i <= completedCount) {
            navigate(`/chapter/${i + 1}`)
          }
        }}
      />
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          disabled={currentId <= 1}
          onClick={() => navigate(`/chapter/${currentId - 1}`)}
        >
          Previous
        </Button>
        <span className="text-color10 text-sm">Step {currentId} of 6</span>
        <div className="flex items-center gap-3">
          {!isCurrentCompleted && currentId < 6 && (
            <span className="text-xs text-color10 hidden sm:inline">
              Save your theme to continue →
            </span>
          )}
          <Button
            variant="primary"
            disabled={!isCurrentCompleted}
            onClick={() => {
              if (currentId < 6) {
                navigate(`/chapter/${currentId + 1}`)
              } else {
                navigate('/finale')
              }
            }}
          >
            {currentId < 6 ? 'Next' : 'See Recap'}
          </Button>
        </div>
      </div>
    </div>
  )
}