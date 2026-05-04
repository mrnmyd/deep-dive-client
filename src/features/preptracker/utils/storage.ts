import type {
  BackupConfig,
  DailyLogEntry,
  Settings,
} from '@/features/preptracker/types/preptracker.types'

export const SCHEMA_VERSION = 2

export const STORAGE_KEYS = {
  topicProgress: 'pt_topic_progress',
  problemStatus: 'pt_problem_status',
  dailyLog: 'pt_daily_log',
  settings: 'pt_settings',
  streaks: 'pt_streaks',
  activeSession: 'pt_active_session',
  topicNotes: 'pt_topic_notes',
  treeState: 'pt_tree_state',
  backupConfig: 'pt_backup_config',
  schemaVersion: 'pt_schema_version',
} as const

export const defaultBackupConfig: BackupConfig = {
  intervalMinutes: 60,
  keepLast: 14,
  lastBackupAt: null,
  lastBackupHash: null,
  lastBackupFilename: null,
  lastFolderName: null,
}

export const todayKey = () => new Date().toISOString().slice(0, 10)

export const defaultSettings: Settings = {
  userName: '',
  dailyGoalMins: 180,
  theme: 'dark',
  startDate: todayKey(),
  currentPaper: 'paper_1_dsa',
  lastReadTopicId: undefined,
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
    dsa: { done: false, minutes: 60, reflection: '' },
    theory: { done: false, minutes: 60, reflection: '' },
    revision: { done: false, minutes: 30, reflection: '' },
    build: { done: false, minutes: 30, reflection: '' },
  },
})

export const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export const writeStorage = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('preptracker-storage', { detail: { key } }))
  } catch (error) {
    window.dispatchEvent(new CustomEvent('preptracker-storage-error', { detail: { key, error } }))
    throw error
  }
}

export type PrepTrackerBackup = {
  app: 'PrepTracker'
  schemaVersion: number
  exportedAt: string
  data: Record<string, unknown>
}

export const getPrepTrackerBackup = (): PrepTrackerBackup => {
  const data: Record<string, unknown> = {}

  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key === STORAGE_KEYS.schemaVersion) return
    const value = window.localStorage.getItem(key)
    if (value !== null) data[key] = JSON.parse(value)
  })

  return {
    app: 'PrepTracker',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export const restorePrepTrackerBackup = (backup: PrepTrackerBackup) => {
  Object.entries(backup.data).forEach(([key, value]) => {
    if (
      Object.values(STORAGE_KEYS).includes(key as (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS])
    ) {
      writeStorage(key, value)
    }
  })

  writeStorage(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION)
}

export const resetPrepTrackerStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  window.dispatchEvent(new CustomEvent('preptracker-storage', { detail: { key: 'all' } }))
}
