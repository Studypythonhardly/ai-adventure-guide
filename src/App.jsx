import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CHAPTERS } from './data/courseData'
import { USE_CASES } from './data/useCasesData'
import { HomeView } from './chapters/HomeView'
import {
  computeXp,
  getChapter,
  getEarnedBadges,
  getLevel,
  getNextChapterId,
  getProgress,
  loadState,
  saveState,
  TOTAL_BADGES,
} from './lib/progress'
import { celebrate } from './lib/browser'
import { useHashRoute } from './hooks/useHashRoute'
import { clearAllMissions } from './hooks/useMissionFlags'
import {
  CheckCircle2,
  Menu,
  X,
  RotateCcw,
  Award,
  ArrowUp,
  Compass,
  Cpu,
  Trophy,
  Layers,
  Wand2,
  LayoutGrid,
  GraduationCap,
  Briefcase,
} from 'lucide-react'

const Chapter1Brain = lazy(() => import('./chapters/Chapter1Brain'))
const Chapter2Breakthroughs = lazy(() => import('./chapters/Chapter2Breakthroughs'))
const Chapter3Heroes = lazy(() => import('./chapters/Chapter3Heroes'))
const Chapter4Prompt = lazy(() => import('./chapters/Chapter4Prompt'))
const Chapter5Maker = lazy(() => import('./chapters/Chapter5Maker'))
const Chapter6Glossary = lazy(() => import('./chapters/Chapter6Glossary'))
const UseCaseLibrary = lazy(() => import('./chapters/UseCaseLibrary'))

const CHAPTER_COMPONENTS = {
  ch1: Chapter1Brain,
  ch2: Chapter2Breakthroughs,
  ch3: Chapter3Heroes,
  ch4: Chapter4Prompt,
  ch5: Chapter5Maker,
  ch6: Chapter6Glossary,
}

const NAV_ICONS = {
  home: Compass,
  ch1: Cpu,
  ch2: Trophy,
  ch3: Layers,
  ch4: Wand2,
  ch5: LayoutGrid,
  ch6: GraduationCap,
}

const ROUTE_IDS = [...CHAPTERS.map((c) => c.id), 'cases']

function PageLoading() {
  return (
    <div className="card-playful p-10 text-center space-y-2" role="status" aria-live="polite">
      <p className="text-sm font-medium text-[#52525B]">正在加载章节内容...</p>
    </div>
  )
}

export default function App() {
  const [activeId, navigate] = useHashRoute(ROUTE_IDS, 'home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [progressState, setProgressState] = useState(loadState)
  const [toast, setToast] = useState(null)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const toastTimer = useRef(null)
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)

  const { completedChapters, completedAt, nickname } = progressState

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    saveState(progressState)
  }, [progressState])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const xp = useMemo(() => computeXp(completedChapters), [completedChapters])
  const levelInfo = useMemo(() => getLevel(xp), [xp])
  const earnedBadges = useMemo(() => getEarnedBadges(completedChapters), [completedChapters])
  const progress = getProgress(completedChapters)

  useEffect(() => {
    const ch = activeId === 'cases' ? { title: 'AI 实战案例库' } : getChapter(activeId)
    document.title =
      activeId === 'home' ? 'AI 奇妙漫游指南 · 从 0 开始玩转 AI' : `${ch?.title} · AI 奇妙漫游指南`
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [activeId])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  const handleNavigate = useCallback(
    (id) => {
      navigate(id)
      setMobileMenuOpen(false)
    },
    [navigate]
  )

  const showToast = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const handleComplete = (chapterId) => {
    if (completedChapters.includes(chapterId)) return
    const ch = getChapter(chapterId)
    setProgressState((prev) => ({
      ...prev,
      completedChapters: [...prev.completedChapters, chapterId],
      completedAt: { ...prev.completedAt, [chapterId]: new Date().toISOString() },
    }))
    celebrate()
    if (ch) showToast(`已完成「${ch.shortTitle}」· 获得 +${ch.xp} XP`)
  }

  const handleReset = () => {
    if (window.confirm('确定要清空所有学习进度、任务和徽章，重新开始吗？')) {
      setProgressState((prev) => ({ ...prev, completedChapters: [], completedAt: {} }))
      clearAllMissions()
      handleNavigate('home')
    }
  }

  const setNickname = (name) => setProgressState((prev) => ({ ...prev, nickname: name }))

  const ActiveChapter = CHAPTER_COMPONENTS[activeId]
  const nextId = getNextChapterId(activeId)

  const progressBar = (
    <div className="w-full">
      <div className="flex justify-between text-[11px] font-medium text-[#71717A] mb-1">
        <span>学习进度 {progress.done}/{progress.total}</span>
        <span className="tabular-nums text-[#0A0A0A] font-semibold">{progress.pct}%</span>
      </div>
      <div
        className="h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden"
        role="progressbar"
        aria-label="学习进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.pct}
      >
        <div
          className="h-full bg-[#059669] transition-transform duration-300 origin-left"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0A0A0A] focus:text-white focus:font-semibold"
      >
        跳到正文
      </a>

      {/* Crisp Gallery Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E4E4E7] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
            aria-label="回到首页"
          >
            <span
              className="w-8 h-8 rounded-lg bg-[#0A0A0A] text-white flex items-center justify-center text-sm font-bold tracking-tight"
              aria-hidden="true"
            >
              AI
            </span>
            <span className="font-semibold text-base tracking-tight text-[#0A0A0A]">
              AI 奇妙漫游指南
            </span>
          </button>

          {/* Clean Executive Progress Telemetry (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-xs font-medium text-[#52525B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]" aria-hidden="true" />
              <span className="text-[#0A0A0A] font-semibold">{levelInfo.title}</span>
              <span className="text-[#D4D4D8]">/</span>
              <span className="tabular-nums font-mono">{xp} XP</span>
            </div>
            <div className="w-36">{progressBar}</div>
          </div>

          {/* Mobile: compact status + drawer trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="md:hidden px-2.5 py-1 rounded-md bg-[#F7F7F8] border border-[#E4E4E7] text-xs font-medium text-[#0A0A0A] tabular-nums">
              {progress.done}/{progress.total}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg border border-[#E4E4E7] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? '关闭目录' : '打开目录'}
              aria-expanded={mobileMenuOpen}
              aria-controls="chapter-sidebar"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <div aria-live="polite" role="status" className="no-print">
        {toast && (
          <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 px-5 py-3 rounded-xl bg-[#0A0A0A] text-white border border-[#27272A] shadow-lg text-sm font-medium animate-pop">
            {toast}
          </div>
        )}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/30 lg:hidden no-print"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Layout: Mintlify-style Clean Left Rail + Wide Editorial Canvas */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <aside
          id="chapter-sidebar"
          className={`no-print lg:col-span-3 lg:sticky lg:top-24 lg:border-r lg:border-[#E4E4E7] lg:pr-6 space-y-6 ${
            mobileMenuOpen
              ? 'fixed top-16 left-0 bottom-0 z-40 w-[82%] max-w-xs overflow-y-auto p-5 bg-white border-r border-[#E4E4E7] lg:static lg:w-auto lg:max-w-none lg:p-0 lg:bg-transparent lg:overflow-visible'
              : 'hidden lg:block'
          }`}
        >
          <div className="md:hidden pb-4 border-b border-[#E4E4E7]">{progressBar}</div>

          <nav className="space-y-1" aria-label="课程目录">
            {CHAPTERS.map((ch) => {
              const active = activeId === ch.id
              const done = completedChapters.includes(ch.id)
              const Icon = NAV_ICONS[ch.id] || Compass
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => handleNavigate(ch.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F4F4F5] text-[#0A0A0A] font-semibold'
                      : 'text-[#52525B] hover:text-[#0A0A0A] hover:bg-[#FAFAFA] font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#059669]' : 'text-[#71717A]'}`}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] truncate">
                      {ch.id === 'home' ? '总览大厅' : `${ch.number} · ${ch.shortTitle}`}
                    </span>
                  </span>
                  {done && (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#059669]" aria-label="已完成" />
                  )}
                </button>
              )
            })}

            <div className="pt-3 mt-3 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={() => handleNavigate('cases')}
                aria-current={activeId === 'cases' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeId === 'cases'
                    ? 'bg-[#0A0A0A] text-white font-semibold'
                    : 'bg-[#F7F7F8] text-[#0A0A0A] hover:bg-[#EFEFF1] font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Briefcase
                    className={`w-4 h-4 shrink-0 ${activeId === 'cases' ? 'text-[#34D399]' : 'text-[#52525B]'}`}
                    aria-hidden="true"
                  />
                  <span className="text-[13px] truncate">AI 实战案例库</span>
                </span>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    activeId === 'cases' ? 'bg-white/15 text-white' : 'bg-white text-[#52525B] border border-[#E4E4E7]'
                  }`}
                >
                  {USE_CASES.length}
                </span>
              </button>
            </div>
          </nav>

          {/* Restrained Monochrome Badges Shelf */}
          <div className="pt-5 border-t border-[#E4E4E7] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#52525B] inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
                <span>已解锁成就 ({earnedBadges.length}/{TOTAL_BADGES})</span>
              </h2>
              {completedChapters.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-medium text-[#71717A] hover:text-[#DC2626] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" /> 重置
                </button>
              )}
            </div>
            {earnedBadges.length === 0 ? (
              <p className="text-xs text-[#71717A] leading-relaxed">完成每章互动任务即可解锁对应成就。</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {earnedBadges.map((b) => (
                  <li
                    key={b.id}
                    className="px-2.5 py-1 rounded-md bg-[#F7F7F8] border border-[#E4E4E7] text-[11px] font-medium text-[#27272A]"
                  >
                    {b.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Active Chapter Stage */}
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="lg:col-span-9 min-w-0 focus:outline-none"
        >
          <Suspense fallback={<PageLoading />}>
            {activeId === 'home' && (
              <HomeView
                completedChapters={completedChapters}
                onNavigate={handleNavigate}
                xp={xp}
                levelInfo={levelInfo}
              />
            )}
            {ActiveChapter && (
              <ActiveChapter
                key={activeId}
                isCompleted={completedChapters.includes(activeId)}
                onComplete={handleComplete}
                onNext={nextId ? () => handleNavigate(nextId) : undefined}
                nickname={nickname}
                setNickname={setNickname}
                graduatedAt={completedAt.ch6}
                onNavigate={handleNavigate}
              />
            )}
            {activeId === 'cases' && <UseCaseLibrary />}
          </Suspense>
        </main>
      </div>

      {/* Back to top */}
      {showTopBtn && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="回到顶部"
          className="no-print fixed bottom-6 right-5 z-40 w-10 h-10 rounded-full bg-white text-[#0A0A0A] border border-[#D4D4D8] shadow-md flex items-center justify-center cursor-pointer hover:border-[#0A0A0A] transition-colors"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-[#E4E4E7] py-5 px-4 text-center text-xs text-[#71717A] no-print">
        AI 奇妙漫游指南
      </footer>
    </div>
  )
}
