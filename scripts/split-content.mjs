// One-time content migration: split monolithic module markdown files into
// per-topic markdown files plus an optional per-module supplement file.
//
// Reads:
//   src/features/deepdive/data/syllabus.ts (parsed via regex for ordered topic IDs)
//   src/features/deepdive/content/modules/<moduleId>.md
//
// Writes:
//   src/features/deepdive/content/topics/<topicId>.md
//   src/features/deepdive/content/supplements/<moduleId>.md (if module had non-topic sections)
//
// Prints a mapping report so the human can spot misalignments.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const syllabusPath = path.join(repoRoot, 'src/features/deepdive/data/syllabus.ts')
const modulesDir = path.join(repoRoot, 'src/features/deepdive/content/modules')
const topicsDir = path.join(repoRoot, 'src/features/deepdive/content/topics')
const supplementsDir = path.join(repoRoot, 'src/features/deepdive/content/supplements')

const SUPPLEMENT_TITLES = [
  /^common pitfalls/i,
  /^common mistakes/i,
  /^interview answers/i,
  /^interview prep/i,
  /^closing the loop/i,
  /^a senior playbook/i,
  /^senior playbook/i,
  /^cheat sheet/i,
  /^summary/i,
  /^references/i,
]

const isSupplementHeading = (heading) => SUPPLEMENT_TITLES.some((re) => re.test(heading.trim()))

async function parseSyllabus() {
  const source = await fs.readFile(syllabusPath, 'utf8')
  const moduleRegex = /id:\s*'(module_[^']+)'[\s\S]*?topics:\s*\[([\s\S]*?)\],\s*\}/g
  const topicRegex = /topic\(\s*'(topic_[^']+)'\s*,\s*'((?:[^'\\]|\\.)*)'/g

  const result = []
  let match
  while ((match = moduleRegex.exec(source)) !== null) {
    const [, moduleId, topicsBlock] = match
    const topics = []
    let topicMatch
    while ((topicMatch = topicRegex.exec(topicsBlock)) !== null) {
      const [, id, title] = topicMatch
      topics.push({ id, title: title.replace(/\\'/g, "'") })
    }
    result.push({ moduleId, topics })
  }
  return result
}

function splitByH2(markdown) {
  const lines = markdown.split('\n')
  const sections = []
  let intro = []
  let current = null

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (current) sections.push(current)
      current = { heading: line.replace(/^##\s+/, '').trim(), bodyLines: [] }
    } else {
      if (current) current.bodyLines.push(line)
      else intro.push(line)
    }
  }
  if (current) sections.push(current)

  return {
    introText: intro.join('\n').trim(),
    sections: sections.map((s) => ({ heading: s.heading, body: s.bodyLines.join('\n').trim() })),
  }
}

function leadingToken(text) {
  return text.toLowerCase().replace(/[`*_]/g, '').split(/[:\s,]/)[0] || ''
}

function leadingPhrase(text, n = 3) {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .split(/[:,]/)[0]
    .trim()
    .split(/\s+/)
    .slice(0, n)
    .join(' ')
}

function matchSections(topics, sections) {
  // returns { byTopic: Map<topicId, sectionIndex>, supplementIndices: number[] }
  const claimed = new Set()
  const byTopic = new Map()

  // 1) skip supplement headings up front
  const supplementIndices = []
  sections.forEach((s, idx) => {
    if (isSupplementHeading(s.heading)) {
      supplementIndices.push(idx)
      claimed.add(idx)
    }
  })

  // 2) try ordered match against topic-eligible sections
  const topicEligible = sections
    .map((s, idx) => ({ s, idx }))
    .filter(({ idx }) => !claimed.has(idx))

  if (topicEligible.length === topics.length) {
    topics.forEach((topic, i) => {
      const { idx } = topicEligible[i]
      byTopic.set(topic.id, idx)
      claimed.add(idx)
    })
    return { byTopic, supplementIndices }
  }

  // 3) fuzzy: leading-phrase match (3 words) then leading-token fallback
  const remaining = sections.map((s, idx) => ({ s, idx })).filter(({ idx }) => !claimed.has(idx))

  for (const topic of topics) {
    const topicPhrase = leadingPhrase(topic.title, 3)
    const topicTok = leadingToken(topic.title)

    let best = -1
    let bestScore = -1
    for (const { s, idx } of remaining) {
      if (claimed.has(idx)) continue
      const phrase = leadingPhrase(s.heading, 3)
      const tok = leadingToken(s.heading)
      let score = 0
      if (phrase && phrase === topicPhrase) score = 3
      else if (tok && tok === topicTok) score = 2
      else if (s.heading.toLowerCase().includes(topicTok)) score = 1
      if (score > bestScore) {
        bestScore = score
        best = idx
      }
    }
    if (best !== -1 && bestScore > 0) {
      byTopic.set(topic.id, best)
      claimed.add(best)
    }
  }

  return { byTopic, supplementIndices }
}

function topicMarkdown(topic, body) {
  const heading = `# ${topic.title}`
  return `${heading}\n\n${body.trim()}\n`
}

function supplementMarkdown(introText, sections, indices, moduleHeading) {
  const parts = []
  if (moduleHeading) parts.push(`# ${moduleHeading} — supplement\n`)
  if (introText) parts.push(introText.trim())
  for (const idx of indices) {
    const s = sections[idx]
    parts.push(`## ${s.heading}\n\n${s.body.trim()}`)
  }
  return parts.filter(Boolean).join('\n\n').trim() + '\n'
}

function moduleHeadingFromMarkdown(markdown) {
  const lines = markdown.split('\n')
  for (const line of lines) {
    if (/^#\s+/.test(line)) return line.replace(/^#\s+/, '').trim()
  }
  return ''
}

async function run() {
  const modulesByMeta = await parseSyllabus()
  const report = []

  for (const { moduleId, topics } of modulesByMeta) {
    const filePath = path.join(modulesDir, `${moduleId}.md`)
    let raw
    try {
      raw = await fs.readFile(filePath, 'utf8')
    } catch {
      report.push({ moduleId, status: 'missing-source', topics: topics.map((t) => t.id) })
      continue
    }

    const moduleHeading = moduleHeadingFromMarkdown(raw)
    const stripped = raw.replace(/^#\s+.*\n+/, '')
    const { introText, sections } = splitByH2(stripped)

    const { byTopic, supplementIndices } = matchSections(topics, sections)

    const topicLines = []
    for (const topic of topics) {
      const matchIdx = byTopic.get(topic.id)
      const matchHeading = matchIdx !== undefined ? sections[matchIdx].heading : '(unmatched)'
      topicLines.push(`  ${topic.id}  ←  ${matchHeading}`)

      let body = ''
      if (matchIdx !== undefined) {
        body = sections[matchIdx].body
        // Prepend the module intro to the first topic only (so authoring context isn't lost)
        const isFirst = topics[0].id === topic.id
        if (isFirst && introText) body = `${introText.trim()}\n\n${body.trim()}`
      } else {
        body = `_Content not yet authored. See the module supplement or add notes here._`
      }

      const out = topicMarkdown(topic, body)
      await fs.writeFile(path.join(topicsDir, `${topic.id}.md`), out, 'utf8')
    }

    if (supplementIndices.length > 0) {
      const out = supplementMarkdown(
        topics.length === 0 ? introText : '',
        sections,
        supplementIndices,
        moduleHeading || moduleId
      )
      await fs.writeFile(path.join(supplementsDir, `${moduleId}.md`), out, 'utf8')
    }

    report.push({
      moduleId,
      moduleHeading,
      topicMatches: topicLines,
      supplements: supplementIndices.map((idx) => sections[idx].heading),
      unmatched: sections
        .map((s, idx) => ({ s, idx }))
        .filter(({ idx }) => {
          if (supplementIndices.includes(idx)) return false
          for (const v of byTopic.values()) if (v === idx) return false
          return true
        })
        .map(({ s }) => s.heading),
    })
  }

  // print report
  for (const entry of report) {
    console.log(`\n=== ${entry.moduleId} :: ${entry.moduleHeading} ===`)
    if (entry.status === 'missing-source') {
      console.log(`  [SOURCE FILE MISSING] topics: ${entry.topics.join(', ')}`)
      continue
    }
    console.log('  topic mappings:')
    for (const line of entry.topicMatches) console.log(line)
    if (entry.supplements.length > 0) {
      console.log('  supplements:', entry.supplements.join(' | '))
    }
    if (entry.unmatched.length > 0) {
      console.log('  *** UNMATCHED H2 (orphaned content):', entry.unmatched.join(' | '))
    }
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
