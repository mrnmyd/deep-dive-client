import { Link } from 'react-router-dom'
import { BookOpen, CalendarCheck, Flame, PlayCircle, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { syllabus } from '@/features/deepdive/data/syllabus'
import {
  useDailyLog,
  useProblemTracker,
  useSettings,
  useTopicProgress,
} from '@/features/deepdive/hooks/useDeepDive'
import { PageHeader, ProgressBar } from '@/features/deepdive/components/ui-helpers'
import { allTopics } from '@/features/deepdive/utils/progress'
import { tokensForPaperColor } from '@/features/deepdive/utils/paper-color'
import { getAllModules } from '@/features/deepdive/utils/study-content'

export function DashboardPage() {
  const { settings, updateSettings } = useSettings()
  const topicProgress = useTopicProgress()
  const problemTracker = useProblemTracker()
  const dailyLog = useDailyLog()
  const streak = dailyLog.getStreak()
  const dailyPercent = Math.round((dailyLog.todayLog.minutesStudied / settings.dailyGoalMins) * 100)
  const doneTopics = allTopics.filter((topic) => topicProgress.getTopicStatus(topic.id) === 'done')
  const recentTopics = doneTopics
    .map((topic) => ({ topic, updatedAt: topicProgress.progress[topic.id]?.lastUpdated ?? '' }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3)

  return (
    <div>
      <PageHeader
        title={settings.userName ? `Welcome back, ${settings.userName}` : 'DeepDive Dashboard'}
        description={`Choose a session, study the material here, and mark topics complete. ${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}`}
        action={
          <Button asChild>
            <Link to="/">
              <PlayCircle className="h-4 w-4" />
              Open Reader
            </Link>
          </Button>
        }
      />

      {!settings.userName && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set up your study profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <Input
              placeholder="Your name"
              onChange={(event) => updateSettings({ userName: event.target.value })}
            />
            <Input
              type="number"
              defaultValue={settings.dailyGoalMins}
              onChange={(event) =>
                updateSettings({ dailyGoalMins: Number(event.target.value) || 180 })
              }
            />
            <Button asChild>
              <Link to="/settings">Preferences</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-4 w-4" /> Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{streak.currentStreak} days</p>
            <p className="text-sm text-muted-foreground">Longest: {streak.longestStreak} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{dailyPercent}%</p>
            <ProgressBar value={dailyPercent} className="mt-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              {dailyLog.todayLog.minutesStudied} / {settings.dailyGoalMins} minutes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{problemTracker.getSolvedCount()}</p>
            <p className="text-sm text-muted-foreground">
              Solved of {problemTracker.problems.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Study Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{getAllModules().length}</p>
            <p className="text-sm text-muted-foreground">Available to study</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Paper Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syllabus.map((paper) => {
              const value = topicProgress.getPaperCompletion(paper.id)
              const tokens = tokensForPaperColor(paper.color)
              return (
                <div key={paper.id}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        aria-hidden
                        className={`inline-block h-2 w-2 rounded-full ${tokens.bar}`}
                      />
                      {paper.title}
                    </span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <ProgressBar value={value} fillClassName={tokens.bar} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" /> Today's Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dailyLog.todayLog.dsaDone &&
                dailyLog.todayLog.theoryDone &&
                dailyLog.todayLog.revisionDone &&
                dailyLog.todayLog.buildDone
                  ? "You have completed today's study block."
                  : 'Start a focused session and study up to 3 modules.'}
              </p>
              <Button className="mt-4 w-full" asChild>
                <Link to="/">Open Reader</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTopics.length ? (
                recentTopics.map(({ topic, updatedAt }) => (
                  <div key={topic.id} className="rounded-lg border p-3">
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No completed topics yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
