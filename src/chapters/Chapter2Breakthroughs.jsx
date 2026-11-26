import React, { useState } from 'react'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { PelicanBikeStage } from '../components/PelicanBikeStage'
import { RIEMANN_TIMELINE, WOW_CASES, AI_OR_HUMAN_QUIZ } from '../data/courseData'
import { Award, CheckCircle2, XCircle, Sparkles } from 'lucide-react'

export function Chapter2Breakthroughs({ isCompleted, onComplete, onNext }) {
  const [timelineStep, setTimelineStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})

  const currentStage = RIEMANN_TIMELINE[timelineStep]

  const handleSelectQuiz = (qId, val) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#FEF6E4] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          🏆
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#D97706]">第 02 关 · 打破认知天花板</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">AI 已经牛到什么地步了？</h1>
        </div>
      </div>

      {/* Featured Case: Riemann Hypothesis Nov 2026 */}
      <section className="card-playful p-5 sm:p-7 bg-gradient-to-br from-[#FEF6E4] via-[#FFFFFF] to-[#EEF0FF] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] text-white text-xs font-black badge-pill">
            <Award className="w-4 h-4" /> 2026 年 11 月震撼全球头号案例
          </span>
          <span className="text-xs font-extrabold text-[#595470]">人类数学最高皇冠 × 现代 AI</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">
            📐 困扰人类 167 年的“黎曼猜想”，被 AI 协助攻破了！
          </h2>
          <p className="text-sm sm:text-base text-[#45405C] mt-2 leading-relaxed">
            很多人以为 AI 只会写写周报、画画二次元头像。但在 <strong>2026 年 11 月</strong>，
            数学家兼研究员 <strong>Levent Alpöge</strong> 联手 Anthropic 的 AI 模型 <strong>Claude</strong>，
            完成了困扰数学界 167 年的千禧年头号难题——<strong>黎曼猜想（及广义黎曼猜想）</strong>的机器可验证候选证明！
          </p>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="card-playful p-4 sm:p-5 bg-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-[#5B4BFF]">🎮 点按时间轴，围观“1600万行天书大瘦身”全过程：</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B4BFF]">
              进度 {timelineStep + 1} / {RIEMANN_TIMELINE.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RIEMANN_TIMELINE.map((item) => (
              <button
                key={item.step}
                onClick={() => setTimelineStep(item.step)}
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
              <span className="text-xs font-black text-[#D97706]">{currentStage.year}</span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FEF6E4] text-[#92400E] border border-[#F59E0B]/40">
                {currentStage.highlight}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1E1B2E]">{currentStage.title}</h3>
            <p className="text-sm sm:text-base text-[#37334D] leading-relaxed">{currentStage.eli5}</p>

            {/* Visual Slimming Comparison when on step 1 or 2 */}
            {(timelineStep === 1 || timelineStep === 2) && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-[#595470]">📊 代码量直观对比（瘦身超 99.5%！）：</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-24 shrink-0">初版天书</span>
                    <div className="flex-1 h-4 bg-[#FF6B57] rounded-full border border-[#1E1B2E]" />
                    <span className="w-20 text-right">~1,600万行</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-24 shrink-0">精简重构版</span>
                    <div className="flex-1 h-4 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#1E1B2E]/30">
                      <div className="h-full bg-[#10B981] rounded-full" style={{ width: '2.5%' }} />
                    </div>
                    <span className="w-20 text-right text-[#047857]">~7.6万行</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Eli5Box
          badge="为什么这次能成功？"
          accent="#5B4BFF"
          what="核心秘密是：AI（Claude）的超级创造力 + Lean（铁面无私的数学代码裁判）的 100% 严格核验。"
          analogy="以前 AI 做数学题就像小朋友在白纸上瞎蒙，老师一眼就能挑出逻辑漏洞；现在给 AI 配了一个叫 Lean 的“防作弊质检机”，每写一步，机器立刻检查合不合法——有半点糊弄就亮红灯打回重写！直到所有灯全绿，才算过关！"
          soWhat="记住这个黄金组合：当你以后用 AI 干重要事情时，让 AI 当“出主意的大脑”，再配合“工具/测试/人类核查”当裁判，它就能爆发出不可思议的威力！"
        />
      </section>

      {/* Iconic Pelican Riding a Bicycle Animated Benchmark */}
      <PelicanBikeStage />

      {/* 3 More Mind-Blowing AI Superpowers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#F59E0B]" /> 除了数学，2026 年的 AI 还能干这些神奇的事！
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WOW_CASES.map((item) => (
            <div key={item.id} className="card-playful p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{item.emoji}</span>
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

      {/* Interactive Mini-Game: AI Myth-Buster */}
      <section className="card-playful p-5 sm:p-7 space-y-5">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FDECF4] text-[#BE185D] text-xs font-black border border-[#EC4899]/30 mb-1">
            🎮 真假大挑战
          </span>
          <h2 className="text-xl font-black text-[#1E1B2E]">测测你的 AI 认知：这些事 AI 真的能做到吗？</h2>
          <p className="text-sm text-[#595470]">点选你的判断，看看有没有颠覆你的想象！</p>
        </div>

        <div className="space-y-4">
          {AI_OR_HUMAN_QUIZ.map((q, idx) => {
            const chosen = quizAnswers[q.id]
            const isCorrect = chosen === q.answer
            return (
              <div key={q.id} className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 space-y-3">
                <div className="font-extrabold text-sm sm:text-base text-[#1E1B2E]">
                  {idx + 1}. {q.statement}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {q.options.map((opt) => {
                    const selected = chosen === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectQuiz(q.id, opt.value)}
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
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B57]" />
                    )}
                    <span>
                      <strong>{isCorrect ? '判断神准！' : '哎呀，反转啦！'}</strong> {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch2"
        isCompleted={isCompleted}
        onComplete={onComplete}
        xpReward={150}
        nextLabel="去第 3 关：逛 2026 前沿 AI 英雄图鉴 →"
        onNext={onNext}
      />
    </div>
  )
}
