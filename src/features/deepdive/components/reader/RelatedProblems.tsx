import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { useProblemTracker } from '@/features/deepdive/hooks/useDeepDive'
import { StatusBadge } from '@/features/deepdive/components/ui-helpers'
import { problemTone } from '@/features/deepdive/utils/status-styles'
import { cn } from '@/lib/utils'

const difficultyTone = {
  Easy: 'green',
  Medium: 'amber',
  Hard: 'red',
} as const

export type RelatedProblemsProps = {
  topicId: string | undefined
  variant?: 'inline' | 'rail'
}

export function RelatedProblems({ topicId, variant = 'inline' }: RelatedProblemsProps) {
  const tracker = useProblemTracker()
  const matched = useMemo(
    () => (topicId ? tracker.problems.filter((problem) => problem.relatedTopicId === topicId) : []),
    [topicId, tracker.problems]
  )

  if (!topicId || matched.length === 0) return null

  return (
    <section className={cn(variant === 'inline' && 'mt-10 rounded-lg border bg-card/40 p-5')}>
      {variant === 'inline' && (
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Related practice problems
          </h2>
          <span className="text-xs text-muted-foreground">
            {matched.length} problem{matched.length === 1 ? '' : 's'}
          </span>
        </header>
      )}
      <ul className="space-y-2">
        {matched.map((problem) => {
          const status = tracker.getProblemStatus(problem.id)
          const progress = tracker.progress[problem.id]
          return (
            <li
              key={problem.id}
              className="flex flex-col gap-2 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{problem.title}</p>
                <p className="text-xs text-muted-foreground">
                  {problem.pattern} · Week {problem.week}
                  {progress?.solveCount ? ` · solved ${progress.solveCount}×` : ''}
                </p>
                {problem.insight && (
                  <p className="mt-1 text-xs italic text-muted-foreground">{problem.insight}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={problem.difficulty} tone={difficultyTone[problem.difficulty]} />
                <button
                  type="button"
                  onClick={() => tracker.cycleProblemStatus(problem.id)}
                  aria-label={`Cycle status (current: ${status.replace('_', ' ')})`}
                >
                  <StatusBadge label={status.replace('_', ' ')} tone={problemTone[status]} />
                </button>
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  LeetCode
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
