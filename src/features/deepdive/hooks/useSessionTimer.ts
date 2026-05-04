import { useCallback, useEffect, useState } from 'react'
import { useActiveSession, useDailyLog } from '@/features/deepdive/hooks/useDeepDive'
import { blockForPaper } from '@/features/deepdive/utils/progress'
import {
  computeLivePaperMs,
  computeLiveTotalMs,
  createSession,
  dominantPaperId,
  pauseSession,
  resumeSession,
  switchSessionContext,
} from '@/features/deepdive/utils/session'

const TICK_INTERVAL_MS = 1000

export type SessionStatus = 'idle' | 'running' | 'paused'

export function useSessionTimer() {
  const { session, setSession, clearSession } = useActiveSession()
  const dailyLog = useDailyLog()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!session || session.resumedAt === null) return
    const id = window.setInterval(() => setTick((value) => value + 1), TICK_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [session?.resumedAt, session])

  const status: SessionStatus = !session
    ? 'idle'
    : session.resumedAt === null
      ? 'paused'
      : 'running'
  const liveTotalMs = session ? computeLiveTotalMs(session) : 0
  const livePaperMs = session ? computeLivePaperMs(session) : {}

  const start = useCallback(
    (paperId: string | null, topicId: string | null, startedAsReview = false) => {
      setSession(() => createSession(paperId, topicId, startedAsReview))
    },
    [setSession]
  )

  const pause = useCallback(() => {
    setSession((previous) => (previous ? pauseSession(previous) : previous))
  }, [setSession])

  const resume = useCallback(() => {
    setSession((previous) => (previous ? resumeSession(previous) : previous))
  }, [setSession])

  const switchContext = useCallback(
    (topicId: string | null, paperId: string | null) => {
      setSession((previous) =>
        previous ? switchSessionContext(previous, topicId, paperId) : previous
      )
    },
    [setSession]
  )

  const stop = useCallback(() => {
    if (!session) return null
    const finalised = session.resumedAt === null ? session : pauseSession(session)
    if (finalised.totalMs <= 0) {
      clearSession()
      return null
    }
    const minutes = Math.max(1, Math.round(finalised.totalMs / 60000))
    const winningPaper = dominantPaperId(finalised.paperMs) ?? finalised.currentPaperId
    const block = blockForPaper(winningPaper ?? undefined, finalised.startedAsReview)
    dailyLog.addMinutesToBlock(block, minutes)
    clearSession()
    return { minutes, block, paperId: winningPaper }
  }, [session, clearSession, dailyLog])

  void tick

  return { session, status, liveTotalMs, livePaperMs, start, pause, resume, stop, switchContext }
}
