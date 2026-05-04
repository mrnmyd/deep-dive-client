import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ReaderTopBar } from '@/features/deepdive/components/reader/ReaderTopBar'
import { SyllabusTree } from '@/features/deepdive/components/reader/SyllabusTree'
import { TopicView } from '@/features/deepdive/components/reader/TopicView'
import { RightRail } from '@/features/deepdive/components/reader/RightRail'
import { useDailyLog, useSettings, useTopicProgress } from '@/features/deepdive/hooks/useDeepDive'
import { useSessionTimer } from '@/features/deepdive/hooks/useSessionTimer'
import { useShortcuts } from '@/features/deepdive/hooks/useShortcuts'
import {
  findNeighbourTopic,
  findResumeTopicId,
  paperIdForTopic,
} from '@/features/deepdive/utils/progress'
import { markTopicDone, markTopicReview } from '@/features/deepdive/utils/topic-actions'
import { useShortcutStore, type ShortcutBinding } from '@/stores/shortcuts.store'

export function ReaderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings, updateSetting } = useSettings()
  const topicProgress = useTopicProgress()
  const dailyLog = useDailyLog()
  const timer = useSessionTimer()
  const toggleNotes = useShortcutStore((state) => state.toggleNotes)
  const triggerNotesFocus = useShortcutStore((state) => state.triggerNotesFocus)

  const topicFromUrl = searchParams.get('topic') ?? undefined
  const resolvedTopicId = useMemo(() => {
    return findResumeTopicId(topicProgress.progress, topicFromUrl ?? settings.lastReadTopicId)
  }, [topicFromUrl, settings.lastReadTopicId, topicProgress.progress])

  useEffect(() => {
    if (!resolvedTopicId) return
    if (topicFromUrl !== resolvedTopicId) {
      setSearchParams({ topic: resolvedTopicId }, { replace: true })
    }
    if (settings.lastReadTopicId !== resolvedTopicId) {
      updateSetting('lastReadTopicId', resolvedTopicId)
    }
  }, [resolvedTopicId, topicFromUrl, setSearchParams, settings.lastReadTopicId, updateSetting])

  const onSelect = useCallback(
    (topicId: string) => {
      setSearchParams({ topic: topicId }, { replace: false })
      updateSetting('lastReadTopicId', topicId)
    },
    [setSearchParams, updateSetting]
  )

  const goNeighbour = useCallback(
    (direction: 1 | -1) => {
      if (!resolvedTopicId) return
      const next = findNeighbourTopic(resolvedTopicId, direction)
      if (next) onSelect(next.id)
    },
    [resolvedTopicId, onSelect]
  )

  const toggleTimer = useCallback(() => {
    if (!timer.session) {
      if (!resolvedTopicId) {
        toast.info('Open a topic first to start a session.')
        return
      }
      const paperId = paperIdForTopic(resolvedTopicId) ?? null
      const isReview = topicProgress.getTopicStatus(resolvedTopicId) === 'needs_review'
      timer.start(paperId, resolvedTopicId, isReview)
      toast.success('Session started')
      return
    }
    if (timer.status === 'running') {
      timer.pause()
      toast.info('Session paused')
    } else {
      timer.resume()
      toast.success('Session resumed')
    }
  }, [timer, resolvedTopicId, topicProgress])

  const stopTimer = useCallback(() => {
    if (!timer.session) {
      toast.info('No active session.')
      return
    }
    const result = timer.stop()
    if (result) {
      toast.success(`Session saved — ${result.minutes} min`, {
        description: `Logged to ${result.block} block.`,
      })
    } else {
      toast.info('Session discarded — no time logged')
    }
  }, [timer])

  const readerBindings: ShortcutBinding[] = useMemo(
    () => [
      { keys: 'j', description: 'Next topic', category: 'Reader', handler: () => goNeighbour(1) },
      {
        keys: 'k',
        description: 'Previous topic',
        category: 'Reader',
        handler: () => goNeighbour(-1),
      },
      {
        keys: 'm',
        description: 'Mark topic done',
        category: 'Reader',
        handler: () => {
          if (!resolvedTopicId) return
          const status = topicProgress.getTopicStatus(resolvedTopicId)
          if (status === 'done') {
            topicProgress.updateTopic(resolvedTopicId, 'not_started')
          } else {
            markTopicDone(resolvedTopicId, topicProgress, dailyLog)
          }
        },
      },
      {
        keys: 'r',
        description: 'Mark topic for review',
        category: 'Reader',
        handler: () => {
          if (!resolvedTopicId) return
          markTopicReview(resolvedTopicId, topicProgress)
        },
      },
      {
        keys: 'n',
        description: 'Toggle notes',
        category: 'Reader',
        handler: () => {
          toggleNotes()
          window.requestAnimationFrame(() => triggerNotesFocus())
        },
      },
      { keys: 't', description: 'Start / pause session', category: 'Reader', handler: toggleTimer },
      { keys: 's', description: 'Stop session', category: 'Reader', handler: stopTimer },
    ],
    [
      goNeighbour,
      resolvedTopicId,
      topicProgress,
      dailyLog,
      toggleNotes,
      triggerNotesFocus,
      toggleTimer,
      stopTimer,
    ]
  )

  useShortcuts('reader', readerBindings)

  const renderTreeDrawer = (close: () => void) => (
    <SyllabusTree
      currentTopicId={resolvedTopicId}
      onSelect={(id) => {
        onSelect(id)
        close()
      }}
    />
  )

  const renderRailDrawer = () => <RightRail topicId={resolvedTopicId} />

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <ReaderTopBar renderTreeDrawer={renderTreeDrawer} renderRailDrawer={renderRailDrawer} />
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px]">
        <aside className="hidden overflow-y-auto border-r md:block">
          <SyllabusTree currentTopicId={resolvedTopicId} onSelect={onSelect} />
        </aside>
        <main className="overflow-hidden">
          <TopicView topicId={resolvedTopicId} onNavigate={onSelect} />
        </main>
        <aside className="hidden overflow-y-auto border-l xl:block">
          <RightRail topicId={resolvedTopicId} />
        </aside>
      </div>
    </div>
  )
}
