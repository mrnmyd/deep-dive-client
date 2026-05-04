import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLocalStorage } from '@/features/deepdive/hooks/useLocalStorage'
import type { BackupConfig } from '@/features/deepdive/types/deepdive.types'
import {
  ensureDirectoryPermission,
  formatBackupFilename,
  isAutoBackupSupported,
  pruneOldBackups,
  sha256Hex,
  writeBackupFile,
} from '@/features/deepdive/utils/auto-backup'
import {
  clearBackupHandle,
  loadBackupHandle,
  saveBackupHandle,
} from '@/features/deepdive/utils/idb'
import {
  defaultBackupConfig,
  getDeepDiveBackup,
  STORAGE_KEYS,
} from '@/features/deepdive/utils/storage'

export type AutoBackupStatus = 'idle' | 'permission' | 'writing' | 'error'

export function useAutoBackup() {
  const supported = isAutoBackupSupported()
  const [config, setConfig] = useLocalStorage<BackupConfig>(
    STORAGE_KEYS.backupConfig,
    defaultBackupConfig
  )
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null)
  const [status, setStatus] = useState<AutoBackupStatus>('idle')
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const writingRef = useRef<boolean>(false)

  useEffect(() => {
    if (!supported) return
    let cancelled = false
    loadBackupHandle().then((stored) => {
      if (cancelled || !stored) return
      setHandle(stored)
    })
    return () => {
      cancelled = true
    }
  }, [supported])

  const performBackup = useCallback(
    async (
      reason: 'manual' | 'interval' | 'change'
    ): Promise<{ skipped: boolean; filename?: string } | null> => {
      if (!handle || writingRef.current) return null
      writingRef.current = true
      setStatus('permission')
      try {
        const granted = await ensureDirectoryPermission(handle, 'readwrite')
        if (!granted) {
          setPermissionGranted(false)
          setStatus('error')
          if (reason === 'manual') toast.error('Backup folder permission denied')
          return null
        }
        setPermissionGranted(true)

        const backup = getDeepDiveBackup()
        const content = JSON.stringify(backup, null, 2)
        const hash = await sha256Hex(content)

        if (config.lastBackupHash && hash === config.lastBackupHash && reason !== 'manual') {
          setStatus('idle')
          return { skipped: true }
        }

        setStatus('writing')
        const filename = formatBackupFilename()
        await writeBackupFile(handle, filename, content)
        await pruneOldBackups(handle, config.keepLast)

        setConfig((previous) => ({
          ...previous,
          lastBackupAt: new Date().toISOString(),
          lastBackupHash: hash,
          lastBackupFilename: filename,
          lastFolderName: handle.name,
        }))
        setStatus('idle')
        if (reason === 'manual') toast.success(`Backup saved — ${filename}`)
        return { skipped: false, filename }
      } catch (error) {
        setStatus('error')
        const message = error instanceof Error ? error.message : 'Unknown error'
        if (reason === 'manual') toast.error('Backup failed', { description: message })
        return null
      } finally {
        writingRef.current = false
      }
    },
    [handle, config.lastBackupHash, config.keepLast, setConfig]
  )

  const pickFolder = useCallback(async () => {
    if (!supported || typeof window.showDirectoryPicker !== 'function') return
    try {
      const picked = await window.showDirectoryPicker({
        id: 'deepdive-backup',
        mode: 'readwrite',
      })
      const granted = await ensureDirectoryPermission(picked, 'readwrite')
      if (!granted) {
        toast.error('Folder permission denied')
        return
      }
      await saveBackupHandle(picked)
      setHandle(picked)
      setPermissionGranted(true)
      toast.success(`Backup folder: ${picked.name}`)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('Could not open folder picker', {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }, [supported])

  const forgetFolder = useCallback(async () => {
    await clearBackupHandle()
    setHandle(null)
    setPermissionGranted(false)
    setConfig((previous) => ({ ...previous, lastFolderName: null }))
    toast.success('Backup folder forgotten')
  }, [setConfig])

  const backupNow = useCallback(() => performBackup('manual'), [performBackup])

  useEffect(() => {
    if (!handle || config.intervalMinutes <= 0) return
    const ms = config.intervalMinutes * 60 * 1000
    const id = window.setInterval(() => {
      void performBackup('interval')
    }, ms)
    return () => window.clearInterval(id)
  }, [handle, config.intervalMinutes, performBackup])

  useEffect(() => {
    if (!handle) return
    let queued = false
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail
      if (detail?.key === STORAGE_KEYS.backupConfig) return
      if (queued) return
      queued = true
      window.setTimeout(() => {
        queued = false
        void performBackup('change')
      }, 60_000)
    }
    window.addEventListener('deepdive-storage', onChange)
    return () => window.removeEventListener('deepdive-storage', onChange)
  }, [handle, performBackup])

  const setIntervalMinutes = (intervalMinutes: number) =>
    setConfig((previous) => ({ ...previous, intervalMinutes }))

  const setKeepLast = (keepLast: number) => setConfig((previous) => ({ ...previous, keepLast }))

  return {
    supported,
    handle,
    folderName: handle?.name ?? config.lastFolderName,
    config,
    status,
    permissionGranted,
    pickFolder,
    forgetFolder,
    backupNow,
    setIntervalMinutes,
    setKeepLast,
  }
}
