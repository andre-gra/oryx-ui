import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme, Size } from '../../src'

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
const STORAGE_VERSION = 1

/** Formato salvato in localStorage: versione + record (migrabile in futuro). */
interface StoredProgress {
  version: number
  chapters: ChapterRecord[]
}

const defaultChapters: ChapterRecord[] = Array.from({ length: 6 }, (_, i) => ({
  chapterId: i + 1,
  theme: null,
  size: '3',
  completed: false,
}))

const SIZES: Size[] = ['2', '3', '4']

/** Valida e normalizza un record salvato: null se il record è irrecuperabile. */
const normalizeRecord = (raw: unknown, index: number): ChapterRecord | null => {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const chapterId = index + 1
  const theme = typeof c.theme === 'string' && c.theme.startsWith('theme-') ? (c.theme as Theme) : null
  const size: Size = SIZES.includes(c.size as Size) ? (c.size as Size) : '3'
  return {
    chapterId,
    theme,
    size,
    completed: c.completed === true,
  }
}

/** Legge e valida il progresso salvato; in caso di formato inatteso riparte dai default. */
const loadChapters = (): ChapterRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultChapters
    const parsed: unknown = JSON.parse(raw)
    // Formato nuovo: { version, chapters } | formato vecchio: array nudo di record
    const list = Array.isArray(parsed) ? parsed : (parsed as StoredProgress)?.chapters
    if (!Array.isArray(list) || list.length !== defaultChapters.length) return defaultChapters
    const normalized = list.map(normalizeRecord)
    if (normalized.some((r) => r === null)) return defaultChapters
    return normalized as ChapterRecord[]
  } catch {
    return defaultChapters
  }
}

const StoryContext = createContext<StoryContextValue | null>(null)

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [chapters, setChapters] = useState<ChapterRecord[]>(loadChapters)

  useEffect(() => {
    const stored: StoredProgress = { version: STORAGE_VERSION, chapters }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
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
