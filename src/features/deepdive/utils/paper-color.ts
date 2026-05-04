import type { PaperColor } from '@/features/deepdive/types/deepdive.types'

type PaperColorTokens = {
  badge: string
  bar: string
  ring: string
  accent: string
  hex: string
}

export const paperColorTokens: Record<PaperColor, PaperColorTokens> = {
  purple: {
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
    bar: 'bg-purple-500 dark:bg-purple-400',
    ring: 'ring-purple-500',
    accent: 'border-l-purple-500',
    hex: '#7C3AED',
  },
  teal: {
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200',
    bar: 'bg-teal-500 dark:bg-teal-400',
    ring: 'ring-teal-500',
    accent: 'border-l-teal-500',
    hex: '#0D9488',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
    bar: 'bg-blue-500 dark:bg-blue-400',
    ring: 'ring-blue-500',
    accent: 'border-l-blue-500',
    hex: '#2563EB',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    bar: 'bg-amber-500 dark:bg-amber-400',
    ring: 'ring-amber-500',
    accent: 'border-l-amber-500',
    hex: '#D97706',
  },
  gray: {
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    bar: 'bg-gray-500 dark:bg-gray-400',
    ring: 'ring-gray-500',
    accent: 'border-l-gray-500',
    hex: '#6B7280',
  },
}

export const tokensForPaperColor = (color: PaperColor): PaperColorTokens => paperColorTokens[color]
