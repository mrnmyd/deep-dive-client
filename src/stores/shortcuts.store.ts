import { create } from 'zustand'

export type ShortcutBinding = {
  keys: string
  description: string
  category?: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
}

type ShortcutState = {
  groups: Record<string, ShortcutBinding[]>
  helpOpen: boolean
  paletteOpen: boolean
  notesOpen: boolean
  searchFocusToken: number
  notesFocusToken: number
  setGroup: (id: string, bindings: ShortcutBinding[]) => void
  clearGroup: (id: string) => void
  toggleHelp: (open?: boolean) => void
  togglePalette: (open?: boolean) => void
  toggleNotes: (open?: boolean) => void
  triggerSearchFocus: () => void
  triggerNotesFocus: () => void
}

export const useShortcutStore = create<ShortcutState>((set) => ({
  groups: {},
  helpOpen: false,
  paletteOpen: false,
  notesOpen: false,
  searchFocusToken: 0,
  notesFocusToken: 0,
  setGroup: (id, bindings) => set((state) => ({ groups: { ...state.groups, [id]: bindings } })),
  clearGroup: (id) =>
    set((state) => {
      if (!(id in state.groups)) return state
      const next = { ...state.groups }
      delete next[id]
      return { groups: next }
    }),
  toggleHelp: (open) => set((state) => ({ helpOpen: open ?? !state.helpOpen })),
  togglePalette: (open) => set((state) => ({ paletteOpen: open ?? !state.paletteOpen })),
  toggleNotes: (open) => set((state) => ({ notesOpen: open ?? !state.notesOpen })),
  triggerSearchFocus: () => set((state) => ({ searchFocusToken: state.searchFocusToken + 1 })),
  triggerNotesFocus: () => set((state) => ({ notesFocusToken: state.notesFocusToken + 1 })),
}))

export const flattenShortcuts = (groups: Record<string, ShortcutBinding[]>): ShortcutBinding[] =>
  Object.values(groups).flat()
