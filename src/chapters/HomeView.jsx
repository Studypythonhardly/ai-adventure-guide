import { CHAPTERS } from '../data/courseData'
import { USE_CASES } from '../data/useCasesData'
import { AiActionAnimations } from '../components/AiActionAnimations'
import { Play, CheckCircle2, ArrowRight, Trophy } from 'lucide-react'

export function HomeView({ completedChapters, onNavigate, xp, levelInfo }) {
  const learningChapters = CHAPTERS.filter((c) => c.id !== 'home')
  const doneCount = learningChapters.filter((c) => completedChapters.includes(c.id)).length
  const nextChapter = learningChapters.find((c) => !completedChapters.includes(c.id)) || learningChapters[0]

  return (
    <div className="space-y-7 animate-pop">
      {/* Compact, Punchy Hero Banner */}
      <section className="card-playful p-6 sm:p-8 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#FFF0ED] relative overflow-hidden">
        <div className="max-w-2xl lg:pr-44 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1E1B2E] leading-[1.22]">
            从 0 开始，像玩游戏一样
            <span className="inline-block bg-[#5B4BFF] text-white px-3 py-0.5 rounded-xl mx-1.5 -rotate-1 border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E]">
              搞懂 AI
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#45405C] leading-relaxed">
            没有晦涩公式，用 6 个互动关卡 + 24 个实战案例：拆解大模型原理、围观黎曼猜想与 3D 鹈鹕、挑对 AI 工具，最后零代码亲手做出可下载的网页作品。
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate(nextChapter.id)}
              className="btn-playful px-6 py-3 rounded-2xl bg-[#5B4BFF] text-white font-black text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>
                {doneCount === 0
                  ? '开始冒险：第 1 关'
                  : doneCount < learningChapters.length
                  ? `继续冒险：第 ${nextChapter.number} 关`
                  : '重温第 1 关'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="btn-playful px-5 py-3 rounded-2xl bg-[#FEF6E4] text-[#1E1B2E] font-extrabold text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-[#FDE68A]"
            >
              <span>🧰 AI 实战案例库 ({USE_CASES.length})</span>
            </button>
          </div>
        </div>

        {/* Playful floating robot on desktop */}
        <div
          className="hidden lg:flex flex-col items-center justify-center absolute right-10 top-1/2 -translate-y-1/2 select-none"
          aria-hidden="true"
        >
          <div className="text-7xl animate-float">🤖</div>
        </div>
      </section>

      {/* Formal Interactive Workflow Demo */}
      <AiActionAnimations />

      {/* Adventure Map */}
      <section aria-labelledby="roadmap-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="roadmap-heading" className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
            🗺️ {learningChapters.length} 关漫游路线图
          </h2>
          {doneCount === learningChapters.length ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-extrabold badge-pill">
              <Trophy className="w-4 h-4" aria-hidden="true" /> 全部通关
            </span>
          ) : (
            <span className="text-xs font-extrabold text-[#595470]">
              {levelInfo.emoji} {levelInfo.title} · {doneCount}/{learningChapters.length} 关 · {xp} XP
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningChapters.map((ch) => {
            const done = completedChapters.includes(ch.id)
            return (
              <button
                type="button"
                key={ch.id}
                onClick={() => onNavigate(ch.id)}
                className="card-playful card-playful-hover p-5 text-left flex flex-col justify-between cursor-pointer group"
                style={{ backgroundColor: done ? '#F0FDF4' : '#FFFFFF' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-2xl border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]"
                      style={{ backgroundColor: ch.bgLight }}
                      aria-hidden="true"
                    >
                      {ch.emoji}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#1E1B2E] border border-[#1E1B2E]/20">
                        第 {ch.number} 关
                      </span>
                      {done && <CheckCircle2 className="w-5 h-5 text-[#10B981]" aria-label="已通关" />}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#1E1B2E] group-hover:text-[#5B4BFF] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595470] mt-1 leading-relaxed">{ch.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E1B2E]/10 flex items-center justify-between text-xs font-extrabold">
                  <span style={{ color: ch.color }}>
                    +{ch.xp} XP · {ch.badge?.emoji} {ch.badge?.name}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-[#1E1B2E] group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default HomeView
