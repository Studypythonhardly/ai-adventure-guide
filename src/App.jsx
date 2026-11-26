import React, { useState, useEffect, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { CHAPTERS, LEVELS } from './data/courseData'
import { USE_CASES } from './data/useCasesData'
import { HomeView } from './chapters/HomeView'
import { Chapter1Brain } from './chapters/Chapter1Brain'
import { Chapter2Breakthroughs } from './chapters/Chapter2Breakthroughs'
import { Chapter3Heroes } from './chapters/Chapter3Heroes'
import { Chapter4Prompt } from './chapters/Chapter4Prompt'
import { Chapter5Maker } from './chapters/Chapter5Maker'
import { Chapter6Glossary } from './chapters/Chapter6Glossary'
import { UseCaseLibrary } from './chapters/UseCaseLibrary'
import { CheckCircle2, Menu, X, RotateCcw, Award } from 'lucide-react'

const STORAGE_KEY = 'ai_adventure_guide_v1'

export default function App() {
  const [activeId, setActiveId] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [completedChapters, setCompletedChapters] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      return Array.isArray(saved.completedChapters) ? saved.completedChapters : []
    } catch {
      return []
    }
  })
  const [nickname, setNickname] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      return saved.nickname || '未来的 AI 玩家'
    } catch {
      return '未来的 AI 玩家'
    }
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedChapters, nickname }))
    } catch {
      // ignore storage quota errors
    }
  }, [completedChapters, nickname])

  const xp = useMemo(() => {
    return CHAPTERS.reduce(
      (sum, ch) => (completedChapters.includes(ch.id) ? sum + ch.xp : sum),
      20
    )
  }, [completedChapters])

  const levelInfo = useMemo(() => {
    let current = LEVELS[0]
    for (const lvl of LEVELS) {
      if (xp >= lvl.minXp) current = lvl
    }
    return current
  }, [xp])

  const earnedBadges = useMemo(() => {
    return CHAPTERS.filter((ch) => ch.badge && completedChapters.includes(ch.id)).map(
      (ch) => ch.badge
    )
  }, [completedChapters])

  const totalChapters = CHAPTERS.length - 1
  const doneCount = CHAPTERS.filter(
    (c) => c.id !== 'home' && completedChapters.includes(c.id)
  ).length
  const progressPct = Math.round((doneCount / totalChapters) * 100)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
  }, [activeId])

  const handleNavigate = (id) => {
    setActiveId(id)
    setMobileMenuOpen(false)
  }

  const handleComplete = (chapterId) => {
    if (completedChapters.includes(chapterId)) return
    const ch = CHAPTERS.find((c) => c.id === chapterId)
    setCompletedChapters((prev) => [...prev, chapterId])
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } })
    if (ch) {
      setToast(`🎉 恭喜通关「${ch.shortTitle}」！获得 +${ch.xp} XP & 徽章 ${ch.badge?.emoji || ''}`)
      setTimeout(() => setToast(null), 3500)
    }
  }

  const handleReset = () => {
    if (window.confirm('确定要清空所有闯关进度和徽章，重新开始冒险吗？')) {
      setCompletedChapters([])
      setActiveId('home')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] bg-dots flex flex-col">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFFBF5]/95 backdrop-blur border-b-2 border-[#1E1B2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <span className="w-9 h-9 rounded-xl bg-[#5B4BFF] text-white border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] flex items-center justify-center text-lg">
              🤖
            </span>
            <div>
              <div className="font-black text-base sm:text-lg text-[#1E1B2E] leading-none">
                AI 奇妙漫游指南
              </div>
              <div className="text-[11px] font-bold text-[#595470] mt-0.5">
                2026 零基础 ELI5 互动教程
              </div>
            </div>
          </button>

          {/* Progress & XP Pill */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] text-xs font-black">
              <span>{levelInfo.emoji}</span>
              <span>{levelInfo.title}</span>
              <span className="text-[#5B4BFF]">· {xp} XP</span>
            </div>

            <div className="w-36">
              <div className="flex justify-between text-[11px] font-extrabold text-[#595470] mb-0.5">
                <span>冒险进度</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2.5 bg-white rounded-full border-2 border-[#1E1B2E] overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden btn-playful p-2 rounded-xl bg-white text-[#1E1B2E] cursor-pointer"
            aria-label="打开关卡菜单"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-[#1E1B2E] text-white border-2 border-[#10B981] shadow-[4px_4px_0_#10B981] text-sm font-black animate-pop">
          {toast}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Sidebar Navigation (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 lg:sticky lg:top-24 space-y-4 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <nav className="card-playful p-3 space-y-1.5">
            <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#595470]">
              🗺️ 关卡地图
            </div>
            {CHAPTERS.map((ch) => {
              const active = activeId === ch.id
              const done = completedChapters.includes(ch.id)
              return (
                <button
                  key={ch.id}
                  onClick={() => handleNavigate(ch.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer border-2 ${
                    active
                      ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                      : 'bg-transparent border-transparent hover:bg-[#FFFBF5] text-[#1E1B2E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{ch.emoji}</span>
                    <div className="truncate">
                      <div className="text-xs font-black truncate">
                        {ch.id === 'home' ? ch.title : `${ch.number} · ${ch.shortTitle}`}
                      </div>
                    </div>
                  </div>
                  {done && (
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#A7F3D0]' : 'text-[#10B981]'}`}
                    />
                  )}
                </button>
              )
            })}

            {/* Permanent Practical Toolbox: AI Use Case Library */}
            <div className="pt-2 mt-2 border-t-2 border-dashed border-[#1E1B2E]/15">
              <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#D97706]">
                🧰 随查工具箱
              </div>
              <button
                onClick={() => handleNavigate('cases')}
                className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer border-2 ${
                  activeId === 'cases'
                    ? 'bg-[#F59E0B] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                    : 'bg-[#FEF6E4]/80 border-[#F59E0B]/40 hover:border-[#1E1B2E] text-[#1E1B2E]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">🧰</span>
                  <div className="truncate">
                    <div className="text-xs font-black truncate">AI 实战案例库 ({USE_CASES.length})</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                    activeId === 'cases' ? 'bg-white/25 text-white' : 'bg-white text-[#B45309]'
                  }`}
                >
                  速查
                </span>
              </button>
            </div>
          </nav>

          {/* Earned Badges Box */}
          <div className="card-playful p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1E1B2E] inline-flex items-center gap-1">
                <Award className="w-4 h-4 text-[#F59E0B]" /> 我的徽章柜 ({earnedBadges.length}/6)
              </span>
              {completedChapters.length > 0 && (
                <button
                  onClick={handleReset}
                  className="text-[11px] font-bold text-[#8E89A6] hover:text-[#FF6B57] inline-flex items-center gap-0.5 cursor-pointer"
                  title="重置进度"
                >
                  <RotateCcw className="w-3 h-3" /> 重置
                </button>
              )}
            </div>
            {earnedBadges.length === 0 ? (
              <p className="text-xs text-[#595470]">
                通关每个关卡就能收集酷炫徽章，快去第 1 关玩玩看吧！
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {earnedBadges.map((b) => (
                  <span
                    key={b.id}
                    className="px-2.5 py-1 rounded-full bg-[#FEF6E4] border border-[#1E1B2E] text-[11px] font-black text-[#92400E]"
                  >
                    {b.emoji} {b.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Active Chapter Stage */}
        <main className="lg:col-span-9 min-w-0">
          {activeId === 'home' && (
            <HomeView
              completedChapters={completedChapters}
              onNavigate={handleNavigate}
              xp={xp}
              levelInfo={levelInfo}
            />
          )}
          {activeId === 'ch1' && (
            <Chapter1Brain
              isCompleted={completedChapters.includes('ch1')}
              onComplete={handleComplete}
              onNext={() => handleNavigate('ch2')}
            />
          )}
          {activeId === 'ch2' && (
            <Chapter2Breakthroughs
              isCompleted={completedChapters.includes('ch2')}
              onComplete={handleComplete}
              onNext={() => handleNavigate('ch3')}
            />
          )}
          {activeId === 'ch3' && (
            <Chapter3Heroes
              isCompleted={completedChapters.includes('ch3')}
              onComplete={handleComplete}
              onNext={() => handleNavigate('ch4')}
            />
          )}
          {activeId === 'ch4' && (
            <Chapter4Prompt
              isCompleted={completedChapters.includes('ch4')}
              onComplete={handleComplete}
              onNext={() => handleNavigate('ch5')}
            />
          )}
          {activeId === 'ch5' && (
            <Chapter5Maker
              isCompleted={completedChapters.includes('ch5')}
              onComplete={handleComplete}
              onNext={() => handleNavigate('ch6')}
            />
          )}
          {activeId === 'ch6' && (
            <Chapter6Glossary
              isCompleted={completedChapters.includes('ch6')}
              onComplete={handleComplete}
              nickname={nickname}
              setNickname={setNickname}
            />
          )}
          {activeId === 'cases' && <UseCaseLibrary />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-[#1E1B2E]/10 py-5 text-center text-xs font-bold text-[#595470]">
        🤖 《AI 奇妙漫游指南》 · 2026 互动学习体验 · 全程 ELI5 大白话打造
      </footer>
    </div>
  )
}
