import { useMemo } from 'react'
import { addDays, format, startOfDay, startOfWeek } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyLogMap } from '@/features/deepdive/types/deepdive.types'
import { cn } from '@/lib/utils'

const WEEKS = 13
const DAYS_PER_WEEK = 7
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const intensityClass = (minutes: number): string => {
  if (minutes <= 0) return 'bg-muted'
  if (minutes <= 15) return 'bg-emerald-200 dark:bg-emerald-900'
  if (minutes <= 45) return 'bg-emerald-300 dark:bg-emerald-700'
  if (minutes <= 90) return 'bg-emerald-500 dark:bg-emerald-500'
  return 'bg-emerald-600 dark:bg-emerald-400'
}

export function HeatmapChart({ dailyLog }: { dailyLog: DailyLogMap }) {
  const { columns, monthLabels, totalMinutes } = useMemo(() => {
    const today = startOfDay(new Date())
    const start = startOfWeek(addDays(today, -((WEEKS - 1) * DAYS_PER_WEEK + today.getDay())), {
      weekStartsOn: 0,
    })

    const cols: Array<Array<{ date: Date; key: string; minutes: number; future: boolean }>> = []
    let weekDate = start
    let runningTotal = 0
    for (let week = 0; week < WEEKS; week += 1) {
      const days: Array<{ date: Date; key: string; minutes: number; future: boolean }> = []
      for (let day = 0; day < DAYS_PER_WEEK; day += 1) {
        const date = addDays(weekDate, day)
        const key = format(date, 'yyyy-MM-dd')
        const minutes = dailyLog[key]?.minutesStudied ?? 0
        runningTotal += minutes
        days.push({ date, key, minutes, future: date > today })
      }
      cols.push(days)
      weekDate = addDays(weekDate, DAYS_PER_WEEK)
    }

    const labels: Array<{ index: number; label: string }> = []
    let lastMonth = ''
    cols.forEach((col, index) => {
      const month = format(col[0].date, 'MMM')
      if (month !== lastMonth) {
        labels.push({ index, label: month })
        lastMonth = month
      }
    })

    return { columns: cols, monthLabels: labels, totalMinutes: runningTotal }
  }, [dailyLog])

  const empty = totalMinutes === 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Activity heatmap</CardTitle>
        <span className="text-xs text-muted-foreground">last 13 weeks · {totalMinutes} min</span>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Start studying to see activity here.
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="relative grid grid-cols-[24px_1fr] gap-2 pt-4">
              <div className="grid grid-rows-7 gap-[3px] pt-[14px] text-[0.6rem] text-muted-foreground">
                {DAY_LABELS.map((label, index) => (
                  <span
                    key={label}
                    className={cn('h-3 leading-3', index % 2 === 1 ? '' : 'opacity-0')}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div>
                <div
                  className="relative mb-1 grid h-3 grid-cols-13 gap-1 text-[0.6rem] text-muted-foreground"
                  style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
                >
                  {monthLabels.map((entry) => (
                    <span
                      key={`${entry.label}-${entry.index}`}
                      style={{ gridColumnStart: entry.index + 1 }}
                    >
                      {entry.label}
                    </span>
                  ))}
                </div>
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
                >
                  {columns.map((column, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-[3px]">
                      {column.map((day) => (
                        <span
                          key={day.key}
                          title={`${day.key}: ${day.minutes} min`}
                          aria-label={`${day.key}: ${day.minutes} minutes`}
                          className={cn(
                            'h-3 w-full rounded-[2px]',
                            day.future ? 'bg-transparent' : intensityClass(day.minutes)
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[0.65rem] text-muted-foreground">
              <span>Less</span>
              {[0, 15, 45, 90, 91].map((threshold, index) => (
                <span
                  key={threshold}
                  className={cn(
                    'h-3 w-3 rounded-[2px]',
                    intensityClass(index === 0 ? 0 : threshold)
                  )}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
