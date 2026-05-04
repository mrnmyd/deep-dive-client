import { NavLink, Outlet } from "react-router-dom"
import { BarChart3, BookOpen, FileText, LayoutDashboard, ListChecks, PlayCircle, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"
import { useSettings } from "@/features/preptracker/hooks/usePrepTracker"

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Study", path: "/study", icon: PlayCircle },
  { label: "Syllabus", path: "/syllabus", icon: BookOpen },
  { label: "Problems", path: "/problems", icon: ListChecks },
  { label: "Progress", path: "/progress", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
]

export function PrepTrackerLayout() {
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-semibold">PrepTracker</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted font-medium text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-4 text-sm">
          <p className="font-medium">{settings.userName || "Senior Prep"}</p>
          <p className="text-xs text-muted-foreground">{settings.dailyGoalMins} min daily goal</p>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div>
            <p className="text-sm font-medium">Senior Developer Interview Preparation</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Your single place to study senior interview material</p>
          </div>
          <ThemeToggle />
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 pb-24 md:px-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t bg-background md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn("flex flex-col items-center gap-1 px-1 py-2 text-[0.65rem] text-muted-foreground", isActive && "text-foreground")
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
