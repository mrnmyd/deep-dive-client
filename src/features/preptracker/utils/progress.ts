import { problems } from "@/features/preptracker/data/problems"
import { syllabus } from "@/features/preptracker/data/syllabus"
import type { DailyLogMap, ProblemProgressMap, ProblemStatus, Topic, TopicProgressMap, TopicStatus } from "@/features/preptracker/types/preptracker.types"

export const topicStatusOrder: TopicStatus[] = ["not_started", "in_progress", "done", "needs_review"]
export const problemStatusOrder: ProblemStatus[] = ["unsolved", "attempted", "solved", "needs_retry"]

export const allTopics = syllabus.flatMap((paper) =>
  paper.modules.flatMap((module) =>
    module.topics.map((topic) => ({
      ...topic,
      paperId: paper.id,
      paperTitle: paper.title,
      moduleId: module.id,
      moduleTitle: module.title,
    }))
  )
)

export type TopicWithContext = Topic & {
  paperId: string
  paperTitle: string
  moduleId: string
  moduleTitle: string
}

export const getTopicStatus = (progress: TopicProgressMap, topicId: string): TopicStatus =>
  progress[topicId]?.status ?? "not_started"

export const getPaperCompletion = (progress: TopicProgressMap, paperId: string) => {
  const paper = syllabus.find((item) => item.id === paperId)
  if (!paper) return 0

  const topics = paper.modules.flatMap((module) => module.topics)
  const done = topics.filter((topic) => getTopicStatus(progress, topic.id) === "done").length

  return Math.round((done / topics.length) * 100)
}

export const getOverallTopicStats = (progress: TopicProgressMap) => {
  const stats = topicStatusOrder.reduce<Record<TopicStatus, number>>((acc, status) => {
    acc[status] = 0
    return acc
  }, {} as Record<TopicStatus, number>)

  allTopics.forEach((topic) => {
    stats[getTopicStatus(progress, topic.id)] += 1
  })

  return stats
}

export const getProblemStatus = (progress: ProblemProgressMap, problemId: string): ProblemStatus =>
  progress[problemId]?.status ?? "unsolved"

export const getPatternStats = (progress: ProblemProgressMap) => {
  const stats = new Map<string, { pattern: string; solved: number; total: number }>()

  problems.forEach((problem) => {
    const current = stats.get(problem.pattern) ?? { pattern: problem.pattern, solved: 0, total: 0 }
    current.total += 1
    if (getProblemStatus(progress, problem.id) === "solved") current.solved += 1
    stats.set(problem.pattern, current)
  })

  return Array.from(stats.values()).sort((a, b) => a.pattern.localeCompare(b.pattern))
}

export const isActiveDailyLog = (entry: DailyLogMap[string] | undefined) =>
  Boolean(entry && (entry.dsaDone || entry.theoryDone || entry.revisionDone || entry.buildDone || entry.minutesStudied > 0))

export const calculateStreaks = (dailyLog: DailyLogMap) => {
  const activeDays = Object.keys(dailyLog).filter((date) => isActiveDailyLog(dailyLog[date])).sort()
  let longestStreak = 0
  let running = 0
  let previousTime = 0

  activeDays.forEach((date) => {
    const time = new Date(`${date}T00:00:00`).getTime()
    const dayMs = 86_400_000
    running = previousTime && time - previousTime === dayMs ? running + 1 : 1
    longestStreak = Math.max(longestStreak, running)
    previousTime = time
  })

  const today = new Date()
  const todayString = today.toISOString().slice(0, 10)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdayString = yesterday.toISOString().slice(0, 10)
  const lastActiveDate = activeDays.at(-1) ?? null
  const currentStreak = lastActiveDate === todayString || lastActiveDate === yesterdayString ? running : 0

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
  }
}
