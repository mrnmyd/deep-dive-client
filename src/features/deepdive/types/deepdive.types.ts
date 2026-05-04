export type TopicStatus = 'not_started' | 'in_progress' | 'done' | 'needs_review'

export type ProblemStatus = 'unsolved' | 'attempted' | 'solved' | 'needs_retry'

export type StudyBlockId = 'dsa' | 'theory' | 'revision' | 'build'

export type PaperColor = 'purple' | 'teal' | 'blue' | 'amber' | 'gray'

export type TopicPriority = 'high' | 'medium' | 'low'

export type Topic = {
  id: string
  title: string
  priority: TopicPriority
  estimatedHours: number
  tags: string[]
}

export type Module = {
  id: string
  title: string
  topics: Topic[]
}

export type Paper = {
  id: string
  title: string
  subtitle: string
  priority: number
  color: PaperColor
  modules: Module[]
}

export type Problem = {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  pattern: string
  week: number
  leetcodeUrl: string
  insight: string
  relatedTopicId: string
}

export type TopicProgress = {
  status: TopicStatus
  lastUpdated: string
  timeSpentMins: number
}

export type ProblemProgress = {
  status: ProblemStatus
  solveCount: number
  lastSolved: string | null
  insight: string
}

export type DailyBlock = {
  done: boolean
  minutes: number
  reflection: string
}

export type DailyLogEntry = {
  dsaDone: boolean
  theoryDone: boolean
  revisionDone: boolean
  buildDone: boolean
  minutesStudied: number
  topicsStudied: string[]
  problemsAttempted: string[]
  blocks: Record<StudyBlockId, DailyBlock>
}

export type Settings = {
  userName: string
  dailyGoalMins: number
  theme: 'light' | 'dark' | 'system'
  startDate: string
  currentPaper: string
  lastReadTopicId?: string
}

export type Streaks = {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
}

export type ActiveSession = {
  startedAtIso: string
  totalMs: number
  resumedAt: number | null
  paperMs: Record<string, number>
  currentPaperId: string | null
  currentTopicId: string | null
  paperChunkStart: number | null
  startedAsReview: boolean
}

export type TopicProgressMap = Record<string, TopicProgress>
export type ProblemProgressMap = Record<string, ProblemProgress>
export type DailyLogMap = Record<string, DailyLogEntry>
export type TopicNotesMap = Record<string, string>

export type BackupConfig = {
  intervalMinutes: number
  keepLast: number
  lastBackupAt: string | null
  lastBackupHash: string | null
  lastBackupFilename: string | null
  lastFolderName: string | null
}
