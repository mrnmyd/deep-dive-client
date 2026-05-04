import { FolderOpen, FolderX, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAutoBackup } from '@/features/preptracker/hooks/useAutoBackup'
import { cn } from '@/lib/utils'

const INTERVAL_OPTIONS = [
  { value: 0, label: 'On change only' },
  { value: 15, label: 'Every 15 min' },
  { value: 30, label: 'Every 30 min' },
  { value: 60, label: 'Every hour' },
  { value: 240, label: 'Every 4 hours' },
  { value: 1440, label: 'Daily' },
]

const KEEP_OPTIONS = [7, 14, 30, 60]

export function AutoBackupCard() {
  const backup = useAutoBackup()

  if (!backup.supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Local auto-backup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Auto-backup uses the File System Access API and is not available in this browser. Use{' '}
            <span className="font-medium text-foreground">Export data</span> manually, or open
            PrepTracker in Chrome / Edge / Brave to enable automatic local snapshots.
          </p>
        </CardContent>
      </Card>
    )
  }

  const status = backup.status
  const lastAt = backup.config.lastBackupAt ? new Date(backup.config.lastBackupAt) : null

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Local auto-backup</CardTitle>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide',
            status === 'idle' && 'bg-muted text-muted-foreground',
            status === 'permission' &&
              'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
            status === 'writing' && 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
            status === 'error' && 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
          )}
          aria-live="polite"
        >
          {status}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {!backup.handle ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Pick a local folder. PrepTracker will save a JSON snapshot of all <code>pt_</code> data
            on a schedule. Choose a synced folder (Dropbox, OneDrive, iCloud Drive) for off-device
            redundancy.
          </div>
        ) : (
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p>
              <span className="text-muted-foreground">Folder:</span>{' '}
              <span className="font-medium">{backup.folderName ?? '(unknown)'}</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              {lastAt
                ? `Last saved ${lastAt.toLocaleString()} → ${backup.config.lastBackupFilename}`
                : 'No backup written yet.'}
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Interval</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={backup.config.intervalMinutes}
              onChange={(event) => backup.setIntervalMinutes(Number(event.target.value))}
            >
              {INTERVAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Keep last</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={backup.config.keepLast}
              onChange={(event) => backup.setKeepLast(Number(event.target.value))}
            >
              {KEEP_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value} backups
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          PrepTracker also writes after data changes (debounced 60 s) so your latest progress is
          captured even between intervals. Identical content is skipped.
        </p>

        <div className="flex flex-wrap gap-2">
          {backup.handle ? (
            <>
              <Button
                variant="outline"
                onClick={() => void backup.backupNow()}
                disabled={status === 'writing'}
              >
                <RefreshCcw className="h-4 w-4" />
                Backup now
              </Button>
              <Button variant="outline" onClick={() => void backup.pickFolder()}>
                <FolderOpen className="h-4 w-4" />
                Change folder
              </Button>
              <Button variant="ghost" onClick={() => void backup.forgetFolder()}>
                <FolderX className="h-4 w-4" />
                Forget folder
              </Button>
            </>
          ) : (
            <Button onClick={() => void backup.pickFolder()}>
              <FolderOpen className="h-4 w-4" />
              Pick backup folder
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
