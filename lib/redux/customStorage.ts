import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

interface StorageInterface {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<string>
  removeItem(key: string): Promise<void>
}

const createNoopStorage = (): StorageInterface => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(key: string) {
      return Promise.resolve(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(key: string, value: string) {
      return Promise.resolve(value)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem(key: string) {
      return Promise.resolve()
    }
  }
}

const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage()

export default storage
