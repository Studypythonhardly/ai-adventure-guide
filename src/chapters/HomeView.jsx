import { CHAPTERS } from '../data/courseData'
import { USE_CASES } from '../data/useCasesData'
import { AiActionAnimations } from '../components/AiActionAnimations'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function HomeView({ completedChapters, onNavigate, xp, levelInfo }) {
  const learningChapters = CHAPTERS.filter((c) => c.id !== 'home')
  const doneCount = learningChapters.filter((c) => completedChapters.includes(c.id)).length
  const nextChapter = learningChapters.find((c) => !completedChapters.includes(c.id)) || learningChapters[0]

  return (
    <div className="space-y-12 animate-pop">
      {/* Gallery Monochrome Editorial Hero (Direction B — Mintlify / Stripe Docs elegance) */}
      <section className="pb-10 border-b border-[#E4E4E7]">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E4E4E7] text-xs font-medium text-[#52525B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden="true" />
            <span>6 节交互式课程 · {USE_CASES.length} 个真实工作与生活实例</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] leading-[1.16]">
            从零开始，系统理解并真正用好 AI
          </h1>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            告别晦涩术语。通过动手实验拆解大模型原理、复盘前沿突破、理清主流工具选型，并亲手用自然语言打造可独立运行的个人看板与网页工具。
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate(nextChapter.id)}
              className="px-6 py-3 rounded-lg bg-[#0A0A0A] hover:bg-[#27272A] text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>
                {doneCount === 0
                  ? '开始第 01 课'
                  : doneCount < learningChapters.length
                  ? `继续第 ${nextChapter.number} 课`
                  : '重新浏览第 01 课'}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="px-5 py-3 rounded-lg bg-white hover:bg-[#F7F7F8] text-[#0A0A0A] border border-[#D4D4D8] hover:border-[#0A0A0A] font-semibold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>浏览实战案例库 ({USE_CASES.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6-Second Real Input-to-Output Live Demos */}
      <AiActionAnimations onNavigate={onNavigate} />

      {/* Clean Architectural Chapter Index */}
      <section aria-labelledby="roadmap-heading" className="space-y-5">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 id="roadmap-heading" className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">
            课程目录
          </h2>
          <span className="text-xs font-medium text-[#71717A] tabular-nums">
            {levelInfo.title} · 已完成 {doneCount}/{learningChapters.length} · {xp} XP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningChapters.map((ch) => {
            const done = completedChapters.includes(ch.id)
            return (
              <button
                type="button"
                key={ch.id}
                onClick={() => onNavigate(ch.id)}
                className="card-playful card-playful-hover p-5 text-left flex flex-col justify-between cursor-pointer group bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F7F7F8] text-[#52525B] border border-[#E4E4E7]">
                      {ch.number}
                    </span>
                    {done && (
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" aria-label="已完成" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#0A0A0A] group-hover:text-[#059669] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52525B] mt-1.5 leading-relaxed">
                      {ch.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F4F4F5] flex items-center justify-between text-xs text-[#71717A]">
                  <span className="font-mono">+{ch.xp} XP</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#0A0A0A] group-hover:translate-x-0.5 transition-transform">
                    {done ? '回顾' : '进入'} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
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
