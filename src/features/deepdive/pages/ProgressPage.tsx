import {
  useDailyLog,
  useProblemTracker,
  useTopicProgress,
} from '@/features/deepdive/hooks/useDeepDive'
import { PageHeader } from '@/features/deepdive/components/ui-helpers'
import { CumulativeSolvedChart } from '@/features/deepdive/components/progress/CumulativeSolvedChart'
import { HeatmapChart } from '@/features/deepdive/components/progress/HeatmapChart'
import { PaperCompletionChart } from '@/features/deepdive/components/progress/PaperCompletionChart'
import { PatternCoverageChart } from '@/features/deepdive/components/progress/PatternCoverageChart'
import { TopicStatusDonut } from '@/features/deepdive/components/progress/TopicStatusDonut'
import { WeeklyBlocksTable } from '@/features/deepdive/components/progress/WeeklyBlocksTable'

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
