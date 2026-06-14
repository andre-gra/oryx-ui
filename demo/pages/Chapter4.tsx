import { AlertDialog } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'

export const Chapter4 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const chapter = chapters[3]
  const saved = chapter

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(4, theme, size)
    completeChapter(4)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">⚖️</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 4: Decisions</h2>
            <p className="text-color10">Critical choices lie ahead. Is Oryx ready?</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              Every product journey has make-or-break moments. Use the <strong>AlertDialog</strong> to
              confirm a critical decision. Think carefully — some choices can't be undone.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6 space-y-4">
              <h3 className="text-color12 font-semibold">Critical Decision</h3>
              <p className="text-color11 text-sm">
                Oryx has a chance to pivot the product strategy. The data suggests a new direction,
                but it means leaving behind months of work.
              </p>
              <AlertDialog
                texts={{
                  buttonTrigger: 'Pivot Strategy',
                  content: 'Pivot to new direction?',
                  description:
                    'Are you sure you want to pivot? This will change the product roadmap and require重新规划 resources. Current progress on the old path will be archived.',
                  buttonCancel: 'Stay Course',
                  action: 'Yes, Pivot',
                }}
                onAction={() => console.log('Pivoted!')}
                onCancel={() => console.log('Stayed course')}
              />
              <p className="text-color10 text-sm">
                Click the button to see the confirmation dialog. Try both cancel and confirm.
              </p>
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                Oryx stands at a crossroads. The market research is in, and it's pointing toward
                an unexpected opportunity. But pivoting means letting go of the original vision.
                What will Oryx choose?
              </p>
            </div>
          </div>

          <div>
            <ThemeDesigner
              chapterId={4}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="What theme suits a moment of important decision? Confident? Bold?"
            />
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
