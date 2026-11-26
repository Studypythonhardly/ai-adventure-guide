import { useCallback, useEffect, useState } from 'react'

export const MISSIONS_KEY = 'ai_adventure_missions_v1'

function readAll() {
  try {
    const data = JSON.parse(localStorage.getItem(MISSIONS_KEY) || '{}')
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

export function clearAllMissions() {
  try {
    localStorage.removeItem(MISSIONS_KEY)
  } catch {
    // ignore
  }
}

/**
 * 每关的任务完成标记（持久化到 localStorage），离开页面再回来不会丢。
 * 用法：const [flags, mark] = useMissionFlags('ch1'); mark('rolled')
 */
export function useMissionFlags(chapterId) {
  const [flags, setFlags] = useState(() => {
    const saved = readAll()[chapterId]
    return saved && typeof saved === 'object' ? saved : {}
  })

  useEffect(() => {
    try {
      const all = readAll()
      all[chapterId] = flags
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }
  }, [chapterId, flags])

  const mark = useCallback((key, value = true) => {
    setFlags((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
  }, [])

  return [flags, mark]
}
