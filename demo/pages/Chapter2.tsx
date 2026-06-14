import { Accordion, Button } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'

export const Chapter2 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const chapter = chapters[1]
  const saved = chapter

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(2, theme, size)
    completeChapter(2)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 2: Setup</h2>
            <p className="text-color10">Oryx assembles the team and plans the roadmap.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              A product needs structure. Use the <strong>Accordion</strong> to expand each feature
              section and plan what Oryx's team will build first.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-4">Product Roadmap</h3>
              <Accordion
                items={[
                  {
                    mainText: 'Core Components',
                    collapsibleText: 'Build the foundational UI components: buttons, inputs, and navigation elements that every interface needs.',
                  },
                  {
                    mainText: 'Theme Engine',
                    collapsibleText: 'Develop a flexible theming system that allows users to customize colors, sizes, and spacing effortlessly.',
                  },
                  {
                    mainText: 'AI Integration',
                    collapsibleText: 'Integrate an AI theme agent that learns user preferences and suggests optimal themes based on usage patterns.',
                  },
                ]}
              />
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                The market is chosen. Now Oryx needs to organize the work. Each accordion section
                reveals a major milestone. Expand them all to see the full picture — this is the
                blueprint for success.
              </p>
            </div>
          </div>

          <div>
            <ThemeDesigner
              chapterId={2}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="What colors reflect an organized, productive team?"
            />
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
