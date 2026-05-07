import { syllabus } from '@/features/deepdive/data/syllabus'
import type { Module, Paper } from '@/features/deepdive/types/deepdive.types'

const topicGuides = import.meta.glob<string>('../content/topics/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const moduleSupplements = import.meta.glob<string>('../content/supplements/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type ModuleWithContext = Module & {
  paper: Paper
}

export const getAllModules = (): ModuleWithContext[] =>
  syllabus.flatMap((paper) => paper.modules.map((module) => ({ ...module, paper })))

export const getTopicStudyGuide = (topicId: string) =>
  topicGuides[`../content/topics/${topicId}.md`] ??
  '# Study guide missing\n\nCreate this topic guide as a markdown file in `src/features/deepdive/content/topics`.'

export const getModuleSupplement = (moduleId: string): string | null =>
  moduleSupplements[`../content/supplements/${moduleId}.md`] ?? null

export const hasModuleSupplement = (moduleId: string): boolean =>
  Boolean(moduleSupplements[`../content/supplements/${moduleId}.md`])
