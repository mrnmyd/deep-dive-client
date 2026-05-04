import {
  SCHEMA_VERSION,
  STORAGE_KEYS,
  type DeepDiveBackup,
} from '@/features/deepdive/utils/storage'

export type MigrationResult =
  | {
      ok: true
      backup: DeepDiveBackup
    }
  | {
      ok: false
      reason: string
    }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringRecord = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && Object.keys(value).every((key) => typeof key === 'string')

export const validateBackupShape = (raw: unknown): raw is DeepDiveBackup => {
  if (!isObject(raw)) return false
  if (raw.app !== 'DeepDive') return false
  if (typeof raw.exportedAt !== 'string') return false
  if (!isObject(raw.data)) return false
  if (raw.schemaVersion !== undefined && typeof raw.schemaVersion !== 'number') return false
  return true
}

const migrateV1ToV2 = (data: Record<string, unknown>): Record<string, unknown> => {
  const next: Record<string, unknown> = { ...data }

  if (isObject(next[STORAGE_KEYS.settings])) {
    const settings = { ...(next[STORAGE_KEYS.settings] as Record<string, unknown>) }
    if (!('lastReadTopicId' in settings)) settings.lastReadTopicId = undefined
    next[STORAGE_KEYS.settings] = settings
  }

  if (!(STORAGE_KEYS.activeSession in next)) next[STORAGE_KEYS.activeSession] = null
  if (!(STORAGE_KEYS.topicNotes in next) || !isStringRecord(next[STORAGE_KEYS.topicNotes])) {
    next[STORAGE_KEYS.topicNotes] = {}
  }

  return next
}

const migrationLadder: Array<{
  from: number
  to: number
  run: (data: Record<string, unknown>) => Record<string, unknown>
}> = [{ from: 1, to: 2, run: migrateV1ToV2 }]

export const migrate = (raw: unknown): MigrationResult => {
  if (!validateBackupShape(raw)) {
    return { ok: false, reason: 'Backup file is not a recognised DeepDive export.' }
  }

  const fromVersion = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1

  if (fromVersion > SCHEMA_VERSION) {
    return {
      ok: false,
      reason: `Backup is from a newer version (v${fromVersion}). Update DeepDive before importing.`,
    }
  }

  let data = raw.data
  let current = fromVersion

  while (current < SCHEMA_VERSION) {
    const step = migrationLadder.find((entry) => entry.from === current)
    if (!step) {
      return {
        ok: false,
        reason: `No migration path from schema v${current} to v${SCHEMA_VERSION}.`,
      }
    }
    data = step.run(data)
    current = step.to
  }

  return {
    ok: true,
    backup: {
      app: 'DeepDive',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: raw.exportedAt,
      data,
    },
  }
}
