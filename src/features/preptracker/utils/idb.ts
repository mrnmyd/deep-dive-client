const DB_NAME = 'preptracker'
const DB_VERSION = 1
const STORE_NAME = 'fs-handles'
const HANDLE_KEY = 'backup-dir'

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const withStore = async <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T> | T
): Promise<T> => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    const result = fn(store)
    transaction.oncomplete = () => Promise.resolve(result).then(resolve, reject)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

const promisifyRequest = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

export const saveBackupHandle = async (handle: FileSystemDirectoryHandle): Promise<void> => {
  await withStore('readwrite', (store) => promisifyRequest(store.put(handle, HANDLE_KEY)))
}

export const loadBackupHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const result = await withStore('readonly', (store) => promisifyRequest(store.get(HANDLE_KEY)))
    return (result as FileSystemDirectoryHandle | undefined) ?? null
  } catch {
    return null
  }
}

export const clearBackupHandle = async (): Promise<void> => {
  await withStore('readwrite', (store) => promisifyRequest(store.delete(HANDLE_KEY)))
}
