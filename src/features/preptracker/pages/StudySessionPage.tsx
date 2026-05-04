import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Clock, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useDailyLog, useTopicProgress } from "@/features/preptracker/hooks/usePrepTracker"
import { PageHeader, ProgressBar, StatusBadge } from "@/features/preptracker/components/ui-helpers"
import { getAllModules, getTopicStudyContent, type ModuleWithContext } from "@/features/preptracker/utils/study-content"
import { topicTone } from "@/features/preptracker/utils/status-styles"

const SESSION_SECONDS = 90 * 60

export function StudySessionPage() {
  const modules = useMemo(() => getAllModules(), [])
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([])
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const topicProgress = useTopicProgress()
  const dailyLog = useDailyLog()
  const selectedModules = modules.filter((module) => selectedModuleIds.includes(module.id))
  const studiedTopics = selectedModules.flatMap((module) => module.topics)
  const completeCount = studiedTopics.filter((topic) => topicProgress.getTopicStatus(topic.id) === "done").length

  useEffect(() => {
    if (!startedAt) return

    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [startedAt])

  const elapsedSeconds = startedAt ? Math.floor((now - startedAt) / 1000) : 0
  const remainingSeconds = Math.max(0, SESSION_SECONDS - elapsedSeconds)

  const toggleModule = (moduleId: string) => {
    setSelectedModuleIds((current) => {
      if (current.includes(moduleId)) return current.filter((id) => id !== moduleId)
      if (current.length >= 3) return current
      return [...current, moduleId]
    })
  }

  const markTopicDone = (topicId: string) => {
    topicProgress.updateTopic(topicId, "done")
    dailyLog.addTopicStudied(topicId)
    dailyLog.logBlock("theory", true)
  }

  return (
    <div>
      <PageHeader
        title="Study Session"
        description="Select up to 3 modules, start the timer, study the built-in material, and mark topics complete as you finish them."
        action={
          <Button
            disabled={!selectedModuleIds.length || Boolean(startedAt)}
            onClick={() => {
              const timestamp = Date.now()
              setStartedAt(timestamp)
              setNow(timestamp)
            }}
          >
            <PlayCircle className="h-4 w-4" />
            Start session
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Selected modules</p>
              <p className="text-2xl font-semibold">{selectedModuleIds.length}/3</p>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Timer</p>
            <p className="text-2xl font-semibold">{formatTime(remainingSeconds)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Topics completed</p>
            <p className="text-2xl font-semibold">{completeCount}/{studiedTopics.length}</p>
            <ProgressBar value={studiedTopics.length ? (completeCount / studiedTopics.length) * 100 : 0} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {!startedAt ? (
        <ModulePicker modules={modules} selectedModuleIds={selectedModuleIds} onToggleModule={toggleModule} />
      ) : (
        <StudyMaterial modules={selectedModules} onMarkDone={markTopicDone} getTopicStatus={topicProgress.getTopicStatus} />
      )}
    </div>
  )
}

function ModulePicker({
  modules,
  selectedModuleIds,
  onToggleModule,
}: {
  modules: ModuleWithContext[]
  selectedModuleIds: string[]
  onToggleModule: (moduleId: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((module) => {
        const selected = selectedModuleIds.includes(module.id)
        const disabled = !selected && selectedModuleIds.length >= 3

        return (
          <button
            key={module.id}
            disabled={disabled}
            onClick={() => onToggleModule(module.id)}
            className="text-left disabled:opacity-50"
          >
            <Card className={selected ? "ring-2 ring-primary" : "transition-colors hover:bg-muted/40"}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-3">
                  <span>{module.title}</span>
                  <Checkbox checked={selected} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.paper.title}</p>
                <p className="mt-2 text-sm">{module.topics.length} topics</p>
              </CardContent>
            </Card>
          </button>
        )
      })}
    </div>
  )
}

function StudyMaterial({
  modules,
  onMarkDone,
  getTopicStatus,
}: {
  modules: ModuleWithContext[]
  onMarkDone: (topicId: string) => void
  getTopicStatus: (topicId: string) => "not_started" | "in_progress" | "done" | "needs_review"
}) {
  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <CardTitle>{module.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{module.paper.title}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {module.topics.map((topic) => {
              const content = getTopicStudyContent(topic, module)
              const status = getTopicStatus(topic.id)

              return (
                <article key={topic.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{topic.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{content.objective}</p>
                    </div>
                    <StatusBadge label={status.replace("_", " ")} tone={topicTone[status]} />
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <StudyList title="Core Study Material" items={content.essentials} />
                    <StudyList title="Interview Checkpoints" items={content.checkpoints} />
                    <StudyList title="Active Practice" items={content.practice} />
                  </div>

                  <Button className="mt-4" variant={status === "done" ? "outline" : "default"} onClick={() => onMarkDone(topic.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                    {status === "done" ? "Completed" : "Mark topic complete"}
                  </Button>
                </article>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StudyList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </section>
  )
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}
