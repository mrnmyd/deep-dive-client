import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookmarkCheck, CheckCircle2, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { syllabus } from '@/features/deepdive/data/syllabus'
import { MarkdownContent } from '@/features/deepdive/components/markdown-content'
import { StatusBadge } from '@/features/deepdive/components/ui-helpers'
import { useDailyLog, useTopicProgress } from '@/features/deepdive/hooks/useDeepDive'
import { allTopics, findNeighbourTopic } from '@/features/deepdive/utils/progress'
import { paperColorTokens } from '@/features/deepdive/utils/paper-color'
import { topicTone } from '@/features/deepdive/utils/status-styles'
import { getModuleSupplement, getTopicStudyGuide } from '@/features/deepdive/utils/study-content'
import { markTopicDone, markTopicReview } from '@/features/deepdive/utils/topic-actions'
import { RelatedProblems } from '@/features/deepdive/components/reader/RelatedProblems'
import { cn } from '@/lib/utils'

const DEEP_SCROLL_THRESHOLD = 0.9
const SHALLOW_SCROLL_THRESHOLD = 0.05

export type TopicViewProps = {
  topicId: string | undefined
  onNavigate: (topicId: string) => void
}

export function TopicView({ topicId, onNavigate }: TopicViewProps) {
  const topicProgress = useTopicProgress()
  const dailyLog = useDailyLog()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestionDismissed, setSuggestionDismissed] = useState(false)
  const [trackedTopicId, setTrackedTopicId] = useState<string | undefined>(topicId)

  if (trackedTopicId !== topicId) {
    setTrackedTopicId(topicId)
    setShowSuggestion(false)
    setSuggestionDismissed(false)
  }

  const topic = useMemo(() => allTopics.find((entry) => entry.id === topicId), [topicId])
  const paper = useMemo(() => syllabus.find((item) => item.id === topic?.paperId), [topic])
  const module = useMemo(
    () => paper?.modules.find((item) => item.id === topic?.moduleId),
    [paper, topic]
  )

  const status = topic ? topicProgress.getTopicStatus(topic.id) : 'not_started'
  const tokens = paper ? paperColorTokens[paper.color] : null
  const markdown = useMemo(() => (topic ? getTopicStudyGuide(topic.id) : ''), [topic])
  const supplement = useMemo(() => (module ? getModuleSupplement(module.id) : null), [module])
  const previous = useMemo(() => (topic ? findNeighbourTopic(topic.id, -1) : undefined), [topic])
  const next = useMemo(() => (topic ? findNeighbourTopic(topic.id, +1) : undefined), [topic])
  const [supplementOpen, setSupplementOpen] = useState(false)

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [topicId])

  useEffect(() => {
    const node = scrollContainerRef.current
    if (!node || !topic) return

    let didShallow = false

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = node
      const total = scrollHeight - clientHeight
      if (total <= 0) return
      const ratio = scrollTop / total

      if (!didShallow && ratio > SHALLOW_SCROLL_THRESHOLD) {
        didShallow = true
        if (topicProgress.getTopicStatus(topic.id) === 'not_started') {
          topicProgress.updateTopic(topic.id, 'in_progress')
        }
      }

      if (!suggestionDismissed && ratio >= DEEP_SCROLL_THRESHOLD) {
        if (topicProgress.getTopicStatus(topic.id) !== 'done') {
          setShowSuggestion(true)
        }
      }
    }

    node.addEventListener('scroll', handleScroll, { passive: true })
    return () => node.removeEventListener('scroll', handleScroll)
  }, [topic, topicProgress, suggestionDismissed])

  if (!topic || !paper || !module || !tokens) {
    return <EmptyState />
  }

  const markDone = () => {
    markTopicDone(topic.id, topicProgress, dailyLog)
    setShowSuggestion(false)
  }

  const markReview = () => {
    markTopicReview(topic.id, topicProgress)
  }

  const dismissSuggestion = () => {
    setShowSuggestion(false)
    setSuggestionDismissed(true)
  }

  return (
    <div ref={scrollContainerRef} className="relative h-full overflow-y-auto">
      <article className="mx-auto max-w-[72ch] px-6 pb-32 pt-6 md:px-10">
        <header
          className={cn(
            'sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-start justify-between gap-3 border-b bg-background/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10'
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              <span
                className={cn('mr-2 inline-block h-2 w-2 rounded-full', tokens.bar)}
                aria-hidden
              />
              {paper.title} · {module.title}
            </p>
            <h1
              className={cn(
                'mt-1 text-2xl font-semibold tracking-tight',
                topic.priority === 'high' && 'text-foreground'
              )}
            >
              {topic.title}
            </h1>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge
              label={topic.priority}
              tone={
                topic.priority === 'high' ? 'red' : topic.priority === 'medium' ? 'amber' : 'gray'
              }
            />
            <StatusBadge label={status.replace('_', ' ')} tone={topicTone[status]} />
          </div>
        </header>

        <MarkdownContent content={markdown} />

        {supplement && (
          <section className="mt-10 rounded-lg border bg-muted/30">
            <button
              type="button"
              onClick={() => setSupplementOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium"
              aria-expanded={supplementOpen}
            >
              <span>Module-wide notes — {module.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200 motion-reduce:transition-none',
                  supplementOpen && 'rotate-180'
                )}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none',
                supplementOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t px-4 py-4">
                  <MarkdownContent content={supplement} />
                </div>
              </div>
            </div>
          </section>
        )}

        <RelatedProblems topicId={topic.id} variant="inline" />

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <div className="flex flex-wrap gap-2">
            <Button onClick={markDone} variant={status === 'done' ? 'outline' : 'default'}>
              <CheckCircle2 className="h-4 w-4" />
              {status === 'done' ? 'Marked done' : 'Mark done'}
            </Button>
            <Button onClick={markReview} variant="outline">
              <BookmarkCheck className="h-4 w-4" />
              Mark for review
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              disabled={!previous}
              onClick={() => previous && onNavigate(previous.id)}
            >
              <ArrowLeft className="h-4 w-4" />
              {previous ? previous.title : 'Start of syllabus'}
            </Button>
            <Button variant="ghost" disabled={!next} onClick={() => next && onNavigate(next.id)}>
              {next ? next.title : 'End of syllabus'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </article>

      {showSuggestion && status !== 'done' && (
        <div className="pointer-events-none sticky bottom-4 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-popover px-4 py-2 shadow-lg">
            <span className="text-sm">Mark this topic done?</span>
            <Button size="sm" onClick={markDone}>
              <CheckCircle2 className="h-4 w-4" />
              Mark done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissSuggestion}
              aria-label="Dismiss suggestion"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center">
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold">Pick a topic</h2>
        <p className="text-sm text-muted-foreground">
          Choose any topic from the syllabus on the left to start reading. Your last position is
          restored automatically when you return.
        </p>
      </div>
    </div>
  )
}
