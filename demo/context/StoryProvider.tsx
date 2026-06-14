import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useTheme, useSize, type Theme, type Size } from '../../src'

export interface ChapterRecord {
  chapterId: number
  theme: Theme | null
  size: Size
  completed: boolean
}

interface StoryContextValue {
  chapters: ChapterRecord[]
  currentChapter: number
  completeChapter: (chapterId: number) => void
  setChapterTheme: (chapterId: number, theme: Theme, size: Size) => void
  resetStory: () => void
}

const STORAGE_KEY = 'oryx-story-progress'

const defaultChapters: ChapterRecord[] = Array.from({ length: 6 }, (_, i) => ({
  chapterId: i + 1,
  theme: null,
  size: '3',
  completed: false,
}))

const StoryContext = createContext<StoryContextValue | null>(null)

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [chapters, setChapters] = useState<ChapterRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return defaultChapters
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters))
  }, [chapters])

  const currentChapter = chapters.find((c) => !c.completed)?.chapterId ?? 7

  const completeChapter = (chapterId: number) => {
    setChapters((prev) =>
      prev.map((c) => (c.chapterId === chapterId ? { ...c, completed: true } : c)),
    )
  }

  const setChapterTheme = (chapterId: number, theme: Theme, size: Size) => {
    setChapters((prev) =>
      prev.map((c) => (c.chapterId === chapterId ? { ...c, theme, size } : c)),
    )
  }

  const resetStory = () => {
    setChapters(defaultChapters)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <StoryContext.Provider
      value={{ chapters, currentChapter, completeChapter, setChapterTheme, resetStory }}
    >
      {children}
    </StoryContext.Provider>
  )
}

export const useStory = () => {
  const ctx = useContext(StoryContext)
  if (!ctx) throw new Error('useStory must be used within StoryProvider')
  return ctx
}
