import { NavigationMenu } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'

export const Chapter3 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const chapter = chapters[2]
  const saved = chapter

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(3, theme, size)
    completeChapter(3)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🧭</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 3: Navigation</h2>
            <p className="text-color10">Time to structure the app. Where does everything go?</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              A great app needs clear navigation. Use the <strong>NavigationMenu</strong> to define
              the information architecture. Hover over each section to see what lives there.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-4">App Navigation</h3>
              <NavigationMenu
                items={[
                  {
                    title: 'Dashboard',
                    item: [
                      {
                        type: 'card',
                        title: 'Overview',
                        href: '#',
                        text: 'Key metrics at a glance',
                      },
                      {
                        type: 'text',
                        title: 'Analytics',
                        href: '#',
                        text: 'Deep data insights',
                      },
                      {
                        type: 'text',
                        title: 'Reports',
                        href: '#',
                        text: 'Generated documents',
                      },
                    ],
                  },
                  {
                    title: 'Settings',
                    item: [
                      {
                        type: 'text',
                        title: 'Profile',
                        href: '#',
                        text: 'Manage your account',
                      },
                      {
                        type: 'text',
                        title: 'Preferences',
                        href: '#',
                        text: 'Customize your experience',
                      },
                    ],
                  },
                  { title: 'Help', href: '#' },
                ]}
              />
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                With the roadmap clear, Oryx needs to organize the app. Every great product has
                intuitive navigation. Hover through the menu items — each dropdown represents a
                section of Oryx's growing platform.
              </p>
            </div>
          </div>

          <div>
            <ThemeDesigner
              chapterId={3}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="What palette makes navigation feel intuitive and clear?"
            />
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
