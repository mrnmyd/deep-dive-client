import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useProblemTracker } from "@/features/preptracker/hooks/usePrepTracker"
import type { ProblemStatus } from "@/features/preptracker/types/preptracker.types"
import { PageHeader, ProgressBar, StatusBadge } from "@/features/preptracker/components/ui-helpers"
import { problemTone } from "@/features/preptracker/utils/status-styles"
import { useMemo, useState } from "react"

const statusOptions: Array<ProblemStatus | "all"> = ["all", "unsolved", "attempted", "solved", "needs_retry"]

export function ProblemsPage() {
  const tracker = useProblemTracker()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ProblemStatus | "all">("all")
  const [difficulty, setDifficulty] = useState("all")
  const [week, setWeek] = useState("all")

  const filteredProblems = useMemo(() => tracker.problems.filter((problem) => {
    const problemStatus = tracker.getProblemStatus(problem.id)
    const haystack = `${problem.title} ${problem.pattern}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
      && (status === "all" || problemStatus === status)
      && (difficulty === "all" || problem.difficulty === difficulty)
      && (week === "all" || String(problem.week) === week)
  }), [difficulty, query, status, tracker, week])

  return (
    <div>
      <PageHeader title="DSA Problem Tracker" description="Track solve status, patterns, weekly coverage, and spaced repetition signals." />

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {tracker.getPatternStats().slice(0, 8).map((stat) => (
          <Card key={stat.pattern} size="sm">
            <CardContent>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{stat.pattern}</span>
                <span className="text-muted-foreground">{stat.solved}/{stat.total}</span>
              </div>
              <ProgressBar value={(stat.solved / stat.total) * 100} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_160px_160px_140px]">
            <Input placeholder="Search title or pattern" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as ProblemStatus | "all")}>
              {statusOptions.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}
            </select>
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm" value={week} onChange={(event) => setWeek(event.target.value)}>
              <option value="all">All weeks</option>
              <option value="1">Week 1</option>
              <option value="2">Week 2</option>
              <option value="3">Week 3</option>
              <option value="4">Week 4</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Difficulty</th>
                  <th className="py-3 pr-4 font-medium">Pattern</th>
                  <th className="py-3 pr-4 font-medium">Week</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Solve Count</th>
                  <th className="py-3 pr-4 font-medium">Last Solved</th>
                  <th className="py-3 pr-4 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem) => {
                  const problemStatus = tracker.getProblemStatus(problem.id)
                  const progress = tracker.progress[problem.id]
                  return (
                    <tr key={problem.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{problem.title}</td>
                      <td className="py-3 pr-4">{problem.difficulty}</td>
                      <td className="py-3 pr-4">{problem.pattern}</td>
                      <td className="py-3 pr-4">Week {problem.week}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => tracker.cycleProblemStatus(problem.id)}>
                          <StatusBadge label={problemStatus.replace("_", " ")} tone={problemTone[problemStatus]} />
                        </button>
                      </td>
                      <td className="py-3 pr-4">{progress?.solveCount ?? 0}{(progress?.solveCount ?? 0) >= 2 ? " ✓" : ""}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{progress?.lastSolved ? new Date(progress.lastSolved).toLocaleDateString() : "—"}</td>
                      <td className="py-3 pr-4">
                        <Button variant="outline" size="sm" asChild>
                          <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </a>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
