import { useEffect, useRef } from 'react'

const IDLE_EVENTS: Array<keyof WindowEventMap> = [
  'keydown',
  'mousemove',
  'scroll',
  'focus',
  'touchstart',
]

export function useIdleDetector(enabled: boolean, onIdle: () => void, idleMs = 5 * 60 * 1000) {
  const onIdleRef = useRef(onIdle)
  onIdleRef.current = onIdle

  useEffect(() => {
    if (!enabled) return

    let timer = window.setTimeout(() => onIdleRef.current(), idleMs)

    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => onIdleRef.current(), idleMs)
    }

    IDLE_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }))

    return () => {
      window.clearTimeout(timer)
      IDLE_EVENTS.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [enabled, idleMs])
}
