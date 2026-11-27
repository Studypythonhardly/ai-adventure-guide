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
import { CheckCircle2, Menu, X, RotateCcw, Award, ArrowUp } from 'lucide-react'

// 各关卡按需加载：首页不再背着 Three.js 等大依赖
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

const ROUTE_IDS = [...CHAPTERS.map((c) => c.id), 'cases']

function PageLoading() {
  return (
    <div className="card-playful p-10 text-center space-y-3" role="status" aria-live="polite">
      <div className="text-4xl animate-float" aria-hidden="true">🤖</div>
      <p className="font-black text-[#1E1B2E]">关卡加载中...</p>
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

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { completedChapters, completedAt, nickname } = progressState

  useEffect(() => {
    saveState(progressState)
  }, [progressState])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const xp = useMemo(() => computeXp(completedChapters), [completedChapters])
  const levelInfo = useMemo(() => getLevel(xp), [xp])
  const earnedBadges = useMemo(() => getEarnedBadges(completedChapters), [completedChapters])
  const progress = getProgress(completedChapters)

  // 切换页面：回到顶部、更新标题、把焦点交给正文（方便读屏用户）
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

  // 移动端抽屉：Esc 关闭
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
    if (ch) showToast(`🎉 恭喜通关「${ch.shortTitle}」！获得 +${ch.xp} XP & 徽章 ${ch.badge?.emoji || ''}`)
  }

  const handleReset = () => {
    if (window.confirm('确定要清空所有闯关进度、任务和徽章，重新开始冒险吗？')) {
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
      <div className="flex justify-between text-[11px] font-extrabold text-[#595470] mb-0.5">
        <span>冒险进度 {progress.done}/{progress.total}</span>
        <span>{progress.pct}%</span>
      </div>
      <div
        className="h-2.5 bg-white rounded-full border-2 border-[#1E1B2E] overflow-hidden"
        role="progressbar"
        aria-label="冒险进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.pct}
      >
        <div className="h-full bg-[#10B981] transition-all duration-500" style={{ width: `${progress.pct}%` }} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFFBF5] bg-dots flex flex-col">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#1E1B2E] focus:text-white focus:font-black"
      >
        跳到正文
      </a>

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFFBF5]/95 backdrop-blur border-b-2 border-[#1E1B2E] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
            aria-label="回到出发大厅"
          >
            <span
              className="w-9 h-9 rounded-xl bg-[#5B4BFF] text-white border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] flex items-center justify-center text-lg"
              aria-hidden="true"
            >
              🤖
            </span>
            <span className="font-black text-base sm:text-lg text-[#1E1B2E] leading-none">AI 奇妙漫游指南</span>
          </button>

          {/* Progress & XP Pill (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] text-xs font-black">
              <span aria-hidden="true">{levelInfo.emoji}</span>
              <span>{levelInfo.title}</span>
              <span className="text-[#5B4BFF]">· {xp} XP</span>
            </div>
            <div className="w-40">{progressBar}</div>
          </div>

          {/* Mobile: compact XP + drawer trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="md:hidden px-2.5 py-1 rounded-full bg-white border-2 border-[#1E1B2E] text-[11px] font-black">
              <span aria-hidden="true">{levelInfo.emoji}</span> {xp} XP · {progress.done}/{progress.total}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="btn-playful p-2 rounded-xl bg-white text-[#1E1B2E] cursor-pointer"
              aria-label={mobileMenuOpen ? '关闭关卡菜单' : '打开关卡菜单'}
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
          <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 px-5 py-3 rounded-2xl bg-[#1E1B2E] text-white border-2 border-[#10B981] shadow-[4px_4px_0_#10B981] text-sm font-black animate-pop">
            {toast}
          </div>
        )}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-[#1E1B2E]/40 lg:hidden no-print"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Sidebar Navigation (Desktop sticky / Mobile overlay drawer) */}
        <aside
          id="chapter-sidebar"
          className={`no-print lg:col-span-3 lg:sticky lg:top-24 space-y-4 ${
            mobileMenuOpen
              ? 'fixed top-16 left-0 bottom-0 z-40 w-[85%] max-w-xs overflow-y-auto p-4 bg-[#FFFBF5] border-r-2 border-[#1E1B2E] lg:static lg:w-auto lg:max-w-none lg:p-0 lg:bg-transparent lg:border-0 lg:overflow-visible'
              : 'hidden lg:block'
          }`}
        >
          <div className="md:hidden card-playful p-3">{progressBar}</div>

          <nav className="card-playful p-3 space-y-1.5" aria-label="关卡地图">
            {CHAPTERS.map((ch) => {
              const active = activeId === ch.id
              const done = completedChapters.includes(ch.id)
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => handleNavigate(ch.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer border-2 ${
                    active
                      ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                      : 'bg-transparent border-transparent hover:bg-white text-[#1E1B2E]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0" aria-hidden="true">{ch.emoji}</span>
                    <span className="text-xs font-black truncate">
                      {ch.id === 'home' ? ch.title : `${ch.number} · ${ch.shortTitle}`}
                    </span>
                  </span>
                  {done && (
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#A7F3D0]' : 'text-[#10B981]'}`}
                      aria-label="已通关"
                    />
                  )}
                </button>
              )
            })}

            {/* Permanent Practical Toolbox: AI Use Case Library */}
            <div className="pt-2 mt-2 border-t-2 border-dashed border-[#1E1B2E]/15">
              <button
                type="button"
                onClick={() => handleNavigate('cases')}
                aria-current={activeId === 'cases' ? 'page' : undefined}
                className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer border-2 ${
                  activeId === 'cases'
                    ? 'bg-[#B45309] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                    : 'bg-[#FEF6E4]/80 border-[#F59E0B]/40 hover:border-[#1E1B2E] text-[#1E1B2E]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0" aria-hidden="true">🧰</span>
                  <span className="text-xs font-black truncate">AI 实战案例库 ({USE_CASES.length})</span>
                </span>
              </button>
            </div>
          </nav>

          {/* Earned Badges Box */}
          <div className="card-playful p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-[#1E1B2E] inline-flex items-center gap-1">
                <Award className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" /> 我的徽章柜 ({earnedBadges.length}/
                {TOTAL_BADGES})
              </h2>
              {completedChapters.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold text-[#6B6685] hover:text-[#C83726] inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" /> 重置进度
                </button>
              )}
            </div>
            {earnedBadges.length === 0 ? (
              <p className="text-xs text-[#595470]">完成每关的任务就能收集徽章，快去第 1 关玩玩看吧！</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {earnedBadges.map((b) => (
                  <li
                    key={b.id}
                    className="px-2.5 py-1 rounded-full bg-[#FEF6E4] border border-[#1E1B2E] text-[11px] font-black text-[#92400E]"
                  >
                    <span aria-hidden="true">{b.emoji}</span> {b.name}
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

      {/* Back to top floating button */}
      {showTopBtn && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="回到顶部"
          className="no-print fixed bottom-6 right-5 z-40 w-10 h-10 rounded-full bg-white text-[#1E1B2E] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center cursor-pointer hover:bg-[#EEF0FF] transition-colors"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      {/* Minimal Footer */}
      <footer className="border-t-2 border-[#1E1B2E]/10 py-4 px-4 text-center text-xs font-bold text-[#6B6685] no-print">
        🤖 AI 奇妙漫游指南
      </footer>
    </div>
  )
}
