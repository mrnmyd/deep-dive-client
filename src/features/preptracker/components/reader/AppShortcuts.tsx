import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constant'
import { CommandPalette } from '@/features/preptracker/components/reader/CommandPalette'
import { KeyboardHelpOverlay } from '@/features/preptracker/components/reader/KeyboardHelpOverlay'
import {
  useShortcuts,
  eventMatchesStep,
  isEditableTarget,
  parseShortcut,
} from '@/features/preptracker/hooks/useShortcuts'
import { flattenShortcuts, useShortcutStore, type ShortcutBinding } from '@/stores/shortcuts.store'

const CHORD_TIMEOUT_MS = 700

export function AppShortcuts() {
  const navigate = useNavigate()
  const togglePalette = useShortcutStore((state) => state.togglePalette)
  const toggleHelp = useShortcutStore((state) => state.toggleHelp)
  const triggerSearchFocus = useShortcutStore((state) => state.triggerSearchFocus)

  const globalBindings: ShortcutBinding[] = useMemo(
    () => [
      {
        keys: '?',
        description: 'Show keyboard shortcuts',
        category: 'General',
        handler: () => toggleHelp(true),
      },
      {
        keys: 'Mod+k',
        description: 'Open command palette',
        category: 'General',
        handler: () => togglePalette(true),
        preventDefault: true,
      },
      {
        keys: '/',
        description: 'Focus search',
        category: 'General',
        handler: () => triggerSearchFocus(),
        preventDefault: true,
      },
      {
        keys: 'g h',
        description: 'Go to Reader',
        category: 'Navigate',
        handler: () => navigate(ROUTES.READER),
      },
      {
        keys: 'g d',
        description: 'Go to Dashboard',
        category: 'Navigate',
        handler: () => navigate(ROUTES.DASHBOARD),
      },
      {
        keys: 'g p',
        description: 'Go to Problems',
        category: 'Navigate',
        handler: () => navigate(ROUTES.PROBLEMS),
      },
      {
        keys: 'g r',
        description: 'Go to Progress',
        category: 'Navigate',
        handler: () => navigate(ROUTES.PROGRESS),
      },
      {
        keys: 'g s',
        description: 'Go to Settings',
        category: 'Navigate',
        handler: () => navigate(ROUTES.SETTINGS),
      },
    ],
    [navigate, toggleHelp, togglePalette, triggerSearchFocus]
  )

  useShortcuts('app-global', globalBindings)

  const chordPrefix = useRef<string | null>(null)
  const chordTimer = useRef<number | null>(null)

  useEffect(() => {
    const clearChord = () => {
      chordPrefix.current = null
      if (chordTimer.current !== null) {
        window.clearTimeout(chordTimer.current)
        chordTimer.current = null
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearChord()
        return
      }

      const editable = isEditableTarget(event.target)
      const groups = useShortcutStore.getState().groups
      const bindings = flattenShortcuts(groups)

      const candidate = (binding: ShortcutBinding, depth: 0 | 1) => {
        const steps = parseShortcut(binding.keys)
        const step = steps[depth]
        if (!step) return null
        if (!eventMatchesStep(event, step)) return null
        return { binding, steps }
      }

      if (chordPrefix.current) {
        const prefix = chordPrefix.current
        const match = bindings
          .filter((binding) => binding.keys.startsWith(`${prefix} `))
          .map((binding) => candidate(binding, 1))
          .find(
            (
              entry
            ): entry is { binding: ShortcutBinding; steps: ReturnType<typeof parseShortcut> } =>
              Boolean(entry)
          )
        clearChord()
        if (match) {
          if (match.binding.preventDefault) event.preventDefault()
          match.binding.handler(event)
          return
        }
      }

      if (editable) {
        if (event.key === 'Escape') {
          ;(event.target as HTMLElement).blur()
        }
        return
      }

      const directMatches = bindings
        .filter((binding) => !binding.keys.includes(' '))
        .map((binding) => candidate(binding, 0))
        .filter(
          (entry): entry is { binding: ShortcutBinding; steps: ReturnType<typeof parseShortcut> } =>
            Boolean(entry)
        )

      if (directMatches.length > 0) {
        const direct = directMatches[0]
        if (direct.binding.preventDefault) event.preventDefault()
        direct.binding.handler(event)
        return
      }

      const chordCandidates = bindings.filter((binding) => binding.keys.includes(' '))
      const chordPrefixMatch = chordCandidates.find((binding) => {
        const steps = parseShortcut(binding.keys)
        return steps[0] && eventMatchesStep(event, steps[0])
      })

      if (chordPrefixMatch) {
        const prefix = chordPrefixMatch.keys.split(' ')[0]
        chordPrefix.current = prefix
        chordTimer.current = window.setTimeout(clearChord, CHORD_TIMEOUT_MS)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearChord()
    }
  }, [])

  return (
    <>
      <CommandPalette />
      <KeyboardHelpOverlay />
    </>
  )
}
