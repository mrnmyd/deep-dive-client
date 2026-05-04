import { syllabus } from "@/features/preptracker/data/syllabus"
import type { Module, Paper } from "@/features/preptracker/types/preptracker.types"

const moduleGuides = import.meta.glob<string>("../content/modules/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

export type ModuleWithContext = Module & {
  paper: Paper
}

export const getAllModules = (): ModuleWithContext[] =>
  syllabus.flatMap((paper) => paper.modules.map((module) => ({ ...module, paper })))

export const getModuleStudyGuide = (moduleId: string) =>
  moduleGuides[`../content/modules/${moduleId}.md`] ?? "# Study guide missing\n\nCreate this module guide as a markdown file in `src/features/preptracker/content/modules`."
