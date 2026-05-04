import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { syllabus } from "@/features/preptracker/data/syllabus"
import { useSettings } from "@/features/preptracker/hooks/usePrepTracker"
import { PageHeader } from "@/features/preptracker/components/ui-helpers"
import { getPrepTrackerBackup, resetPrepTrackerStorage, restorePrepTrackerBackup } from "@/features/preptracker/utils/storage"
import { useThemeStore, type Theme } from "@/stores/theme.store"

export function SettingsPage() {
  const { settings, updateSetting } = useSettings()
  const setTheme = useThemeStore((state) => state.setTheme)

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getPrepTrackerBackup(), null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "preptracker_backup.json"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    restorePrepTrackerBackup(JSON.parse(text) as { data?: Record<string, unknown> })
  }

  const resetData = () => {
    if (window.confirm("Reset all PrepTracker progress stored in this browser?")) {
      resetPrepTrackerStorage()
      window.location.reload()
    }
  }

  const updateTheme = (theme: Theme) => {
    updateSetting("theme", theme)
    setTheme(theme)
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage local preferences, backups, and browser-stored progress." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">User name</span>
              <Input value={settings.userName} onChange={(event) => updateSetting("userName", event.target.value)} />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Daily goal minutes</span>
              <Input type="number" value={settings.dailyGoalMins} onChange={(event) => updateSetting("dailyGoalMins", Number(event.target.value) || 180)} />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Start date</span>
              <Input type="date" value={settings.startDate} onChange={(event) => updateSetting("startDate", event.target.value)} />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Current paper focus</span>
              <select
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={settings.currentPaper}
                onChange={(event) => updateSetting("currentPaper", event.target.value)}
              >
                {syllabus.map((paper) => <option key={paper.id} value={paper.id}>{paper.title}</option>)}
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
            <Button className="w-full" onClick={exportData}>Export data</Button>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Import backup</span>
              <Input type="file" accept="application/json" onChange={importData} />
            </label>
            <Button className="w-full" variant="destructive" onClick={resetData}>Reset progress</Button>
            <p className="text-sm text-muted-foreground">
              All progress is stored under `pt_` localStorage keys. Export regularly if you want to move browsers or devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
