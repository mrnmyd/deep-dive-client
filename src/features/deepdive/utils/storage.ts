import type {
  BackupConfig,
  DailyLogEntry,
  Settings,
} from '@/features/deepdive/types/deepdive.types'

export const SCHEMA_VERSION = 2

// Storage keys keep the historical `pt_` prefix and the `deepdive-storage`
// custom event name kept the previous spelling on rebrand. They are user-data
// identifiers — renaming them invalidates progress saved in any browser that
// has already used the application.
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
    window.dispatchEvent(new CustomEvent('deepdive-storage', { detail: { key } }))
  } catch (error) {
    window.dispatchEvent(new CustomEvent('deepdive-storage-error', { detail: { key, error } }))
    throw error
  }
}

export type DeepDiveBackup = {
  app: 'DeepDive'
  schemaVersion: number
  exportedAt: string
  data: Record<string, unknown>
}

export const getDeepDiveBackup = (): DeepDiveBackup => {
  const data: Record<string, unknown> = {}

  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key === STORAGE_KEYS.schemaVersion) return
    const value = window.localStorage.getItem(key)
    if (value !== null) data[key] = JSON.parse(value)
  })

  return {
    app: 'DeepDive',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export const restoreDeepDiveBackup = (backup: DeepDiveBackup) => {
  Object.entries(backup.data).forEach(([key, value]) => {
    if (
      Object.values(STORAGE_KEYS).includes(key as (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS])
    ) {
      writeStorage(key, value)
    }
  })

  writeStorage(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION)
}

export const resetDeepDiveStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  window.dispatchEvent(new CustomEvent('deepdive-storage', { detail: { key: 'all' } }))
}
