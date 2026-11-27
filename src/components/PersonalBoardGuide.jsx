import { useState } from 'react'
import { Copy, Check, MessageCircle, ArrowRight } from 'lucide-react'
import { copyText } from '../lib/browser'

const ITERATION_ROUNDS = [
  {
    round: 1,
    stepName: '第 1 轮 · 先出草稿',
    goal: '不用想太全，先让 AI 做出一个能看、能加内容的雏形',
    humanPrompt:
      '我手里这周要跟进的事太多，老容易忘。帮我做一个打开浏览器就能用的个人排期看板，分成「还没做」「正在做」「做完了」三栏，我自己能随时往里加事项。',
    tip: '完全不用说“写代码”“做前端”，只说你想要几栏、放什么内容就行。',
    features: { stats: false, moveBtn: false, filter: false, autoSave: false },
  },
  {
    round: 2,
    stepName: '第 2 轮 · 补齐顺手操作',
    goal: '看一眼雏形，觉得哪不方便就顺口让 AI 改',
    humanPrompt:
      '挺清楚的！但我想最上面一眼就能看到一共几件事、完成了多少；另外每件事下面加个按钮，点一下就能把它移到下一栏，不用删了重写。',
    tip: '好工具都是“用着改出来的”，每次只提 1～2 个小改动，AI 改得最准。',
    features: { stats: true, moveBtn: true, filter: false, autoSave: false },
  },
  {
    round: 3,
    stepName: '第 3 轮 · 换成你的真实业务',
    goal: '把零散笔记、产品分析或汇报内容直接扔进去',
    humanPrompt:
      '顺便帮我把这几条产品分析记进去：① 新手第2步流失偏高（高优）② 对比竞品A/B定价（竞品）③ 老客复购涨了18%（亮点）。上面再加个按标签筛选，汇报时我想只看「高优」。',
    tip: '排期、产品分析、作品展示都能套这一招——直接把微信备忘录贴给 AI 帮你归类。',
    features: { stats: true, moveBtn: true, filter: true, autoSave: false },
  },
  {
    round: 4,
    stepName: '第 4 轮 · 解决“关掉就没了”',
    goal: '用大白话提保存需求，不必懂任何技术名词',
    humanPrompt:
      '我刚才刷新了一下网页，新加的内容全没了！能不能让我每次改完都自动记住，关掉电脑明天再打开东西还在？另外给我一个双击就能打开的文件，我放桌面上每天用。',
    tip: '不用去背什么“localStorage”，只要说“关掉明天打开还在”，AI 自己就知道怎么实现！',
    features: { stats: true, moveBtn: true, filter: true, autoSave: true },
  },
]

const SAMPLE_CARDS = [
  { id: 1, text: '新手第 2 步流失偏高', tag: '高优', col: 0 },
  { id: 2, text: '对比竞品 A/B 定价差异', tag: '竞品', col: 1 },
  { id: 3, text: '老客复购占比 +18%', tag: '亮点', col: 2 },
]

export function PersonalBoardGuide({ onJumpToStudio }) {
  const [roundIdx, setRoundIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const [onlyHigh, setOnlyHigh] = useState(false)

  const current = ITERATION_ROUNDS[roundIdx]
  const f = current.features
  const visibleCards = f.filter && onlyHigh ? SAMPLE_CARDS.filter((c) => c.tag === '高优') : SAMPLE_CARDS

  const handleCopy = async () => {
    if (await copyText(current.humanPrompt)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <section
      id="ch5-board-guide"
      className="scroll-mt-32 card-playful p-5 sm:p-7 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#FEF6E4] space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
            📊 重点实例：业务小白怎么 4 轮“聊”出一个个人看板？
          </h2>
          <p className="text-sm text-[#45405C] mt-1">
            做个人排期、产品分析或作品展示，<strong>不用一上来写很长的专业指令</strong>——像聊天一样提需求，一轮轮改就行：
          </p>
        </div>
        {onJumpToStudio && (
          <button
            type="button"
            onClick={onJumpToStudio}
            className="btn-playful px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-black inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>下面直接试做</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* 4 Round Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="tablist" aria-label="4 轮对话迭代过程">
        {ITERATION_ROUNDS.map((r, idx) => (
          <button
            key={r.round}
            type="button"
            role="tab"
            aria-selected={roundIdx === idx}
            onClick={() => {
              setRoundIdx(idx)
              if (!r.features.filter) setOnlyHigh(false)
            }}
            className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-colors transition-transform ${
              roundIdx === idx
                ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[3px_3px_0_#5B4BFF]'
                : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
            }`}
          >
            <div className="text-xs font-black">{r.stepName}</div>
          </button>
        ))}
      </div>

      {/* Split View: Left = Plain-Chinese Chat | Right = Live Evolving Mini Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch" key={current.round}>
        {/* Left: Human Chat Prompt */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#1E1B2E] text-white flex flex-col justify-between space-y-4 animate-pop">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#A5B4FC] inline-flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> 你只需要这样跟 AI 说
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制这句'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-sm leading-relaxed text-[#F8FAFC]">
              “{current.humanPrompt}”
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 text-xs text-[#FDE68A] leading-relaxed">
            💡 <strong>为什么这样说有效：</strong>
            {current.tip}
          </div>
        </div>

        {/* Right: Evolving Mini-Board Preview */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1E1B2E] shadow-[4px_4px_0_#1E1B2E] flex flex-col justify-between space-y-3 animate-pop">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-black text-sm text-[#1E1B2E]">
                👀 第 {current.round} 轮后，你的个人看板变成了这样：
              </span>
              {f.autoSave && (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#E8FBF3] text-[#047857] border border-[#10B981]">
                  💾 已自动记住，关掉明天还在
                </span>
              )}
            </div>

            {/* Round 2+: Top Stats Strip */}
            {f.stats && (
              <div className="grid grid-cols-3 gap-2 animate-pop">
                <div className="p-2 rounded-xl bg-[#EEF0FF] text-center">
                  <div className="text-base font-black text-[#5B4BFF]">3</div>
                  <div className="text-[11px] font-bold text-[#45405C]">总事项</div>
                </div>
                <div className="p-2 rounded-xl bg-[#FEF6E4] text-center">
                  <div className="text-base font-black text-[#B45309]">1</div>
                  <div className="text-[11px] font-bold text-[#45405C]">正在做</div>
                </div>
                <div className="p-2 rounded-xl bg-[#E8FBF3] text-center">
                  <div className="text-base font-black text-[#047857]">33%</div>
                  <div className="text-[11px] font-bold text-[#45405C]">已完成</div>
                </div>
              </div>
            )}

            {/* Round 3+: Tag Filter */}
            {f.filter && (
              <div className="flex items-center gap-2 text-xs animate-pop">
                <button
                  type="button"
                  onClick={() => setOnlyHigh(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                    !onlyHigh ? 'bg-[#1E1B2E] text-white border-[#1E1B2E]' : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/20'
                  }`}
                >
                  全部
                </button>
                <button
                  type="button"
                  onClick={() => setOnlyHigh(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                    onlyHigh ? 'bg-[#FF6B57] text-white border-[#1E1B2E]' : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/20'
                  }`}
                >
                  只看「高优」
                </button>
              </div>
            )}

            {/* 3 Columns */}
            <div className="grid grid-cols-3 gap-2">
              {['还没做', '正在做', '做完了'].map((colName, ci) => {
                const items = visibleCards.filter((c) => c.col === ci)
                return (
                  <div key={colName} className="p-2.5 rounded-xl bg-[#FFFBF5] border border-[#1E1B2E]/15 space-y-2">
                    <div className="text-xs font-black text-[#1E1B2E]">{colName}</div>
                    {items.map((card) => (
                      <div key={card.id} className="p-2 rounded-lg bg-white border border-[#1E1B2E]/15 space-y-1.5">
                        <div className="text-xs font-bold text-[#1E1B2E] leading-snug">{card.text}</div>
                        <div className="flex items-center justify-between gap-1">
                          {f.filter && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#EEF0FF] text-[#5B4BFF]">
                              {card.tag}
                            </span>
                          )}
                          {f.moveBtn && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#1E1B2E] text-white">
                              → 下一栏
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <div className="text-[11px] text-[#8E89A6]">暂无</div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Next Round Button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E1B2E]/10 text-xs font-bold text-[#595470]">
            <span>{current.goal}</span>
            {roundIdx < ITERATION_ROUNDS.length - 1 && (
              <button
                type="button"
                onClick={() => setRoundIdx((i) => i + 1)}
                className="px-3 py-1 rounded-lg bg-[#5B4BFF] text-white font-black cursor-pointer shrink-0"
              >
                看第 {roundIdx + 2} 轮怎么改 →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
