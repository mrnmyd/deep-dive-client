import { useCallback, useEffect, useState } from "react"
import { readStorage, writeStorage } from "@/features/preptracker/utils/storage"

type SetValue<T> = T | ((previous: T) => T)

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, defaultValue))

  useEffect(() => {
    const syncValue = () => setValue(readStorage(key, defaultValue))

    window.addEventListener("storage", syncValue)
    window.addEventListener("preptracker-storage", syncValue)

    return () => {
      window.removeEventListener("storage", syncValue)
      window.removeEventListener("preptracker-storage", syncValue)
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
