// 闯关进度相关的纯函数（无副作用，便于单元测试）
import { CHAPTERS, LEVELS } from '../data/courseData'

export const STORAGE_KEY = 'ai_adventure_guide_v1'

export const LEARNING_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'home')
export const TOTAL_BADGES = LEARNING_CHAPTERS.filter((c) => c.badge).length
export const START_XP = CHAPTERS.find((c) => c.id === 'home')?.xp ?? 0
export const MAX_XP = LEARNING_CHAPTERS.reduce((sum, c) => sum + c.xp, START_XP)

const DEFAULT_STATE = { completedChapters: [], nickname: '', completedAt: {} }

const VALID_IDS = new Set(LEARNING_CHAPTERS.map((c) => c.id))

/** 把任意（可能被篡改/旧版本的）存储数据清洗成合法状态 */
export function sanitizeState(raw) {
  const data = raw && typeof raw === 'object' ? raw : {}
  const completed = Array.isArray(data.completedChapters)
    ? [...new Set(data.completedChapters.filter((id) => VALID_IDS.has(id)))]
    : []
  const completedAt = {}
  if (data.completedAt && typeof data.completedAt === 'object') {
    for (const id of completed) {
      if (typeof data.completedAt[id] === 'string') completedAt[id] = data.completedAt[id]
    }
  }
  const nickname = typeof data.nickname === 'string' ? data.nickname.slice(0, 24) : ''
  return { completedChapters: completed, nickname, completedAt }
}

export function loadState(storage = globalThis.localStorage) {
  try {
    return sanitizeState(JSON.parse(storage?.getItem(STORAGE_KEY) || '{}'))
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)))
  } catch {
    // 隐私模式或存储已满时静默失败，不影响使用
  }
}

export function computeXp(completedChapters) {
  return LEARNING_CHAPTERS.reduce(
    (sum, ch) => (completedChapters.includes(ch.id) ? sum + ch.xp : sum),
    START_XP
  )
}

export function getLevel(xp) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl
  }
  const idx = LEVELS.indexOf(current)
  const next = LEVELS[idx + 1] || null
  return { ...current, next }
}

export function getEarnedBadges(completedChapters) {
  return LEARNING_CHAPTERS.filter((ch) => ch.badge && completedChapters.includes(ch.id)).map(
    (ch) => ch.badge
  )
}

export function getProgress(completedChapters) {
  const done = LEARNING_CHAPTERS.filter((c) => completedChapters.includes(c.id)).length
  return {
    done,
    total: LEARNING_CHAPTERS.length,
    pct: Math.round((done / LEARNING_CHAPTERS.length) * 100),
  }
}

export function getChapter(id) {
  return CHAPTERS.find((c) => c.id === id) || null
}

/** 返回下一关的 id；最后一关返回 null */
export function getNextChapterId(id) {
  const idx = LEARNING_CHAPTERS.findIndex((c) => c.id === id)
  if (idx === -1 || idx === LEARNING_CHAPTERS.length - 1) return null
  return LEARNING_CHAPTERS[idx + 1].id
}
