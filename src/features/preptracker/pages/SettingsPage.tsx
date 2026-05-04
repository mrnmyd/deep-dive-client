import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { syllabus } from '@/features/preptracker/data/syllabus'
import { useSettings } from '@/features/preptracker/hooks/usePrepTracker'
import { PageHeader } from '@/features/preptracker/components/ui-helpers'
import { AutoBackupCard } from '@/features/preptracker/components/settings/AutoBackupCard'
import { migrate } from '@/features/preptracker/utils/migrations'
import {
  getPrepTrackerBackup,
  resetPrepTrackerStorage,
  restorePrepTrackerBackup,
} from '@/features/preptracker/utils/storage'
import { useThemeStore, type Theme } from '@/stores/theme.store'

export function SettingsPage() {
  const { settings, updateSetting } = useSettings()
  const setTheme = useThemeStore((state) => state.setTheme)
  const [resetOpen, setResetOpen] = useState(false)

  const exportData = () => {
    try {
      const backup = getPrepTrackerBackup()
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      const stamp = new Date().toISOString().slice(0, 10)
      anchor.download = `preptracker_backup_${stamp}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success('Backup exported')
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const result = migrate(parsed)
      if (!result.ok) {
        toast.error('Import rejected', { description: result.reason })
        return
      }
      restorePrepTrackerBackup(result.backup)
      toast.success('Backup imported', { description: 'Reload to see restored data.' })
    } catch (error) {
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const resetData = () => {
    try {
      resetPrepTrackerStorage()
      toast.success('Progress reset')
      setResetOpen(false)
      window.setTimeout(() => window.location.reload(), 400)
    } catch (error) {
      toast.error('Reset failed', {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  const updateTheme = (theme: Theme) => {
    updateSetting('theme', theme)
    setTheme(theme)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage local preferences, backups, and browser-stored progress."
      />

      <AutoBackupCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">User name</span>
              <Input
                value={settings.userName}
                onChange={(event) => updateSetting('userName', event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Daily goal minutes</span>
              <Input
                type="number"
                value={settings.dailyGoalMins}
                onChange={(event) =>
                  updateSetting('dailyGoalMins', Number(event.target.value) || 180)
                }
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Start date</span>
              <Input
                type="date"
                value={settings.startDate}
                onChange={(event) => updateSetting('startDate', event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Current paper focus</span>
              <select
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={settings.currentPaper}
                onChange={(event) => updateSetting('currentPaper', event.target.value)}
              >
                {syllabus.map((paper) => (
                  <option key={paper.id} value={paper.id}>
                    {paper.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Theme</span>
              <select
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={settings.theme}
                onChange={(event) => updateTheme(event.target.value as Theme)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={exportData}>
              Export data
            </Button>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Import backup</span>
              <Input type="file" accept="application/json" onChange={importData} />
            </label>
            <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant="destructive">
                  Reset progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all PrepTracker progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears every <code>pt_</code> key in this browser. Topic progress, problem
                    status, daily logs, streaks, and notes will be permanently deleted. Export a
                    backup first if you want to keep a copy.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetData}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground">
              All progress is stored under <code>pt_</code> localStorage keys. Export regularly if
              you want to move browsers or devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
