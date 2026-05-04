import { useEffect, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { syllabus } from '@/features/preptracker/data/syllabus'
import { useLocalStorage } from '@/features/preptracker/hooks/useLocalStorage'
import { useTopicProgress } from '@/features/preptracker/hooks/usePrepTracker'
import { StatusBadge } from '@/features/preptracker/components/ui-helpers'
import { paperColorTokens } from '@/features/preptracker/utils/paper-color'
import { topicTone } from '@/features/preptracker/utils/status-styles'
import { allTopics } from '@/features/preptracker/utils/progress'
import { STORAGE_KEYS } from '@/features/preptracker/utils/storage'

type TreeState = {
  papers: Record<string, boolean>
  modules: Record<string, boolean>
}

const defaultTreeState: TreeState = { papers: {}, modules: {} }

export type SyllabusTreeProps = {
  currentTopicId: string | undefined
  onSelect: (topicId: string) => void
}

export function SyllabusTree({ currentTopicId, onSelect }: SyllabusTreeProps) {
  const topicProgress = useTopicProgress()
  const [tree, setTree] = useLocalStorage<TreeState>(STORAGE_KEYS.treeState, defaultTreeState)

  const currentPaperId = useMemo(() => {
    const topic = allTopics.find((entry) => entry.id === currentTopicId)
    return topic?.paperId
  }, [currentTopicId])

  const currentModuleId = useMemo(() => {
    const topic = allTopics.find((entry) => entry.id === currentTopicId)
    return topic?.moduleId
  }, [currentTopicId])

  useEffect(() => {
    if (!currentPaperId || !currentModuleId) return
    setTree((previous) => {
      const papers =
        previous.papers[currentPaperId] === false
          ? previous.papers
          : { ...previous.papers, [currentPaperId]: true }
      const modules =
        previous.modules[currentModuleId] === false
          ? previous.modules
          : { ...previous.modules, [currentModuleId]: true }
      if (papers === previous.papers && modules === previous.modules) return previous
      return { papers, modules }
    })
  }, [currentPaperId, currentModuleId, setTree])

  const togglePaper = (paperId: string) => {
    setTree((previous) => ({
      ...previous,
      papers: { ...previous.papers, [paperId]: previous.papers[paperId] === false ? true : false },
    }))
  }
  const toggleModule = (moduleId: string) => {
    setTree((previous) => ({
      ...previous,
      modules: {
        ...previous.modules,
        [moduleId]: previous.modules[moduleId] === false ? true : false,
      },
    }))
  }

  const isPaperOpen = (paperId: string) => tree.papers[paperId] !== false
  const isModuleOpen = (moduleId: string) => tree.modules[moduleId] !== false

  return (
    <nav aria-label="Syllabus" className="px-2 py-3 text-sm">
      <ul className="space-y-2">
        {syllabus.map((paper) => {
          const tokens = paperColorTokens[paper.color]
          const completion = topicProgress.getPaperCompletion(paper.id)
          const open = isPaperOpen(paper.id)
          return (
            <li key={paper.id}>
              <button
                type="button"
                onClick={() => togglePaper(paper.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md border-l-4 px-2 py-2 text-left transition-colors hover:bg-muted/50',
                  tokens.accent
                )}
              >
                {open ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="flex-1 truncate font-medium">{paper.title}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{completion}%</span>
              </button>

              {open && (
                <ul className="mt-1 space-y-1 pl-4">
                  {paper.modules.map((module) => {
                    const moduleOpen = isModuleOpen(module.id)
                    return (
                      <li key={module.id}>
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/50"
                        >
                          {moduleOpen ? (
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate text-sm text-muted-foreground">
                            {module.title}
                          </span>
                        </button>

                        {moduleOpen && (
                          <ul className="mt-1 space-y-0.5 pl-5">
                            {module.topics.map((topic) => {
                              const status = topicProgress.getTopicStatus(topic.id)
                              const active = topic.id === currentTopicId
                              return (
                                <li key={topic.id}>
                                  <div
                                    className={cn(
                                      'group flex items-center gap-2 rounded-md border-l-2 pl-2 pr-1 transition-colors',
                                      tokens.accent,
                                      active ? 'bg-muted text-foreground' : 'hover:bg-muted/40'
                                    )}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => onSelect(topic.id)}
                                      className="flex flex-1 items-start gap-2 py-1.5 text-left"
                                    >
                                      <span
                                        className={cn(
                                          'flex-1 truncate text-sm',
                                          topic.priority === 'high' && 'font-semibold'
                                        )}
                                      >
                                        {topic.title}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      aria-label={`Cycle status (current: ${status.replace('_', ' ')})`}
                                      onClick={() => topicProgress.cycleTopicStatus(topic.id)}
                                      className="shrink-0"
                                    >
                                      <StatusBadge
                                        label={status.replace('_', ' ')}
                                        tone={topicTone[status]}
                                      />
                                    </button>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
