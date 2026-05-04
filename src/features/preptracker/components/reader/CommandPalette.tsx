import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  BarChart3,
  BookOpen,
  Download,
  LayoutDashboard,
  ListChecks,
  Moon,
  RefreshCcw,
  Settings as SettingsIcon,
  Sun,
  Sunset,
  Upload,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ROUTES } from '@/constants/routes.constant'
import { paperColorTokens } from '@/features/preptracker/utils/paper-color'
import { searchTopics, type SearchRecord } from '@/features/preptracker/utils/search'
import { useSettings } from '@/features/preptracker/hooks/usePrepTracker'
import {
  getPrepTrackerBackup,
  resetPrepTrackerStorage,
  restorePrepTrackerBackup,
} from '@/features/preptracker/utils/storage'
import { migrate } from '@/features/preptracker/utils/migrations'
import { useShortcutStore } from '@/stores/shortcuts.store'
import { useThemeStore, type Theme } from '@/stores/theme.store'
import { cn } from '@/lib/utils'

type Command = {
  id: string
  label: string
  description?: string
  icon: ReactNode
  group: string
  run: () => void
}

const exportData = () => {
  try {
    const backup = getPrepTrackerBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `preptracker_backup_${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exported')
  } catch (error) {
    toast.error('Export failed', {
      description: error instanceof Error ? error.message : undefined,
    })
  }
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async () => {
    const file = input.files?.[0]
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
  input.click()
}

const resetData = () => {
  if (!window.confirm('Reset all PrepTracker progress in this browser? Cannot be undone.')) return
  resetPrepTrackerStorage()
  toast.success('Progress reset')
  window.setTimeout(() => window.location.reload(), 400)
}

export function CommandPalette() {
  const open = useShortcutStore((state) => state.paletteOpen)
  const togglePalette = useShortcutStore((state) => state.togglePalette)
  const navigate = useNavigate()
  const setTheme = useThemeStore((state) => state.setTheme)
  const { updateSetting } = useSettings()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const [trackedOpen, setTrackedOpen] = useState(open)
  if (trackedOpen !== open) {
    setTrackedOpen(open)
    if (!open) {
      setQuery('')
      setActiveIndex(0)
    }
  }

  const setThemePref = (next: Theme) => {
    updateSetting('theme', next)
    setTheme(next)
    toast.success(`Theme set to ${next}`)
  }

  const close = () => togglePalette(false)

  const navigationCommands: Command[] = [
    {
      id: 'nav-reader',
      label: 'Open Reader',
      icon: <BookOpen className="h-4 w-4" />,
      group: 'Navigate',
      run: () => {
        navigate(ROUTES.READER)
        close()
      },
    },
    {
      id: 'nav-dashboard',
      label: 'Open Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      group: 'Navigate',
      run: () => {
        navigate(ROUTES.DASHBOARD)
        close()
      },
    },
    {
      id: 'nav-problems',
      label: 'Open Problems',
      icon: <ListChecks className="h-4 w-4" />,
      group: 'Navigate',
      run: () => {
        navigate(ROUTES.PROBLEMS)
        close()
      },
    },
    {
      id: 'nav-progress',
      label: 'Open Progress',
      icon: <BarChart3 className="h-4 w-4" />,
      group: 'Navigate',
      run: () => {
        navigate(ROUTES.PROGRESS)
        close()
      },
    },
    {
      id: 'nav-settings',
      label: 'Open Settings',
      icon: <SettingsIcon className="h-4 w-4" />,
      group: 'Navigate',
      run: () => {
        navigate(ROUTES.SETTINGS)
        close()
      },
    },
  ]

  const themeCommands: Command[] = [
    {
      id: 'theme-dark',
      label: 'Theme: Dark',
      icon: <Moon className="h-4 w-4" />,
      group: 'Theme',
      run: () => {
        setThemePref('dark')
        close()
      },
    },
    {
      id: 'theme-light',
      label: 'Theme: Light',
      icon: <Sun className="h-4 w-4" />,
      group: 'Theme',
      run: () => {
        setThemePref('light')
        close()
      },
    },
    {
      id: 'theme-system',
      label: 'Theme: System',
      icon: <Sunset className="h-4 w-4" />,
      group: 'Theme',
      run: () => {
        setThemePref('system')
        close()
      },
    },
  ]

  const dataCommands: Command[] = [
    {
      id: 'data-export',
      label: 'Export backup JSON',
      icon: <Download className="h-4 w-4" />,
      group: 'Data',
      run: () => {
        exportData()
        close()
      },
    },
    {
      id: 'data-import',
      label: 'Import backup JSON',
      icon: <Upload className="h-4 w-4" />,
      group: 'Data',
      run: () => {
        importData()
        close()
      },
    },
    {
      id: 'data-reset',
      label: 'Reset all progress',
      icon: <RefreshCcw className="h-4 w-4" />,
      group: 'Data',
      run: () => {
        resetData()
        close()
      },
    },
  ]

  const trimmedQuery = query.trim()
  const topicResults: Command[] = useMemo(() => {
    if (!open || !trimmedQuery) return []
    const results = searchTopics(trimmedQuery, 8)
    return results.map((record: SearchRecord) => ({
      id: `topic-${record.topicId}`,
      label: record.title,
      description: `${record.paperTitle} · ${record.moduleTitle}`,
      icon: (
        <span
          aria-hidden
          className={cn('h-2 w-2 rounded-full', paperColorTokens[record.paperColor].bar)}
        />
      ),
      group: 'Topics',
      run: () => {
        navigate(`${ROUTES.READER}?topic=${record.topicId}`)
        updateSetting('lastReadTopicId', record.topicId)
        togglePalette(false)
      },
    }))
  }, [open, trimmedQuery, navigate, updateSetting, togglePalette])

  const lower = trimmedQuery.toLowerCase()
  const filtered = trimmedQuery
    ? [...navigationCommands, ...themeCommands, ...dataCommands, ...topicResults].filter(
        (command) =>
          command.label.toLowerCase().includes(lower) ||
          command.description?.toLowerCase().includes(lower) ||
          command.group.toLowerCase().includes(lower)
      )
    : [...topicResults, ...navigationCommands, ...themeCommands, ...dataCommands]

  const grouped = (() => {
    const map = new Map<string, Command[]>()
    filtered.forEach((command) => {
      const list = map.get(command.group) ?? []
      list.push(command)
      map.set(command.group, list)
    })
    const order = ['Topics', 'Navigate', 'Theme', 'Data']
    return Array.from(map.entries()).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
  })()

  const flatCommands = grouped.flatMap(([, list]) => list)
  const queryActiveIndexKey = `${trimmedQuery}|${flatCommands.length}`
  const [trackedQueryKey, setTrackedQueryKey] = useState(queryActiveIndexKey)
  if (trackedQueryKey !== queryActiveIndexKey) {
    setTrackedQueryKey(queryActiveIndexKey)
    setActiveIndex(0)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(flatCommands.length - 1, 0)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      flatCommands[activeIndex]?.run()
    }
  }

  return (
    <Dialog open={open} onOpenChange={togglePalette}>
      <DialogContent showClose={false} className="max-w-xl gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>Type to search topics or commands.</DialogDescription>
        </DialogHeader>
        <div onKeyDown={onKeyDown}>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics or commands..."
            className="h-12 w-full border-b bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {grouped.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No matches.</div>
            ) : (
              grouped.map(([group, list]) => (
                <div key={group} className="px-1 py-2">
                  <p className="px-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group}
                  </p>
                  <ul>
                    {list.map((command) => {
                      const flatIndex = flatCommands.indexOf(command)
                      const active = flatIndex === activeIndex
                      return (
                        <li key={command.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            onClick={() => command.run()}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                              active && 'bg-muted'
                            )}
                          >
                            <span className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                              {command.icon}
                            </span>
                            <span className="flex-1">
                              <span className="block">{command.label}</span>
                              {command.description && (
                                <span className="block text-xs text-muted-foreground">
                                  {command.description}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
