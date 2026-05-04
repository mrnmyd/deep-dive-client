import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProblemProgressMap } from '@/features/preptracker/types/preptracker.types'
import { getPatternStats } from '@/features/preptracker/utils/progress'

export function PatternCoverageChart({ progress }: { progress: ProblemProgressMap }) {
  const data = useMemo(() => {
    return getPatternStats(progress)
      .map((stat) => ({
        pattern: stat.pattern,
        solved: stat.solved,
        unsolved: Math.max(0, stat.total - stat.solved),
        total: stat.total,
      }))
      .sort((a, b) => b.total - a.total)
  }, [progress])

  const totalSolved = data.reduce((sum, item) => sum + item.solved, 0)
  const empty = totalSolved === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern coverage</CardTitle>
      </CardHeader>
      <CardContent>
        {empty && (
          <p className="mb-3 text-sm text-muted-foreground">
            Solve a problem to populate the patterns chart.
          </p>
        )}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="pattern"
                width={150}
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <Tooltip
                cursor={{ fill: 'rgba(127,127,127,0.08)' }}
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  const count = Number(value ?? 0)
                  return [
                    `${count} problem${count === 1 ? '' : 's'}`,
                    name === 'solved' ? 'Solved' : 'Unsolved',
                  ]
                }}
              />
              <Bar dataKey="solved" stackId="coverage" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar
                dataKey="unsolved"
                stackId="coverage"
                fill="rgba(127,127,127,0.25)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
