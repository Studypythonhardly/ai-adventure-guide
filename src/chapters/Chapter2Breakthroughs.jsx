import { useState } from 'react'
import { Eli5Box, CheckpointQuiz, ChapterFooterNav, SectionJumpBar } from '../components/Eli5Card'
import { PelicanBikeStage } from '../components/PelicanBikeStage'
import {
  RIEMANN_TIMELINE,
  RIEMANN_CODE_SIZE,
  RIEMANN_SOURCES,
  AI_LIMITS,
  WOW_CASES,
  AI_OR_HUMAN_QUIZ,
  CHECKPOINTS,
} from '../data/courseData'
import { useMissionFlags } from '../hooks/useMissionFlags'
import { Award, CheckCircle2, XCircle, Sparkles, ExternalLink, Scale } from 'lucide-react'

const COMPACT_PCT = ((RIEMANN_CODE_SIZE.compact / RIEMANN_CODE_SIZE.original) * 100).toFixed(2)
const READABLE_PCT = ((RIEMANN_CODE_SIZE.readable / RIEMANN_CODE_SIZE.original) * 100).toFixed(2)

export function Chapter2Breakthroughs({ isCompleted, onComplete, onNext }) {
  const [flags, mark] = useMissionFlags('ch2')
  const [timelineStep, setTimelineStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})

  const currentStage = RIEMANN_TIMELINE[timelineStep]

  const handleSelectQuiz = (qId, val) => {
    setQuizAnswers((prev) => {
      const next = { ...prev, [qId]: val }
      if (AI_OR_HUMAN_QUIZ.every((q) => next[q.id] === q.answer)) {
        mark('mythQuiz')
      }
      return next
    })
  }

  const missions = [
    { id: 'timeline', label: '点击时间轴，查看黎曼猜想证明的其它阶段', done: Boolean(flags.timeline) },
    { id: 'mythQuiz', label: '在“真假大挑战”中把 4 道题全部选对', done: Boolean(flags.mythQuiz) },
    { id: 'checkpoint', label: '答对底部的通关小测', done: Boolean(flags.checkpoint) },
  ]

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-2xl bg-[#FEF6E4] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🏆
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">02 · AI 已经牛到什么地步了？</h1>
      </div>

      <SectionJumpBar
        items={[
          { id: 'ch2-riemann', label: '📐 黎曼猜想' },
          { id: 'ch2-pelican', label: '🚲 3D 鹈鹕' },
          { id: 'ch2-limits', label: '⚖️ 能力与边界' },
          { id: 'ch2-quiz', label: '🎮 真假挑战' },
        ]}
        missions={missions}
        isCompleted={isCompleted}
      />

      {/* Featured Case: Riemann Hypothesis Nov 2026 */}
      <section id="ch2-riemann" className="scroll-mt-32 card-playful p-5 sm:p-7 bg-gradient-to-br from-[#FEF6E4] via-[#FFFFFF] to-[#EEF0FF] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B45309] text-white text-xs font-black badge-pill">
            <Award className="w-4 h-4" aria-hidden="true" /> 2026 年 11 月数学 × AI 里程碑案例
          </span>
          <span className="text-xs font-extrabold text-[#595470]">人类数学皇冠难题 × 形式化机器核验</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">
            📐 悬案 167 年的“黎曼猜想”，迎来了人机合作的形式化证明
          </h2>
          <p className="text-sm sm:text-base text-[#45405C] mt-2 leading-relaxed">
            很多人以为 AI 只会写周报、画头像。但在 <strong>2026 年 11 月 20 日</strong>，数学家{' '}
            <strong>Levent Alpöge</strong> 与 Anthropic 的 <strong>Claude</strong> 合作，发布了千禧年难题——
            <strong>黎曼猜想（及广义黎曼猜想）</strong>的 Lean 形式化证明库，随后通过了 Lean FRO、Mathlib 社区与多个独立检查器的机器核验。与此同时，数学界仍在把这套庞大代码消化成人类易读的数学解释。
          </p>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="card-playful p-4 sm:p-5 bg-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-[#5B4BFF]">🎮 点按时间轴，围观“1740 万行证明核验与瘦身”全过程：</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B4BFF]">
              阶段 {timelineStep + 1} / {RIEMANN_TIMELINE.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="黎曼猜想时间轴">
            {RIEMANN_TIMELINE.map((item) => (
              <button
                type="button"
                key={item.step}
                onClick={() => {
                  setTimelineStep(item.step)
                  if (item.step !== 0) mark('timeline')
                }}
                aria-pressed={timelineStep === item.step}
                className={`p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                  timelineStep === item.step
                    ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[2px_2px_0_#F59E0B]'
                    : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
                }`}
              >
                <div className="text-[11px] font-bold opacity-80">阶段 {item.step + 1}</div>
                <div className="text-xs font-black mt-0.5 truncate">{item.lines}</div>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 space-y-3 animate-pop" key={currentStage.step}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-[#B45309]">{currentStage.year}</span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FEF6E4] text-[#92400E] border border-[#F59E0B]/40">
                {currentStage.highlight}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1E1B2E]">{currentStage.title}</h3>
            <p className="text-sm sm:text-base text-[#37334D] leading-relaxed">{currentStage.eli5}</p>

            {/* Accurate Visual Slimming Comparison when on step 1 or 2 */}
            {(timelineStep === 1 || timelineStep === 2) && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-[#595470]">
                  📊 真实代码量比例对比（精简版仅占初版 {COMPACT_PCT}%，瘦身约 99.56%）：
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-24 shrink-0">初版库</span>
                    <div className="flex-1 h-4 bg-[#FF6B57] rounded-full border border-[#1E1B2E]" />
                    <span className="w-24 text-right tabular-nums">~1,740 万行</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-24 shrink-0">可读导读版</span>
                    <div className="flex-1 h-4 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#1E1B2E]/30">
                      <div
                        className="h-full bg-[#F59E0B] rounded-full"
                        style={{ width: `${READABLE_PCT}%`, minWidth: '6px' }}
                      />
                    </div>
                    <span className="w-24 text-right text-[#92400E] tabular-nums">~30 万行</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-24 shrink-0">紧凑精简版</span>
                    <div className="flex-1 h-4 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#1E1B2E]/30">
                      <div
                        className="h-full bg-[#10B981] rounded-full"
                        style={{ width: `${COMPACT_PCT}%`, minWidth: '4px' }}
                      />
                    </div>
                    <span className="w-24 text-right text-[#047857] tabular-nums">~7.6 万行</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Eli5Box
          badge="为什么这次能站住脚？"
          accent="#5B4BFF"
          what="核心秘密是：人类数学家的顶层战略 + AI（Claude）的高强度推导产出 + Lean（铁面机器裁判）逐步检查每一行逻辑。"
          analogy="以前 AI 做复杂数学题像小朋友在草稿纸上跳步骤，很容易藏着漏洞；现在给它配了一个叫 Lean 的“严格质检机”，每写一步机器当场核对——差半点就报错打回，而且最后还用好几个不同团队写的独立检查器复查了题目和公理！"
          soWhat="记住这个黄金组合：以后你用 AI 干重要活儿时，让 AI 当“出主意的大脑”，再配合“工具/测试/原文核查”当裁判，既快又稳！"
        />

        {/* Source Verification Links (Practice What We Preach!) */}
        <div className="p-4 rounded-2xl bg-white/90 border-2 border-[#1E1B2E]/15 space-y-2">
          <div className="text-xs font-black text-[#1E1B2E]">
            🔎 学以致用 · 重要信息核对来源（点击可在新窗口查阅公开资料）：
          </div>
          <div className="flex flex-wrap gap-2">
            {RIEMANN_SOURCES.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFBF5] hover:bg-[#EEF0FF] border border-[#1E1B2E]/25 text-xs font-bold text-[#3A2EDB] transition-colors"
              >
                <span>{src.label}</span>
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Iconic Pelican Riding a Bicycle Animated Benchmark */}
      <div id="ch2-pelican" className="scroll-mt-32">
        <PelicanBikeStage />
      </div>

      {/* 3 More Mind-Blowing AI Superpowers */}
      <section id="ch2-limits" className="scroll-mt-32 space-y-4">
        <h2 className="text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#F59E0B]" aria-hidden="true" /> 除了数学，现代 AI 还擅长这 3 类事
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WOW_CASES.map((item) => (
            <div key={item.id} className="card-playful p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl" aria-hidden="true">{item.emoji}</span>
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-full text-white border border-[#1E1B2E]"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1E1B2E]">{item.title}</h3>
                <p className="text-sm text-[#37334D] leading-relaxed">
                  <strong>一句话：</strong>
                  {item.what}
                </p>
                <div className="p-3 rounded-xl bg-[#FFFBF5] border border-[#1E1B2E]/15 text-xs text-[#45405C] leading-relaxed">
                  <strong>🧸 比喻：</strong>
                  {item.analogy}
                </div>
                <div className="p-3 rounded-xl bg-[#EEF0FF]/60 border border-[#5B4BFF]/20 text-xs text-[#2D2A40] leading-relaxed">
                  <strong>🎬 举个栗子：</strong>
                  {item.example}
                </div>
              </div>
              <div className="pt-2 border-t border-[#1E1B2E]/10 text-xs font-bold text-[#047857]">
                ✨ 对你的意义：{item.soWhat}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sober Counterbalance: What AI Still Struggles With */}
      <section className="card-playful p-5 sm:p-7 bg-[#FFFBF5] space-y-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#C83726] text-xs font-black border border-[#FF6B57]/35 mb-1">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" /> 冷静一下 · 别把 AI 神化
          </span>
          <h2 className="text-xl font-black text-[#1E1B2E]">哪怕再厉害，这 4 件事你依然不能盲信 AI</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AI_LIMITS.map((lim) => (
            <div key={lim.title} className="p-4 rounded-2xl bg-white border-2 border-[#1E1B2E]/15 space-y-1.5">
              <h3 className="font-black text-base text-[#1E1B2E] flex items-center gap-2">
                <span aria-hidden="true">{lim.emoji}</span>
                <span>{lim.title}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">{lim.what}</p>
              <p className="text-xs font-bold text-[#047857]">✅ 正确做法：{lim.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Mini-Game: AI Myth-Buster */}
      <section id="ch2-quiz" className="scroll-mt-32 card-playful p-5 sm:p-7 space-y-5">
        <h2 className="text-xl font-black text-[#1E1B2E]">🎮 真假大挑战（4 题全对解锁任务）</h2>

        <div className="space-y-4">
          {AI_OR_HUMAN_QUIZ.map((q, idx) => {
            const chosen = quizAnswers[q.id]
            const isCorrect = chosen === q.answer
            return (
              <div key={q.id} className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 space-y-3">
                <div className="font-extrabold text-sm sm:text-base text-[#1E1B2E]">
                  {idx + 1}. {q.statement}
                </div>
                <div className="flex flex-wrap gap-2.5" role="group" aria-label={`第 ${idx + 1} 题选项`}>
                  {q.options.map((opt) => {
                    const selected = chosen === opt.value
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => handleSelectQuiz(q.id, opt.value)}
                        aria-pressed={selected}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 cursor-pointer transition-all ${
                          selected
                            ? opt.value === q.answer
                              ? 'bg-[#10B981] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                              : 'bg-[#FF6B57] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                            : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/30 hover:border-[#1E1B2E]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {chosen && (
                  <div
                    className={`p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2 animate-pop ${
                      isCorrect
                        ? 'bg-[#E8FBF3] text-[#065F46] border border-[#10B981]'
                        : 'bg-[#FFF0ED] text-[#9A3412] border border-[#FF6B57]'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B57]" aria-hidden="true" />
                    )}
                    <span>
                      <strong>{isCorrect ? '判断准确！' : '再看看反转解析：'}</strong> {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <CheckpointQuiz
        quiz={CHECKPOINTS.ch2}
        passed={Boolean(flags.checkpoint) || isCompleted}
        onPass={() => mark('checkpoint')}
      />

      <ChapterFooterNav
        chapterId="ch2"
        isCompleted={isCompleted}
        onComplete={onComplete}
        missions={missions}
        nextLabel="去第 3 关：逛主流 AI 英雄图鉴 →"
        onNext={onNext}
      />
    </div>
  )
}

export default Chapter2Breakthroughs
