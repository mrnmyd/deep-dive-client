import { problems } from "@/features/preptracker/data/problems"
import { syllabus } from "@/features/preptracker/data/syllabus"
import { useLocalStorage } from "@/features/preptracker/hooks/useLocalStorage"
import type {
  DailyLogMap,
  ProblemProgressMap,
  ProblemStatus,
  Settings,
  StudyBlockId,
  TopicProgressMap,
  TopicStatus,
} from "@/features/preptracker/types/preptracker.types"
import { calculateStreaks, getPaperCompletion, getPatternStats, getProblemStatus, getTopicStatus, problemStatusOrder, topicStatusOrder } from "@/features/preptracker/utils/progress"
import { defaultSettings, emptyDailyLog, STORAGE_KEYS, todayKey } from "@/features/preptracker/utils/storage"

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(STORAGE_KEYS.settings, defaultSettings)

  return {
    settings,
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((previous) => ({ ...previous, [key]: value }))
    },
    updateSettings: (value: Partial<Settings>) => setSettings((previous) => ({ ...previous, ...value })),
  }
}

export function useTopicProgress() {
  const [progress, setProgress] = useLocalStorage<TopicProgressMap>(STORAGE_KEYS.topicProgress, {})

  const updateTopic = (topicId: string, status: TopicStatus) => {
    setProgress((previous) => ({
      ...previous,
      [topicId]: {
        status,
        lastUpdated: new Date().toISOString(),
        timeSpentMins: previous[topicId]?.timeSpentMins ?? 0,
      },
    }))
  }

  const cycleTopicStatus = (topicId: string) => {
    const current = getTopicStatus(progress, topicId)
    const next = topicStatusOrder[(topicStatusOrder.indexOf(current) + 1) % topicStatusOrder.length]
    updateTopic(topicId, next)
  }

  return {
    progress,
    updateTopic,
    cycleTopicStatus,
    getTopicStatus: (topicId: string) => getTopicStatus(progress, topicId),
    getPaperCompletion: (paperId: string) => getPaperCompletion(progress, paperId),
  }
}

export function useProblemTracker() {
  const [progress, setProgress] = useLocalStorage<ProblemProgressMap>(STORAGE_KEYS.problemStatus, {})

  const updateProblem = (problemId: string, status: ProblemStatus) => {
    setProgress((previous) => {
      const existing = previous[problemId] ?? { status: "unsolved" as ProblemStatus, solveCount: 0, lastSolved: null, insight: "" }
      const solvedNow = status === "solved" && existing.status !== "solved"

      return {
        ...previous,
        [problemId]: {
          ...existing,
          status,
          solveCount: solvedNow ? existing.solveCount + 1 : existing.solveCount,
          lastSolved: solvedNow ? new Date().toISOString() : existing.lastSolved,
        },
      }
    })
  }

  const cycleProblemStatus = (problemId: string) => {
    const current = getProblemStatus(progress, problemId)
    const next = problemStatusOrder[(problemStatusOrder.indexOf(current) + 1) % problemStatusOrder.length]
    updateProblem(problemId, next)
  }

  return {
    problems,
    progress,
    updateProblem,
    cycleProblemStatus,
    getProblemStatus: (problemId: string) => getProblemStatus(progress, problemId),
    getSolvedCount: () => problems.filter((problem) => getProblemStatus(progress, problem.id) === "solved").length,
    getPatternStats: () => getPatternStats(progress),
  }
}

export function useDailyLog() {
  const [dailyLog, setDailyLog] = useLocalStorage<DailyLogMap>(STORAGE_KEYS.dailyLog, {})
  const today = todayKey()
  const todayLog = dailyLog[today] ?? emptyDailyLog()

  const updateTodayLog = (nextLog: DailyLogMap[string]) => {
    setDailyLog((previous) => ({
      ...previous,
      [today]: nextLog,
    }))
  }

  const logBlock = (blockId: StudyBlockId, done: boolean, reflection = todayLog.blocks[blockId].reflection) => {
    const nextBlocks = {
      ...todayLog.blocks,
      [blockId]: {
        ...todayLog.blocks[blockId],
        done,
        reflection,
      },
    }

    updateTodayLog({
      ...todayLog,
      dsaDone: nextBlocks.dsa.done,
      theoryDone: nextBlocks.theory.done,
      revisionDone: nextBlocks.revision.done,
      buildDone: nextBlocks.build.done,
      minutesStudied: Object.values(nextBlocks).reduce((total, block) => total + (block.done ? block.minutes : 0), 0),
      blocks: nextBlocks,
    })
  }

  const addTopicStudied = (topicId: string) => {
    updateTodayLog({
      ...todayLog,
      topicsStudied: Array.from(new Set([...todayLog.topicsStudied, topicId])),
    })
  }

  const addProblemAttempted = (problemId: string) => {
    updateTodayLog({
      ...todayLog,
      problemsAttempted: Array.from(new Set([...todayLog.problemsAttempted, problemId])),
    })
  }

  return {
    dailyLog,
    today,
    todayLog,
    logBlock,
    addTopicStudied,
    addProblemAttempted,
    getLogForDate: (date: string) => dailyLog[date],
    getStreak: () => calculateStreaks(dailyLog),
  }
}

export function useStreaks() {
  const { dailyLog } = useDailyLog()
  return calculateStreaks(dailyLog)
}

export { syllabus }
