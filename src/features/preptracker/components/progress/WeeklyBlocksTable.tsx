import { useMemo } from 'react'
import { addDays, format, startOfDay } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyLogMap } from '@/features/preptracker/types/preptracker.types'
import { cn } from '@/lib/utils'

const ROWS = 28

export function WeeklyBlocksTable({ dailyLog }: { dailyLog: DailyLogMap }) {
  const rows = useMemo(() => {
    const today = startOfDay(new Date())
    return Array.from({ length: ROWS }, (_, index) => {
      const date = addDays(today, -(ROWS - 1 - index))
      const key = format(date, 'yyyy-MM-dd')
      const entry = dailyLog[key]
      return {
        key,
        label: format(date, 'EEE MMM d'),
        dsa: entry?.dsaDone ?? false,
        theory: entry?.theoryDone ?? false,
        revision: entry?.revisionDone ?? false,
        minutes: entry?.minutesStudied ?? 0,
      }
    })
  }, [dailyLog])

  const totalMinutes = rows.reduce((sum, row) => sum + row.minutes, 0)
  const empty = totalMinutes === 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Last 4 weeks</CardTitle>
        <span className="text-xs text-muted-foreground">{totalMinutes} min total</span>
      </CardHeader>
      <CardContent>
        {empty && <p className="mb-3 text-sm text-muted-foreground">No daily logs yet.</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-2 font-medium">Date</th>
                <th className="py-2 px-2 font-medium">DSA</th>
                <th className="py-2 px-2 font-medium">Theory</th>
                <th className="py-2 px-2 font-medium">Revision</th>
                <th className="py-2 pl-2 text-right font-medium">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-border/40 last:border-b-0">
                  <td className="py-1.5 pr-2 text-muted-foreground">{row.label}</td>
                  <td className="py-1.5 px-2">
                    <BlockDot done={row.dsa} color="bg-purple-500" />
                  </td>
                  <td className="py-1.5 px-2">
                    <BlockDot done={row.theory} color="bg-blue-500" />
                  </td>
                  <td className="py-1.5 px-2">
                    <BlockDot done={row.revision} color="bg-amber-500" />
                  </td>
                  <td className="py-1.5 pl-2 text-right tabular-nums">{row.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function BlockDot({ done, color }: { done: boolean; color: string }) {
  return (
    <span
      aria-label={done ? 'done' : 'not done'}
      className={cn('inline-block h-2.5 w-2.5 rounded-full', done ? color : 'bg-muted')}
    />
  )
}
