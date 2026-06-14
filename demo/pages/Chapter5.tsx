import { Popover } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'

export const Chapter5 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const chapter = chapters[4]
  const saved = chapter

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(5, theme, size)
    completeChapter(5)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔧</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 5: Refinement</h2>
            <p className="text-color10">Polish every detail. Oryx is perfectionist.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              The product is taking shape, but details matter. Use the <strong>Popover</strong> to
              fine-tune settings and configuration options.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6 space-y-4">
              <h3 className="text-color12 font-semibold">Product Settings</h3>
              <p className="text-color11 text-sm">
                Oryx is adjusting the final details before launch. Open the settings panel to
                configure the product dimensions and behavior.
              </p>
              <Popover
                buttonTriggerLabel="Configure"
                fields={[
                  {
                    fieldTitle: 'Display',
                    field: [
                      { label: 'Width', htmlFor: 'width', id: 'width', defaultValue: '1200px' },
                      { label: 'Height', htmlFor: 'height', id: 'height', defaultValue: '800px' },
                    ],
                  },
                  {
                    fieldTitle: 'Animation',
                    field: [
                      { label: 'Duration', htmlFor: 'duration', id: 'duration', defaultValue: '300ms' },
                      { label: 'Easing', htmlFor: 'easing', id: 'easing', defaultValue: 'ease-out' },
                    ],
                  },
                ]}
              />
              <p className="text-color10 text-sm">
                Open the popover and tweak the values. These details define the user experience.
              </p>
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                The pivot was successful. Oryx's product is nearly ready. Now it's all about the
                details — the animation easing, the exact dimensions, the subtle feel of every
                interaction. This is where good products become great.
              </p>
            </div>
          </div>

          <div>
            <ThemeDesigner
              chapterId={5}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="What refined, elegant palette matches a polished product?"
            />
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
