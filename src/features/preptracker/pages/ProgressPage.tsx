import {
  useDailyLog,
  useProblemTracker,
  useTopicProgress,
} from '@/features/preptracker/hooks/usePrepTracker'
import { PageHeader } from '@/features/preptracker/components/ui-helpers'
import { CumulativeSolvedChart } from '@/features/preptracker/components/progress/CumulativeSolvedChart'
import { HeatmapChart } from '@/features/preptracker/components/progress/HeatmapChart'
import { PaperCompletionChart } from '@/features/preptracker/components/progress/PaperCompletionChart'
import { PatternCoverageChart } from '@/features/preptracker/components/progress/PatternCoverageChart'
import { TopicStatusDonut } from '@/features/preptracker/components/progress/TopicStatusDonut'
import { WeeklyBlocksTable } from '@/features/preptracker/components/progress/WeeklyBlocksTable'

export function ProgressPage() {
  const topicProgress = useTopicProgress()
  const problemTracker = useProblemTracker()
  const dailyLog = useDailyLog()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress & Analytics"
        description="A local, honest view of preparation consistency and coverage."
      />

      <HeatmapChart dailyLog={dailyLog.dailyLog} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PaperCompletionChart progress={topicProgress.progress} />
        <TopicStatusDonut progress={topicProgress.progress} />
        <CumulativeSolvedChart progress={problemTracker.progress} />
        <PatternCoverageChart progress={problemTracker.progress} />
      </div>

      <WeeklyBlocksTable dailyLog={dailyLog.dailyLog} />
    </div>
  )
}
