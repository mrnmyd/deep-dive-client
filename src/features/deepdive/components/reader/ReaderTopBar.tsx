import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Command,
  Flame,
  LayoutDashboard,
  ListChecks,
  Settings as SettingsIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { ROUTES } from '@/constants/routes.constant'
import { GlobalSearch } from '@/features/deepdive/components/reader/GlobalSearch'
import {
  MobileRailButton,
  MobileTreeButton,
} from '@/features/deepdive/components/reader/MobileDrawers'
import { useDailyLog, useStreaks } from '@/features/deepdive/hooks/useDeepDive'
import { useShortcutStore } from '@/stores/shortcuts.store'

export type ReaderTopBarProps = {
  renderTreeDrawer: (close: () => void) => ReactNode
  renderRailDrawer: (close: () => void) => ReactNode
}

export function ReaderTopBar({ renderTreeDrawer, renderRailDrawer }: ReaderTopBarProps) {
  const dailyLog = useDailyLog()
  const streak = useStreaks()
  const togglePalette = useShortcutStore((state) => state.togglePalette)
  const minutesToday = dailyLog.todayLog.minutesStudied

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur md:px-6">
      <MobileTreeButton render={renderTreeDrawer} />
      <Link to={ROUTES.READER} className="flex items-center gap-2 font-semibold">
        <span className="text-primary">DeepDive</span>
      </Link>
      <div className="ml-2 hidden flex-1 items-center md:flex">
        <GlobalSearch />
      </div>
      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <MobileRailButton render={renderRailDrawer} />
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 sm:flex"
          onClick={() => togglePalette(true)}
          title="Open command palette"
        >
          <Command className="h-3.5 w-3.5" />
          <span className="text-xs text-muted-foreground">⌘K</span>
        </Button>
        <span
          className="hidden items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs sm:flex"
          title="Today's logged minutes"
        >
          <span className="font-medium tabular-nums">{minutesToday}</span>
          <span className="text-muted-foreground">min</span>
        </span>
        <span
          className="hidden items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs sm:flex"
          title="Current study streak"
        >
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-medium tabular-nums">{streak.currentStreak}</span>
        </span>
        <Button asChild variant="ghost" size="icon" title="Dashboard">
          <Link to={ROUTES.DASHBOARD}>
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" title="Problems">
          <Link to={ROUTES.PROBLEMS}>
            <ListChecks className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" title="Progress">
          <Link to={ROUTES.PROGRESS}>
            <BarChart3 className="h-4 w-4" />
          </Link>
        </Button>
        <ThemeToggle />
        <Button asChild variant="ghost" size="icon" title="Settings">
          <Link to={ROUTES.SETTINGS}>
            <SettingsIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
