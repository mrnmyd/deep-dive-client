import { useEffect } from 'react'
import { Pause, Play, Square } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useIdleDetector } from '@/features/deepdive/hooks/useIdleDetector'
import { useSessionTimer } from '@/features/deepdive/hooks/useSessionTimer'
import { paperIdForTopic } from '@/features/deepdive/utils/progress'
import { formatElapsed } from '@/features/deepdive/utils/session'
import { useTopicProgress } from '@/features/deepdive/hooks/useDeepDive'

export type SessionTimerProps = {
  currentTopicId: string | undefined
}

export function SessionTimer({ currentTopicId }: SessionTimerProps) {
  const { session, status, liveTotalMs, start, pause, resume, stop, switchContext } =
    useSessionTimer()
  const topicProgress = useTopicProgress()

  useEffect(() => {
    if (!session) return
    const paperId = currentTopicId ? (paperIdForTopic(currentTopicId) ?? null) : null
    switchContext(currentTopicId ?? null, paperId)
  }, [currentTopicId, session, switchContext])

  useIdleDetector(status === 'running', () => {
    pause()
    toast.warning('Paused — were you still studying?', {
      action: { label: 'Resume', onClick: () => resume() },
      duration: 12_000,
    })
  })

  const startSession = () => {
    if (!currentTopicId) {
      toast.info('Open a topic first to start a session.')
      return
    }
    const paperId = paperIdForTopic(currentTopicId) ?? null
    const isReview = topicProgress.getTopicStatus(currentTopicId) === 'needs_review'
    start(paperId, currentTopicId, isReview)
    toast.success('Session started')
  }

  const stopSession = () => {
    const result = stop()
    if (result) {
      toast.success(`Session saved — ${result.minutes} min`, {
        description: `Logged to ${result.block} block.`,
      })
    } else {
      toast.info('Session discarded — no time logged')
    }
  }

  return (
    <div className="space-y-3">
      <span role="status" aria-live="polite" className="sr-only">
        Session timer {status}
      </span>
      <div className="flex items-baseline justify-between">
        <span
          className="font-mono text-2xl tabular-nums"
          aria-label={`Elapsed ${formatElapsed(liveTotalMs)}`}
        >
          {formatElapsed(liveTotalMs)}
        </span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{status}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {status === 'idle' && (
          <Button size="sm" onClick={startSession} disabled={!currentTopicId}>
            <Play className="h-4 w-4" />
            Start
          </Button>
        )}
        {status === 'running' && (
          <Button size="sm" variant="outline" onClick={pause}>
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        )}
        {status === 'paused' && (
          <Button size="sm" onClick={resume}>
            <Play className="h-4 w-4" />
            Resume
          </Button>
        )}
        {status !== 'idle' && (
          <Button size="sm" variant="destructive" onClick={stopSession}>
            <Square className="h-4 w-4" />
            Stop &amp; save
          </Button>
        )}
      </div>
      {session && (
        <p className="text-xs text-muted-foreground">
          Started{' '}
          {new Date(session.startedAtIso).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  )
}
