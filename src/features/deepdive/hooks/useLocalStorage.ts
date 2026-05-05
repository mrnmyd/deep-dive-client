import { useCallback, useEffect, useRef, useState } from 'react'
import { readStorage, writeStorage } from '@/features/deepdive/utils/storage'

type SetValue<T> = T | ((previous: T) => T)

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, defaultValue))
  const valueRef = useRef(value)

  useEffect(() => {
    const syncValue = () => {
      const next = readStorage(key, defaultValue)
      valueRef.current = next
      setValue(next)
    }

    window.addEventListener('storage', syncValue)
    window.addEventListener('deepdive-storage', syncValue)

    return () => {
      window.removeEventListener('storage', syncValue)
      window.removeEventListener('deepdive-storage', syncValue)
    }
  }, [defaultValue, key])

  const setStoredValue = useCallback(
    (nextValue: SetValue<T>) => {
      const previous = valueRef.current
      const resolved = nextValue instanceof Function ? nextValue(previous) : nextValue
      if (Object.is(resolved, previous)) return
      valueRef.current = resolved
      setValue(resolved)
      writeStorage(key, resolved)
    },
    [key]
  )

  return [value, setStoredValue] as const
}
