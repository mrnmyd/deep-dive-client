import type { ActiveSession } from '@/features/preptracker/types/preptracker.types'

export const createSession = (
  paperId: string | null,
  topicId: string | null,
  startedAsReview: boolean
): ActiveSession => {
  const now = Date.now()
  return {
    startedAtIso: new Date(now).toISOString(),
    totalMs: 0,
    resumedAt: now,
    paperMs: {},
    currentPaperId: paperId,
    currentTopicId: topicId,
    paperChunkStart: paperId ? now : null,
    startedAsReview,
  }
}

const accruePaperChunk = (session: ActiveSession, atTime: number): Record<string, number> => {
  if (session.currentPaperId === null || session.paperChunkStart === null) return session.paperMs
  const delta = Math.max(0, atTime - session.paperChunkStart)
  if (delta === 0) return session.paperMs
  return {
    ...session.paperMs,
    [session.currentPaperId]: (session.paperMs[session.currentPaperId] ?? 0) + delta,
  }
}

export const pauseSession = (session: ActiveSession, atTime = Date.now()): ActiveSession => {
  if (session.resumedAt === null) return session
  const totalMs = session.totalMs + Math.max(0, atTime - session.resumedAt)
  const paperMs = accruePaperChunk(session, atTime)
  return {
    ...session,
    totalMs,
    paperMs,
    resumedAt: null,
    paperChunkStart: null,
  }
}

export const resumeSession = (session: ActiveSession, atTime = Date.now()): ActiveSession => {
  if (session.resumedAt !== null) return session
  return {
    ...session,
    resumedAt: atTime,
    paperChunkStart: session.currentPaperId ? atTime : null,
  }
}

export const switchSessionContext = (
  session: ActiveSession,
  topicId: string | null,
  paperId: string | null,
  atTime = Date.now()
): ActiveSession => {
  if (session.currentTopicId === topicId && session.currentPaperId === paperId) return session
  if (session.resumedAt === null) {
    return { ...session, currentTopicId: topicId, currentPaperId: paperId, paperChunkStart: null }
  }
  const paperMs = accruePaperChunk(session, atTime)
  return {
    ...session,
    paperMs,
    currentTopicId: topicId,
    currentPaperId: paperId,
    paperChunkStart: paperId ? atTime : null,
  }
}

export const computeLiveTotalMs = (session: ActiveSession, atTime = Date.now()): number => {
  if (session.resumedAt === null) return session.totalMs
  return session.totalMs + Math.max(0, atTime - session.resumedAt)
}

export const computeLivePaperMs = (
  session: ActiveSession,
  atTime = Date.now()
): Record<string, number> => {
  if (
    session.resumedAt === null ||
    session.currentPaperId === null ||
    session.paperChunkStart === null
  ) {
    return session.paperMs
  }
  const delta = Math.max(0, atTime - session.paperChunkStart)
  if (delta === 0) return session.paperMs
  return {
    ...session.paperMs,
    [session.currentPaperId]: (session.paperMs[session.currentPaperId] ?? 0) + delta,
  }
}

export const dominantPaperId = (paperMs: Record<string, number>): string | null => {
  let bestId: string | null = null
  let bestMs = -1
  for (const [id, ms] of Object.entries(paperMs)) {
    if (ms > bestMs) {
      bestId = id
      bestMs = ms
    }
  }
  return bestId
}

export const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0)
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
