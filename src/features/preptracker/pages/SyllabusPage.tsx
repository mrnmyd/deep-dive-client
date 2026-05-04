import { Link, useParams } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { syllabus } from "@/features/preptracker/data/syllabus"
import { useTopicProgress } from "@/features/preptracker/hooks/usePrepTracker"
import type { TopicStatus } from "@/features/preptracker/types/preptracker.types"
import { PageHeader, ProgressBar, StatusBadge } from "@/features/preptracker/components/ui-helpers"
import { topicTone } from "@/features/preptracker/utils/status-styles"
import { useMemo, useState } from "react"

const statusOptions: Array<TopicStatus | "all"> = ["all", "not_started", "in_progress", "done", "needs_review"]

export function SyllabusPage() {
  const { paperId } = useParams()
  const selectedPaper = syllabus.find((paper) => paper.id === paperId)
  const topicProgress = useTopicProgress()

  return (
    <div>
      <PageHeader
        title={selectedPaper ? selectedPaper.title : "Syllabus Explorer"}
        description="Browse the study syllabus. Use Study Session when you want the guided reading flow."
        action={<Button asChild><Link to="/study">Start session</Link></Button>}
      />

      {!selectedPaper ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {syllabus.map((paper) => {
            const completion = topicProgress.getPaperCompletion(paper.id)
            return (
              <Link key={paper.id} to={`/syllabus/${paper.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/40">
                  <CardHeader>
                    <CardTitle>{paper.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{paper.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Completion</span>
                      <span>{completion}%</span>
                    </div>
                    <ProgressBar value={completion} />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <PaperDetail paperId={selectedPaper.id} />
      )}
    </div>
  )
}

function PaperDetail({ paperId }: { paperId: string }) {
  const paper = syllabus.find((item) => item.id === paperId)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TopicStatus | "all">("all")
  const topicProgress = useTopicProgress()

  const filteredModules = useMemo(() => {
    if (!paper) return []

    return paper.modules.map((module) => ({
      ...module,
      topics: module.topics.filter((topic) => {
        const haystack = `${topic.title} ${topic.tags.join(" ")}`.toLowerCase()
        const matchesQuery = haystack.includes(query.toLowerCase())
        const matchesStatus = statusFilter === "all" || topicProgress.getTopicStatus(topic.id) === statusFilter
        return matchesQuery && matchesStatus
      }),
    })).filter((module) => module.topics.length > 0)
  }, [paper, query, statusFilter, topicProgress])

  if (!paper) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search topic title or tag" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as TopicStatus | "all")}
        >
          {statusOptions.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
        </select>
      </div>

      {filteredModules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <CardTitle>{module.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {module.topics.map((topic) => {
              const status = topicProgress.getTopicStatus(topic.id)
              return (
                <div key={topic.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1fr_auto] md:items-center">
                  <button className="text-left" onClick={() => topicProgress.cycleTopicStatus(topic.id)}>
                    <p className={topic.priority === "high" ? "font-semibold" : "font-medium"}>{topic.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{topic.estimatedHours}h · {topic.tags.join(", ")}</p>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={topic.priority} tone={topic.priority === "high" ? "red" : topic.priority === "medium" ? "amber" : "gray"} />
                    <StatusBadge label={status.replace("_", " ")} tone={topicTone[status]} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
