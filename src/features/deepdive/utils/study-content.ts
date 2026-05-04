import { syllabus } from '@/features/deepdive/data/syllabus'
import type { Module, Paper } from '@/features/deepdive/types/deepdive.types'

const moduleGuides = import.meta.glob<string>('../content/modules/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type ModuleWithContext = Module & {
  paper: Paper
}

export const getAllModules = (): ModuleWithContext[] =>
  syllabus.flatMap((paper) => paper.modules.map((module) => ({ ...module, paper })))

export const getModuleStudyGuide = (moduleId: string) =>
  moduleGuides[`../content/modules/${moduleId}.md`] ??
  '# Study guide missing\n\nCreate this module guide as a markdown file in `src/features/deepdive/content/modules`.'
