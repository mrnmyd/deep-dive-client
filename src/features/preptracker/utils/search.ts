import Fuse from 'fuse.js'
import { syllabus } from '@/features/preptracker/data/syllabus'
import type { PaperColor } from '@/features/preptracker/types/preptracker.types'
import { allTopics } from '@/features/preptracker/utils/progress'

export type SearchRecord = {
  topicId: string
  title: string
  tags: string
  paperId: string
  paperTitle: string
  paperColor: PaperColor
  moduleTitle: string
  priority: 'high' | 'medium' | 'low'
}

const records: SearchRecord[] = allTopics.map((topic) => {
  const paper = syllabus.find((entry) => entry.id === topic.paperId)
  return {
    topicId: topic.id,
    title: topic.title,
    tags: topic.tags.join(' '),
    paperId: topic.paperId,
    paperTitle: topic.paperTitle,
    paperColor: paper?.color ?? 'gray',
    moduleTitle: topic.moduleTitle,
    priority: topic.priority,
  }
})

const fuse = new Fuse(records, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'tags', weight: 0.2 },
    { name: 'moduleTitle', weight: 0.1 },
    { name: 'paperTitle', weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: false,
})

export const allSearchRecords = (): SearchRecord[] => records

export const searchTopics = (query: string, limit = 30): SearchRecord[] => {
  const trimmed = query.trim()
  if (!trimmed) return records.slice(0, limit)
  return fuse.search(trimmed, { limit }).map((result) => result.item)
}
