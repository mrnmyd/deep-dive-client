import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { syllabus } from "@/features/preptracker/data/syllabus"
import { useDailyLog, useProblemTracker, useTopicProgress } from "@/features/preptracker/hooks/usePrepTracker"
import { PageHeader, ProgressBar, StatusBadge } from "@/features/preptracker/components/ui-helpers"
import { topicTone } from "@/features/preptracker/utils/status-styles"
import { getOverallTopicStats } from "@/features/preptracker/utils/progress"

export function ProgressPage() {
  const topicProgress = useTopicProgress()
  const problemTracker = useProblemTracker()
  const dailyLog = useDailyLog()
  const topicStats = getOverallTopicStats(topicProgress.progress)
  const last90Days = Array.from({ length: 90 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (89 - index))
    const key = date.toISOString().slice(0, 10)
    return { key, minutes: dailyLog.dailyLog[key]?.minutesStudied ?? 0 }
  })

  return (
    <div>
      <PageHeader title="Progress & Analytics" description="A local, honest view of preparation consistency and coverage." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1">
              {last90Days.map((day) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.minutes} minutes`}
                  className="aspect-square rounded-sm"
                  style={{ backgroundColor: heatColor(day.minutes) }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(topicStats).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between gap-3">
                <StatusBadge label={status.replace("_", " ")} tone={topicTone[status as keyof typeof topicTone]} />
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paper Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syllabus.map((paper) => {
              const value = topicProgress.getPaperCompletion(paper.id)
              return (
                <div key={paper.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{paper.title}</span>
                    <span>{value}%</span>
                  </div>
                  <ProgressBar value={value} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pattern Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {problemTracker.getPatternStats().map((stat) => (
              <div key={stat.pattern}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{stat.pattern}</span>
                  <span>{stat.solved}/{stat.total}</span>
                </div>
                <ProgressBar value={(stat.solved / stat.total) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function heatColor(minutes: number) {
  if (minutes >= 180) return "rgb(34 197 94)"
  if (minutes >= 120) return "rgb(74 222 128)"
  if (minutes >= 60) return "rgb(134 239 172)"
  if (minutes > 0) return "rgb(220 252 231)"
  return "rgb(229 231 235)"
}
