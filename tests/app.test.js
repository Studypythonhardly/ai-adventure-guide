import { describe, it, expect } from 'vitest'
import {
  LEARNING_CHAPTERS,
  TOTAL_BADGES,
  START_XP,
  MAX_XP,
  sanitizeState,
  loadState,
  saveState,
  computeXp,
  getLevel,
  getEarnedBadges,
  getProgress,
  getNextChapterId,
} from '../src/lib/progress.js'
import { softmaxWithTemperature, sampleIndex, simulateTokenize } from '../src/lib/llmDemo.js'
import { parseHash } from '../src/hooks/useHashRoute.js'
import {
  VIBE_PROJECTS,
  VIBE_THEMES,
  escapeHtml,
  safeJsonForScript,
  generateStandaloneHTML,
} from '../src/data/vibeTemplates.js'
import {
  CHAPTERS,
  LEVELS,
  NEXT_TOKEN_SCENARIOS,
  RIEMANN_TIMELINE,
  RIEMANN_CODE_SIZE,
  RIEMANN_SOURCES,
  AI_LIMITS,
  AI_OR_HUMAN_QUIZ,
  AI_HEROES,
  PROMPT_SCENARIOS,
  PROMPT_DIAGNOSIS,
  GLOSSARY_TERMS,
  SAFETY_RULES,
  GRADUATION_QUIZ,
  CHECKPOINTS,
} from '../src/data/courseData.js'
import { USE_CASES, USE_CASE_CATEGORIES } from '../src/data/useCasesData.js'

describe('progress state & XP math', () => {
  it('sanitizes malformed or tampered storage payloads', () => {
    expect(sanitizeState(null)).toEqual({ completedChapters: [], nickname: '', completedAt: {} })
    expect(sanitizeState('bad')).toEqual({ completedChapters: [], nickname: '', completedAt: {} })

    const cleaned = sanitizeState({
      completedChapters: ['ch1', 'ch1', 'home', 'bogus', 'ch3'],
      nickname: 'a'.repeat(50),
      completedAt: { ch1: '2026-11-26T00:00:00Z', bogus: '2026-11-26', ch3: 12345 },
    })
    expect(cleaned.completedChapters).toEqual(['ch1', 'ch3'])
    expect(cleaned.nickname.length).toBe(24)
    expect(cleaned.completedAt).toEqual({ ch1: '2026-11-26T00:00:00Z' })
  })

  it('round-trips loadState and saveState with mock storage', () => {
    const store = new Map()
    const mockStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
    }
    saveState({ completedChapters: ['ch1', 'ch2'], nickname: '小明', completedAt: {} }, mockStorage)
    expect(loadState(mockStorage)).toEqual({
      completedChapters: ['ch1', 'ch2'],
      nickname: '小明',
      completedAt: {},
    })
  })

  it('computes XP, levels, badges, progress, and next chapter accurately', () => {
    expect(computeXp([])).toBe(START_XP)
    const allIds = LEARNING_CHAPTERS.map((c) => c.id)
    expect(computeXp(allIds)).toBe(MAX_XP)

    // Completing all chapters must reach the highest level title
    const topLevel = LEVELS[LEVELS.length - 1]
    expect(MAX_XP).toBeGreaterThanOrEqual(topLevel.minXp)
    expect(getLevel(MAX_XP).title).toBe(topLevel.title)
    expect(getLevel(MAX_XP).next).toBeNull()
    expect(getLevel(0).next).not.toBeNull()

    expect(getEarnedBadges(allIds)).toHaveLength(TOTAL_BADGES)
    expect(getProgress(['ch1', 'ch2', 'ch3'])).toEqual({
      done: 3,
      total: LEARNING_CHAPTERS.length,
      pct: Math.round((3 / LEARNING_CHAPTERS.length) * 100),
    })

    expect(getNextChapterId('ch1')).toBe('ch2')
    expect(getNextChapterId('ch6')).toBeNull()
    expect(getNextChapterId('home')).toBeNull()
  })
})

describe('LLM educational demo math', () => {
  it('softmaxWithTemperature sums to 100% and sharpens at low temperature', () => {
    const scores = [4.2, 3.6, 2.1, -0.3]
    const low = softmaxWithTemperature(scores, 0.1)
    const high = softmaxWithTemperature(scores, 1.8)

    expect(low.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5)
    expect(high.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5)
    expect(low[0]).toBeGreaterThan(high[0])
    expect(high[3]).toBeGreaterThan(low[3])
  })

  it('handles extreme scores without NaN overflow', () => {
    const probs = softmaxWithTemperature([1000, 999, 998], 0.1)
    expect(probs.every((p) => Number.isFinite(p))).toBe(true)
    expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5)
  })

  it('samples indices deterministically with injected rng and tokenizes mixed text', () => {
    expect(sampleIndex([20, 30, 50], () => 0.05)).toBe(0)
    expect(sampleIndex([20, 30, 50], () => 0.35)).toBe(1)
    expect(sampleIndex([20, 30, 50], () => 0.95)).toBe(2)

    expect(simulateTokenize('')).toEqual([])
    expect(simulateTokenize('你好 AI 2026!')).toEqual(['你好', 'AI', '2026', '!'])
  })
})

describe('hash routing parser', () => {
  const valid = ['home', 'ch1', 'ch2', 'cases']
  it('resolves valid hashes and falls back cleanly on unknown hashes', () => {
    expect(parseHash('', valid)).toBe('home')
    expect(parseHash('#/ch1', valid)).toBe('ch1')
    expect(parseHash('#ch2', valid)).toBe('ch2')
    expect(parseHash('#/cases?tab=work', valid)).toBe('cases')
    expect(parseHash('#/unknown', valid)).toBe('home')
  })
})

describe('standalone HTML generator & XSS defenses', () => {
  it('escapes HTML entities and prevents </script> breakout', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
    )
    const encoded = safeJsonForScript(['正常菜', '</script><script>alert(1)</script>'])
    expect(encoded).not.toContain('</script>')
    expect(JSON.parse(encoded)).toEqual(['正常菜', '</script><script>alert(1)</script>'])
  })

  it('generates valid self-contained HTML for all projects without raw script breakouts', () => {
    const hostileCfg = {
      title: '测试</title><script>alert(1)</script>',
      items: ['牛肉面', '</script><img src=x onerror=alert(1)>'],
      minutes: 25,
      sender: '<b>小红</b>',
      message: '你好</script>',
      confetti: true,
      themeName: '星空紫蓝',
    }
    for (const p of VIBE_PROJECTS) {
      for (const theme of VIBE_THEMES) {
        const html = generateStandaloneHTML(p.id, hostileCfg, theme)
        expect(html.startsWith('<!doctype html>')).toBe(true)
        // Must contain exactly ONE closing </script> tag (the template's own script)
        const scriptClosings = html.match(/<\/script>/gi) || []
        expect(scriptClosings).toHaveLength(1)
        expect(html).not.toContain('<script>alert(1)</script>')
      }
    }
  })
})

describe('curriculum & use-case dataset integrity', () => {
  it('has unique chapter IDs and valid checkpoints', () => {
    const ids = CHAPTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const key of ['ch1', 'ch2', 'ch3']) {
      const cp = CHECKPOINTS[key]
      expect(cp).toBeDefined()
      expect(cp.options[cp.correct]).toBeTruthy()
    }
  })

  it('has internally consistent Riemann numbers, quizzes, glossary, and use cases', () => {
    expect(NEXT_TOKEN_SCENARIOS.length).toBeGreaterThanOrEqual(3)
    expect(RIEMANN_TIMELINE).toHaveLength(4)
    expect(RIEMANN_CODE_SIZE.compact).toBeLessThan(RIEMANN_CODE_SIZE.readable)
    expect(RIEMANN_CODE_SIZE.readable).toBeLessThan(RIEMANN_CODE_SIZE.original)
    expect(RIEMANN_SOURCES.every((s) => s.url.startsWith('https://'))).toBe(true)
    expect(AI_LIMITS.length).toBeGreaterThanOrEqual(4)
    expect(AI_HEROES.length).toBeGreaterThanOrEqual(9)
    expect(PROMPT_SCENARIOS.length).toBeGreaterThanOrEqual(3)

    for (const q of AI_OR_HUMAN_QUIZ) {
      expect(q.options.some((o) => o.value === q.answer)).toBe(true)
    }
    for (const d of PROMPT_DIAGNOSIS) {
      expect(d.options).toContain(d.answer)
    }
    for (const g of GRADUATION_QUIZ) {
      expect(g.options[g.correct]).toBeTruthy()
    }
    for (const term of GLOSSARY_TERMS) {
      expect(term.audiences.kid5).toBeTruthy()
      expect(term.audiences.beginner).toBeTruthy()
      expect(term.audiences.worker).toBeTruthy()
    }
    expect(SAFETY_RULES.length).toBeGreaterThanOrEqual(5)

    const validCats = new Set(USE_CASE_CATEGORIES.map((c) => c.id))
    const caseIds = new Set()
    for (const c of USE_CASES) {
      expect(caseIds.has(c.id)).toBe(false)
      caseIds.add(c.id)
      expect(validCats.has(c.category)).toBe(true)
      expect(c.prompt.length).toBeGreaterThan(20)
    }
  })
})
