import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, Clock, ListChecks, NotebookPen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Notes } from '@/features/deepdive/components/reader/Notes'
import { RelatedProblems } from '@/features/deepdive/components/reader/RelatedProblems'
import { SessionTimer } from '@/features/deepdive/components/session/SessionTimer'
import { useProblemTracker } from '@/features/deepdive/hooks/useDeepDive'
import { useShortcutStore } from '@/stores/shortcuts.store'

export type RightRailProps = {
  topicId: string | undefined
}

export function RightRail({ topicId }: RightRailProps) {
  const notesOpen = useShortcutStore((state) => state.notesOpen)
  const toggleNotes = useShortcutStore((state) => state.toggleNotes)

  return (
    <div className="space-y-3 px-3 py-3">
      <RailCard icon={<Clock className="h-4 w-4" />} title="Session timer" defaultOpen>
        <SessionTimer currentTopicId={topicId} />
      </RailCard>
      <RailCard icon={<ListChecks className="h-4 w-4" />} title="Related problems" defaultOpen>
        <RailRelatedProblems topicId={topicId} />
      </RailCard>
      <RailCard
        icon={<NotebookPen className="h-4 w-4" />}
        title="Notes"
        controlled={{ open: notesOpen, onChange: (next) => toggleNotes(next) }}
      >
        <Notes topicId={topicId} />
      </RailCard>
    </div>
  )
}

function RailRelatedProblems({ topicId }: { topicId: string | undefined }) {
  const tracker = useProblemTracker()
  const matched = useMemo(
    () => (topicId ? tracker.problems.filter((problem) => problem.relatedTopicId === topicId) : []),
    [topicId, tracker.problems]
  )

  if (!topicId)
    return <p className="text-sm text-muted-foreground">Pick a topic to see linked problems.</p>
  if (matched.length === 0)
    return <p className="text-sm text-muted-foreground">No problems linked to this topic yet.</p>
  return <RelatedProblems topicId={topicId} variant="rail" />
}

type RailCardProps = {
  icon: ReactNode
  title: string
  defaultOpen?: boolean
  controlled?: { open: boolean; onChange: (next: boolean) => void }
  children: ReactNode
}

function RailCard({ icon, title, defaultOpen = false, controlled, children }: RailCardProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlled ? controlled.open : internalOpen
  const setOpen = controlled ? controlled.onChange : setInternalOpen

  return (
    <section className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-[max-height] duration-200 motion-reduce:transition-none',
          open ? 'max-h-[40rem]' : 'max-h-0'
        )}
      >
        <div className="px-3 pb-3 pt-1">{children}</div>
      </div>
    </section>
  )
}
