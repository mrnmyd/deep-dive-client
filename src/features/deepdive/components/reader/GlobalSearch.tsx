import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ROUTES } from '@/constants/routes.constant'
import { useSettings } from '@/features/deepdive/hooks/useDeepDive'
import { searchTopics } from '@/features/deepdive/utils/search'
import { paperColorTokens } from '@/features/deepdive/utils/paper-color'
import { useShortcutStore } from '@/stores/shortcuts.store'
import { cn } from '@/lib/utils'

export function GlobalSearch() {
  const navigate = useNavigate()
  const { updateSetting } = useSettings()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const focusToken = useShortcutStore((state) => state.searchFocusToken)
  const [trackedFocusToken, setTrackedFocusToken] = useState(focusToken)

  if (trackedFocusToken !== focusToken) {
    setTrackedFocusToken(focusToken)
    if (focusToken > 0) setOpen(true)
  }

  useEffect(() => {
    if (focusToken === 0) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [focusToken])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchTopics(query, 8)
  }, [query])

  const resultsKey = results.map((record) => record.topicId).join(',')
  const [trackedResultsKey, setTrackedResultsKey] = useState(resultsKey)
  if (trackedResultsKey !== resultsKey) {
    setTrackedResultsKey(resultsKey)
    setActiveIndex(0)
  }

  const jumpTo = (topicId: string) => {
    navigate(`${ROUTES.READER}?topic=${topicId}`)
    updateSetting('lastReadTopicId', topicId)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const target = results[activeIndex]
      if (target) jumpTo(target.topicId)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search topics — press / to focus"
        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-md border bg-popover shadow-lg">
          <ul>
            {results.map((record, index) => {
              const tokens = paperColorTokens[record.paperColor]
              const active = index === activeIndex
              return (
                <li key={record.topicId}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => jumpTo(record.topicId)}
                    className={cn(
                      'flex w-full items-start gap-3 border-l-2 px-3 py-2 text-left transition-colors',
                      tokens.accent,
                      active && 'bg-muted'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{record.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {record.paperTitle} · {record.moduleTitle}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
