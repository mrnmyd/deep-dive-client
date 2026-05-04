import { syllabus } from "@/features/preptracker/data/syllabus"
import type { Module, Paper, Topic } from "@/features/preptracker/types/preptracker.types"

export type ModuleWithContext = Module & {
  paper: Paper
}

export const getAllModules = (): ModuleWithContext[] =>
  syllabus.flatMap((paper) => paper.modules.map((module) => ({ ...module, paper })))

export const getTopicStudyContent = (topic: Topic, module: ModuleWithContext) => {
  const tags = topic.tags.join(", ")

  return {
    objective: `Study ${topic.title} well enough to explain the core idea, tradeoffs, common failure modes, and one practical implementation path in a senior interview.`,
    essentials: [
      `Place it in context: this belongs to ${module.paper.title}, inside ${module.title}.`,
      `Build a precise mental model for ${topic.title}; avoid memorising isolated definitions.`,
      `Connect it with related interview tags: ${tags}.`,
      `Prepare one concrete example where you can walk through inputs, outputs, constraints, and complexity.`,
    ],
    checkpoints: [
      "Can you explain the problem this topic solves without using jargon first?",
      "Can you describe the happy path and the edge cases?",
      "Can you compare it with at least one alternative approach?",
      "Can you state complexity, operational cost, or runtime tradeoffs where relevant?",
      "Can you implement or sketch the concept from memory?",
    ],
    practice: [
      `Write a short interview answer for ${topic.title}.`,
      "Create a tiny example and trace it step by step.",
      "List three mistakes candidates commonly make on this topic.",
      "Explain when you would not use this approach.",
    ],
  }
}
