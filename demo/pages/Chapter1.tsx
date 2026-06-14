import { Select, Button } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'

export const Chapter1 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const chapter = chapters[0]
  const saved = chapter

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(1, theme, size)
    completeChapter(1)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">💡</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 1: Ideation</h2>
            <p className="text-color10">Oryx has a brilliant idea. What market should they target?</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              Every great product starts with a choice. Oryx is torn between three exciting markets.
              Use the <strong>Select</strong> component to help them decide.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6 space-y-4">
              <h3 className="text-color12 font-semibold">Choose your market</h3>
              <Select
                label="Target market"
                placeholder="Select a market..."
                options={[
                  {
                    label: 'Markets',
                    group: [
                      { value: 'ecommerce', label: 'E-commerce' },
                      { value: 'saas', label: 'SaaS' },
                      { value: 'gaming', label: 'Gaming' },
                    ],
                  },
                ]}
                onValueChange={(val) => console.log('Market selected:', val)}
              />
              <p className="text-color10 text-sm">
                Try selecting different options — each one represents a different path for Oryx's product.
              </p>
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                Oryx envisions a world where every team has access to beautiful, themeable UI components.
                But first: <em>who needs this most?</em> E-commerce stores needing consistent branding?
                SaaS platforms craving customization? Gaming dashboards demanding vivid themes?
              </p>
            </div>
          </div>

          <div>
            <ThemeDesigner
              chapterId={1}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="What vibe fits your chosen market? Energetic? Professional? Playful?"
            />
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
