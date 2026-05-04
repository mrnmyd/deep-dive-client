import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useShortcutStore, type ShortcutBinding } from '@/stores/shortcuts.store'

const renderKey = (chord: string) =>
  chord.split(' ').map((step, stepIndex) => (
    <span key={`${chord}-${step}-${stepIndex}`} className="inline-flex items-center gap-1">
      {step.split('+').map((token) => (
        <kbd
          key={`${chord}-${step}-${token}`}
          className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-wide"
        >
          {token === 'Mod' ? '⌘' : token}
        </kbd>
      ))}
      {stepIndex === 0 && chord.split(' ').length > 1 && (
        <span className="text-xs text-muted-foreground">then</span>
      )}
    </span>
  ))

export function KeyboardHelpOverlay() {
  const helpOpen = useShortcutStore((state) => state.helpOpen)
  const toggleHelp = useShortcutStore((state) => state.toggleHelp)
  const groups = useShortcutStore((state) => state.groups)

  const grouped = useMemo(() => {
    const flat: ShortcutBinding[] = Object.values(groups).flat()
    const map = new Map<string, ShortcutBinding[]>()
    flat.forEach((binding) => {
      const key = binding.category ?? 'Other'
      const existing = map.get(key) ?? []
      existing.push(binding)
      map.set(key, existing)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [groups])

  return (
    <Dialog open={helpOpen} onOpenChange={(value) => toggleHelp(value)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Press{' '}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">Esc</kbd>{' '}
            to close.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 sm:grid-cols-2">
          {grouped.map(([category, bindings]) => (
            <section key={category}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category}
              </h3>
              <ul className="space-y-1.5">
                {bindings.map((binding) => (
                  <li
                    key={`${category}-${binding.keys}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-muted-foreground">{binding.description}</span>
                    <span className="flex items-center gap-1">{renderKey(binding.keys)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
