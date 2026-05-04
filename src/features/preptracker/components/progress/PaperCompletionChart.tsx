import { useMemo } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { syllabus } from '@/features/preptracker/data/syllabus'
import type { TopicProgressMap } from '@/features/preptracker/types/preptracker.types'
import { paperColorTokens } from '@/features/preptracker/utils/paper-color'
import { getPaperCompletion } from '@/features/preptracker/utils/progress'

export function PaperCompletionChart({ progress }: { progress: TopicProgressMap }) {
  const data = useMemo(
    () =>
      syllabus.map((paper) => {
        const totalTopics = paper.modules.reduce((sum, module) => sum + module.topics.length, 0)
        const done =
          totalTopics === 0
            ? 0
            : Math.round((getPaperCompletion(progress, paper.id) / 100) * totalTopics)
        return {
          id: paper.id,
          name: paper.title.split(' — ')[0],
          completion: getPaperCompletion(progress, paper.id),
          done,
          total: totalTopics,
          color: paperColorTokens[paper.color].hex,
        }
      }),
    [progress]
  )

  const totalDone = data.reduce((sum, item) => sum + item.done, 0)
  const empty = totalDone === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paper completion</CardTitle>
      </CardHeader>
      <CardContent>
        {empty && (
          <p className="mb-3 text-sm text-muted-foreground">
            Mark topics done to see paper coverage here.
          </p>
        )}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                stroke="currentColor"
                className="text-xs text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="name"
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
                formatter={(value, _name, item) => {
                  const payload = item?.payload as (typeof data)[number] | undefined
                  if (!payload) return [`${Number(value ?? 0)}%`, 'Done']
                  return [
                    `${payload.done}/${payload.total} topics (${Number(value ?? 0)}%)`,
                    'Done',
                  ]
                }}
              />
              <Bar dataKey="completion" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
