import { useCallback, useEffect, useState } from 'react'

const LIKE_DATE_STORAGE_KEY = 'site-like:last-liked-date'

export function useLikedToday() {
  const [hasLikedToday, setHasLikedToday] = useState(readLikedToday)

  useEffect(() => {
    const syncLikedToday = () => setHasLikedToday(readLikedToday())

    window.addEventListener('focus', syncLikedToday)

    return () => window.removeEventListener('focus', syncLikedToday)
  }, [])

  const markLikedToday = useCallback(() => {
    writeLikedToday()
    setHasLikedToday(true)
  }, [])

  return { hasLikedToday, markLikedToday }
}

function getTodayKey() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${today.getFullYear()}-${month}-${day}`
}

function readLikedToday() {
  try {
    return localStorage.getItem(LIKE_DATE_STORAGE_KEY) === getTodayKey()
  }
  catch {
    return false
  }
}

function writeLikedToday() {
  try {
    localStorage.setItem(LIKE_DATE_STORAGE_KEY, getTodayKey())
  }
  catch {
    // Storage failures do not prevent the like request.
  }
}
