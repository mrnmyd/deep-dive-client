import type { useDailyLog, useTopicProgress } from '@/features/preptracker/hooks/usePrepTracker'
import { blockForPaper, paperIdForTopic } from '@/features/preptracker/utils/progress'

type TopicProgressApi = ReturnType<typeof useTopicProgress>
type DailyLogApi = ReturnType<typeof useDailyLog>

export const markTopicDone = (
  topicId: string,
  topicProgress: TopicProgressApi,
  dailyLog: DailyLogApi
) => {
  const previousStatus = topicProgress.getTopicStatus(topicId)
  const isReview = previousStatus === 'needs_review'
  const block = blockForPaper(paperIdForTopic(topicId), isReview)
  topicProgress.updateTopic(topicId, 'done')
  dailyLog.addTopicStudied(topicId)
  dailyLog.logBlock(block, true)
}

export const markTopicReview = (topicId: string, topicProgress: TopicProgressApi) => {
  topicProgress.updateTopic(topicId, 'needs_review')
}
