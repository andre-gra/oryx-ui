import { Checkbox, Button } from '../../src'
import { ThemeDesigner } from '../components/ThemeDesigner'
import { ChapterNavigation } from '../components/ChapterNavigation'
import { useStory } from '../context/StoryProvider'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const Chapter6 = () => {
  const { chapters, completeChapter, setChapterTheme } = useStory()
  const navigate = useNavigate()
  const chapter = chapters[5]
  const saved = chapter
  const [checked, setChecked] = useState<Record<string, boolean>>({
    design: false,
    code: false,
    test: false,
    docs: false,
    deploy: false,
  })

  const allChecked = Object.values(checked).every(Boolean)

  const handleSave = (theme: any, size: any) => {
    setChapterTheme(6, theme, size)
    completeChapter(6)
  }

  return (
    <div className="space-y-8">
      <div className="bg-color2 border border-color6 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🚀</span>
          <div>
            <h2 className="text-2xl font-bold text-color12">Chapter 6: Launch</h2>
            <p className="text-color10">Everything is ready. Time to go live!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-color11 leading-relaxed">
              The final step. Use the <strong>Checkbox</strong> to verify everything on the
              pre-launch checklist. Tick every box before Oryx can ship.
            </p>

            <div className="bg-color3 border border-color6 rounded-lg p-6 space-y-4">
              <h3 className="text-color12 font-semibold">Pre-Launch Checklist</h3>
              <p className="text-color11 text-sm">
                Verify each item before launch. All must be checked to proceed.
              </p>
              <div className="space-y-3">
                <Checkbox
                  label="Design final review approved"
                  checked={checked.design}
                  onCheckedChange={(val) =>
                    setChecked((prev) => ({ ...prev, design: val === true }))
                  }
                />
                <Checkbox
                  label="Code freeze in effect"
                  checked={checked.code}
                  onCheckedChange={(val) =>
                    setChecked((prev) => ({ ...prev, code: val === true }))
                  }
                />
                <Checkbox
                  label="All tests passing"
                  checked={checked.test}
                  onCheckedChange={(val) =>
                    setChecked((prev) => ({ ...prev, test: val === true }))
                  }
                />
                <Checkbox
                  label="Documentation published"
                  checked={checked.docs}
                  onCheckedChange={(val) =>
                    setChecked((prev) => ({ ...prev, docs: val === true }))
                  }
                />
                <Checkbox
                  label="Deployment pipeline green"
                  checked={checked.deploy}
                  onCheckedChange={(val) =>
                    setChecked((prev) => ({ ...prev, deploy: val === true }))
                  }
                />
              </div>
              {allChecked && (
                <div className="bg-color9 text-color1 p-4 rounded-lg text-center font-semibold animate-pulse animate-once">
                  All checks passed! Ready to launch!
                </div>
              )}
            </div>

            <div className="bg-color3 border border-color6 rounded-lg p-6">
              <h3 className="text-color12 font-semibold mb-3">The Story So Far</h3>
              <p className="text-color11 text-sm leading-relaxed">
                The journey has been long but rewarding. Oryx went from a simple idea to a fully
                built product. Every decision, every theme, every detail — it all led to this moment.
                Tick every box, and let's ship it!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ThemeDesigner
              chapterId={6}
              onSave={handleSave}
              savedTheme={saved.theme}
              savedSize={saved.size}
              prompt="Celebrate! What does a launch-day theme look like?"
            />

            {saved.completed && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/finale')}
              >
                View Your Theme Journey
              </Button>
            )}
          </div>
        </div>
      </div>

      <ChapterNavigation />
    </div>
  )
}
