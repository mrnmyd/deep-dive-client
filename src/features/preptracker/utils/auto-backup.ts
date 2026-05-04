export type PermissionMode = 'read' | 'readwrite'

export const isAutoBackupSupported = (): boolean =>
  typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'

export const sha256Hex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const ensureDirectoryPermission = async (
  handle: FileSystemDirectoryHandle,
  mode: PermissionMode = 'readwrite'
): Promise<boolean> => {
  const handleAny = handle as FileSystemDirectoryHandle & {
    queryPermission?: (descriptor: { mode: PermissionMode }) => Promise<PermissionState>
    requestPermission?: (descriptor: { mode: PermissionMode }) => Promise<PermissionState>
  }
  if (typeof handleAny.queryPermission === 'function') {
    const current = await handleAny.queryPermission({ mode })
    if (current === 'granted') return true
  }
  if (typeof handleAny.requestPermission === 'function') {
    const next = await handleAny.requestPermission({ mode })
    return next === 'granted'
  }
  return true
}

const BACKUP_PREFIX = 'preptracker_backup_'

export const formatBackupFilename = (now = new Date()): string => {
  const pad = (value: number) => String(value).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `${BACKUP_PREFIX}${stamp}.json`
}

export const writeBackupFile = async (
  handle: FileSystemDirectoryHandle,
  filename: string,
  content: string
): Promise<void> => {
  const fileHandle = await handle.getFileHandle(filename, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

export const pruneOldBackups = async (
  handle: FileSystemDirectoryHandle,
  keepLast: number
): Promise<number> => {
  if (keepLast <= 0) return 0
  const dirAny = handle as FileSystemDirectoryHandle & {
    entries?: () => AsyncIterableIterator<[string, FileSystemHandle]>
    values?: () => AsyncIterableIterator<FileSystemHandle>
  }
  const iterator = dirAny.values?.() ?? null
  if (!iterator) return 0

  const entries: Array<{ name: string; mtime: number }> = []
  for await (const child of iterator) {
    if (child.kind !== 'file') continue
    if (!child.name.startsWith(BACKUP_PREFIX)) continue
    try {
      const file = await (child as FileSystemFileHandle).getFile()
      entries.push({ name: child.name, mtime: file.lastModified })
    } catch {
      /* ignore */
    }
  }

  entries.sort((a, b) => a.mtime - b.mtime)
  let removed = 0
  while (entries.length > keepLast) {
    const oldest = entries.shift()!
    try {
      await handle.removeEntry(oldest.name)
      removed += 1
    } catch {
      break
    }
  }
  return removed
}
