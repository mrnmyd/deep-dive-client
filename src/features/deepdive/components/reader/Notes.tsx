import { useEffect, useRef, useState } from 'react'
import { useTopicNotes } from '@/features/deepdive/hooks/useDeepDive'
import { useShortcutStore } from '@/stores/shortcuts.store'

export type NotesProps = {
  topicId: string | undefined
}

export function Notes({ topicId }: NotesProps) {
  const { notes, setNote } = useTopicNotes()
  const stored = topicId ? (notes[topicId] ?? '') : ''
  const [draft, setDraft] = useState(stored)
  const [savedPulse, setSavedPulse] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const focusToken = useShortcutStore((state) => state.notesFocusToken)
  const [trackedTopicId, setTrackedTopicId] = useState(topicId)
  const [trackedFocusToken, setTrackedFocusToken] = useState(focusToken)

  if (trackedTopicId !== topicId) {
    setTrackedTopicId(topicId)
    setDraft(stored)
  }

  if (trackedFocusToken !== focusToken) {
    setTrackedFocusToken(focusToken)
  }

  useEffect(() => {
    if (focusToken === 0) return
    textareaRef.current?.focus()
  }, [focusToken])

  useEffect(() => {
    if (!topicId) return
    if (draft === (notes[topicId] ?? '')) return
    const id = window.setTimeout(() => {
      setNote(topicId, draft)
      setSavedPulse(true)
      window.setTimeout(() => setSavedPulse(false), 600)
    }, 500)
    return () => window.clearTimeout(id)
  }, [draft, topicId, notes, setNote])

  if (!topicId) {
    return <p className="text-sm text-muted-foreground">Pick a topic to start notes.</p>
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Plain-text notes for this topic..."
        className="min-h-[12rem] w-full resize-y rounded-md border border-input bg-background p-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
      />
      <p
        className={`text-[0.65rem] uppercase tracking-wide ${savedPulse ? 'text-green-500' : 'text-muted-foreground'}`}
      >
        {savedPulse ? 'Saved' : draft ? 'Auto-saves after 500 ms' : 'Empty'}
      </p>
    </div>
  )
}
