import { useEffect } from 'react'
import { useShortcutStore, type ShortcutBinding } from '@/stores/shortcuts.store'

export function useShortcuts(id: string, bindings: ShortcutBinding[]) {
  useEffect(() => {
    useShortcutStore.getState().setGroup(id, bindings)
    return () => {
      useShortcutStore.getState().clearGroup(id)
    }
  }, [id, bindings])
}

type ParsedStep = {
  key: string
  shift: boolean
  mod: boolean
  alt: boolean
}

const parseStep = (raw: string): ParsedStep => {
  const tokens = raw.split('+').map((token) => token.trim())
  const key = tokens.pop() ?? ''
  const mods = new Set(tokens.map((token) => token.toLowerCase()))
  return {
    key,
    shift: mods.has('shift'),
    mod: mods.has('mod') || mods.has('cmd') || mods.has('ctrl'),
    alt: mods.has('alt'),
  }
}

export const parseShortcut = (raw: string): ParsedStep[] =>
  raw.split(' ').filter(Boolean).map(parseStep)

const isPrintableKey = (key: string) => key.length === 1

export const eventMatchesStep = (event: KeyboardEvent, step: ParsedStep): boolean => {
  if (step.mod && !(event.metaKey || event.ctrlKey)) return false
  if (!step.mod && (event.metaKey || event.ctrlKey)) return false
  if (step.alt !== event.altKey) return false

  if (isPrintableKey(step.key)) {
    if (event.key !== step.key && event.key.toLowerCase() !== step.key.toLowerCase()) return false
    if (step.shift && !event.shiftKey) return false
    return true
  }

  if (event.key !== step.key) return false
  if (step.shift !== event.shiftKey) return false
  return true
}

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}
