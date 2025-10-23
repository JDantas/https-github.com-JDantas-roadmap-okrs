import { useState, useEffect, useCallback } from 'react'

const PROJECT_URL_STORAGE_KEY = 'githubRepoUrl'

/**
 * Custom hook to manage the persisted state of the imported project URL.
 * Uses localStorage for persistence across sessions.
 * @returns An object with the current projectUrl, and functions to set and clear it.
 */
export const useProjectStore = () => {
  const [projectUrl, setProjectUrlState] = useState<string | null>(() => {
    try {
      const item = window.localStorage.getItem(PROJECT_URL_STORAGE_KEY)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage', error)
      return null
    }
  })

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PROJECT_URL_STORAGE_KEY) {
        try {
          setProjectUrlState(event.newValue ? JSON.parse(event.newValue) : null)
        } catch (error) {
          console.error('Error parsing storage value', error)
          setProjectUrlState(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const setProjectUrl = useCallback((url: string | null) => {
    try {
      if (url) {
        window.localStorage.setItem(
          PROJECT_URL_STORAGE_KEY,
          JSON.stringify(url),
        )
      } else {
        window.localStorage.removeItem(PROJECT_URL_STORAGE_KEY)
      }
      setProjectUrlState(url)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: PROJECT_URL_STORAGE_KEY,
          newValue: url ? JSON.stringify(url) : null,
        }),
      )
    } catch (error) {
      console.error('Error writing to localStorage', error)
    }
  }, [])

  const clearProjectUrl = useCallback(() => {
    setProjectUrl(null)
  }, [setProjectUrl])

  return { projectUrl, setProjectUrl, clearProjectUrl }
}
