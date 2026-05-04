import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/features/deepdive/utils/storage'

type SetValue<T> = T | ((previous: T) => T)

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, defaultValue))

  useEffect(() => {
    const syncValue = () => setValue(readStorage(key, defaultValue))

    window.addEventListener('storage', syncValue)
    window.addEventListener('deepdive-storage', syncValue)

    return () => {
      window.removeEventListener('storage', syncValue)
      window.removeEventListener('deepdive-storage', syncValue)
    }
  }, [defaultValue, key])

  const setStoredValue = useCallback(
    (nextValue: SetValue<T>) => {
      setValue((previous) => {
        const resolved = nextValue instanceof Function ? nextValue(previous) : nextValue
        writeStorage(key, resolved)
        return resolved
      })
    },
    [key]
  )

  return [value, setStoredValue] as const
}
