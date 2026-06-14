import { Stepper, Button } from '../../src'
import { useStory } from '../context/StoryProvider'
import { useNavigate } from 'react-router-dom'

const chapters = [
  { label: 'Ideation', description: 'Choose your market' },
  { label: 'Setup', description: 'Plan your features' },
  { label: 'Navigation', description: 'Structure your app' },
  { label: 'Decisions', description: 'Confirm your choices' },
  { label: 'Refinement', description: 'Polish the details' },
  { label: 'Launch', description: 'Go live' },
]

export const ChapterNavigation = () => {
  const { chapters: records, currentChapter } = useStory()
  const navigate = useNavigate()

  const completedCount = records.filter((r) => r.completed).length

  return (
    <div className="w-full space-y-4">
      <Stepper
        steps={chapters}
        currentStep={currentChapter - 1}
        onStepClick={(i) => {
          if (i < completedCount || i === completedCount) {
            navigate(`/chapter/${i + 1}`)
          }
        }}
      />
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          disabled={currentChapter <= 1}
          onClick={() => navigate(`/chapter/${currentChapter - 1}`)}
        >
          Previous
        </Button>
        <span className="text-color10 text-sm">
          Step {currentChapter} of 6
        </span>
        <Button
          variant="primary"
          onClick={() => {
            if (currentChapter < 6) {
              navigate(`/chapter/${currentChapter + 1}`)
            } else {
              navigate('/finale')
            }
          }}
        >
          {currentChapter < 6 ? 'Next' : 'See Recap'}
        </Button>
      </div>
    </div>
  )
}
