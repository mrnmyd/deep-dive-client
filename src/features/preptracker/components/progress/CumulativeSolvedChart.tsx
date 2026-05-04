import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProblemProgressMap } from '@/features/preptracker/types/preptracker.types'

export function CumulativeSolvedChart({ progress }: { progress: ProblemProgressMap }) {
  const data = useMemo(() => {
    const events: Array<{ date: string; count: number }> = []
    const counts = new Map<string, number>()

    Object.values(progress).forEach((entry) => {
      if (!entry.lastSolved) return
      const day = format(new Date(entry.lastSolved), 'yyyy-MM-dd')
      counts.set(day, (counts.get(day) ?? 0) + 1)
    })

    const sortedDates = Array.from(counts.keys()).sort()
    let cumulative = 0
    sortedDates.forEach((date) => {
      cumulative += counts.get(date) ?? 0
      events.push({ date, count: cumulative })
    })
    return events
  }, [progress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problems solved over time</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Solve a problem to start the line.
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
                <defs>
                  <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--popover)',
                    border: '1px solid var(--border)',
                    fontSize: 12,
                  }}
                  labelFormatter={(value) => format(new Date(value as string), 'PPP')}
                  formatter={(value) => [Number(value ?? 0), 'Total solved']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fill="url(#solvedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
