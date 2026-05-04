import type { DailyLogEntry, Settings } from "@/features/preptracker/types/preptracker.types"

export const STORAGE_KEYS = {
  topicProgress: "pt_topic_progress",
  problemStatus: "pt_problem_status",
  dailyLog: "pt_daily_log",
  settings: "pt_settings",
  streaks: "pt_streaks",
} as const

export const todayKey = () => new Date().toISOString().slice(0, 10)

export const defaultSettings: Settings = {
  userName: "",
  dailyGoalMins: 180,
  theme: "dark",
  startDate: todayKey(),
  currentPaper: "paper_1_dsa",
}

export const emptyDailyLog = (): DailyLogEntry => ({
  dsaDone: false,
  theoryDone: false,
  revisionDone: false,
  buildDone: false,
  minutesStudied: 0,
  topicsStudied: [],
  problemsAttempted: [],
  blocks: {
    dsa: { done: false, minutes: 60, reflection: "" },
    theory: { done: false, minutes: 60, reflection: "" },
    revision: { done: false, minutes: 30, reflection: "" },
    build: { done: false, minutes: 30, reflection: "" },
  },
})

export const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export const writeStorage = <T,>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent("preptracker-storage", { detail: { key } }))
}

export const getPrepTrackerBackup = () => {
  const data: Record<string, unknown> = {}

  Object.values(STORAGE_KEYS).forEach((key) => {
    const value = window.localStorage.getItem(key)
    if (value) data[key] = JSON.parse(value)
  })

  return {
    app: "PrepTracker",
    exportedAt: new Date().toISOString(),
    data,
  }
}

export const restorePrepTrackerBackup = (backup: { data?: Record<string, unknown> }) => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (backup.data && Object.prototype.hasOwnProperty.call(backup.data, key)) {
      writeStorage(key, backup.data[key])
    }
  })
}

export const resetPrepTrackerStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  window.dispatchEvent(new CustomEvent("preptracker-storage", { detail: { key: "all" } }))
}
