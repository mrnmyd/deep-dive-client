import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TopicProgressMap, TopicStatus } from '@/features/deepdive/types/deepdive.types'
import { allTopics, getOverallTopicStats } from '@/features/deepdive/utils/progress'

const COLORS: Record<TopicStatus, string> = {
  not_started: '#9CA3AF',
  in_progress: '#F59E0B',
  done: '#10B981',
  needs_review: '#EF4444',
}

const LABELS: Record<TopicStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  needs_review: 'Needs review',
}

export function TopicStatusDonut({ progress }: { progress: TopicProgressMap }) {
  const stats = useMemo(() => getOverallTopicStats(progress), [progress])
  const total = allTopics.length
  const done = stats.done

  const data = (Object.entries(stats) as Array<[TopicStatus, number]>)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count, color: COLORS[status], label: LABELS[status] }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic status</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No topic activity yet.
          </p>
        ) : (
          <div className="grid items-center gap-3 sm:grid-cols-[160px_1fr]">
            <div className="relative h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={70}
                    stroke="var(--border)"
                    strokeWidth={1}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [`${Number(value ?? 0)} topics`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold tabular-nums">
                  {done}/{total}
                </span>
                <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  done
                </span>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              {data.map((entry) => (
                <li key={entry.status} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.label}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{entry.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
