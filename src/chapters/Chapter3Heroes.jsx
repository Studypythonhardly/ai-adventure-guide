import React, { useState } from 'react'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { AI_HEROES, MATCHMAKER_TASKS } from '../data/courseData'
import { Compass, Sparkles } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: '🌟 全部英雄 (9)' },
  { id: 'allround', label: '🌍 海外顶流' },
  { id: 'domestic', label: '🇨🇳 国产之光' },
  { id: 'creative', label: '🎬 视频与造物神器' },
]

export function Chapter3Heroes({ isCompleted, onComplete, onNext }) {
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(MATCHMAKER_TASKS[0].id)

  const visibleHeroes =
    filter === 'all' ? AI_HEROES : AI_HEROES.filter((h) => h.category === filter)

  const activeTask = MATCHMAKER_TASKS.find((t) => t.id === selectedTask)

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#E8FBF3] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          🃏
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#047857]">第 03 关 · 认清 2026 江湖格局</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">2026 前沿 AI 英雄图鉴</h1>
        </div>
      </div>

      <Eli5Box
        badge="小白选 AI 不迷路"
        accent="#10B981"
        what="市面上 AI 名字眼花缭乱，但其实就像“复仇者联盟”：没有哪一个 AI 样样第一，它们各有看家绝活！"
        analogy="就像你装修房子不会只找一个工人：画设计图找设计师、接电线找电工、做柜子找木工。用 AI 也一样——读长合同找 Kimi、写代码和深度思考找 Claude / DeepSeek、看超长视频找 Gemini、拍宠物大片找可灵/即梦、日常语音闲聊找豆包或 GPT！"
        soWhat="看完下面这张 2026 英雄图鉴，以后朋友聊起各种大模型，你不仅全听得懂，还能顺手给别人推荐最趁手的那一个！"
      />

      {/* Interactive Matchmaker Widget */}
      <section className="card-playful p-5 sm:p-7 bg-gradient-to-br from-[#E8FBF3] via-[#FFFFFF] to-[#EEF0FF] space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#5B4BFF]" />
          <div>
            <h2 className="text-xl font-black text-[#1E1B2E]">🎯 “帮我选 AI！” 场景匹配器</h2>
            <p className="text-xs sm:text-sm text-[#595470]">点一个你最想解决的生活问题，立刻告诉你 2026 年该派哪位 AI 出马！</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {MATCHMAKER_TASKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTask(t.id)}
              className={`p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm font-extrabold cursor-pointer transition-all ${
                selectedTask === t.id
                  ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E]'
                  : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTask && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] animate-pop" key={activeTask.id}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black text-[#595470]">🏆 最佳拍档推荐：</span>
              {activeTask.recommended.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 rounded-full bg-[#FEF6E4] text-[#92400E] border-2 border-[#1E1B2E] text-xs font-black"
                >
                  ✨ {name}
                </span>
              ))}
            </div>
            <p className="text-sm sm:text-base text-[#37334D] leading-relaxed">{activeTask.reason}</p>
          </div>
        )}
      </section>

      {/* Filter Tabs */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#10B981]" /> 收藏级 AI 英雄卡牌
          </h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 border-[#1E1B2E] cursor-pointer transition-all ${
                  filter === f.id
                    ? 'bg-[#1E1B2E] text-white shadow-[2px_2px_0_#10B981]'
                    : 'bg-white text-[#1E1B2E] hover:bg-[#FFFBF5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleHeroes.map((hero) => (
            <div key={hero.id} className="card-playful p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]"
                      style={{ backgroundColor: `${hero.color}18` }}
                    >
                      {hero.emoji}
                    </span>
                    <div>
                      <h3 className="font-black text-base text-[#1E1B2E] leading-tight">{hero.name}</h3>
                      <div className="text-xs font-extrabold mt-0.5" style={{ color: hero.color }}>
                        {hero.nickname}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#37334D] border border-[#1E1B2E]/20 shrink-0">
                    {hero.region}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#1E1B2E] bg-[#FFFBF5] p-2.5 rounded-xl border border-[#1E1B2E]/10">
                  “{hero.tagline}”
                </p>

                <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">
                  <strong>🧸 ELI5 形象：</strong>
                  {hero.eli5}
                </p>

                <div>
                  <div className="text-xs font-black text-[#1E1B2E] mb-1.5">🔥 拿手绝活：</div>
                  <ul className="space-y-1 text-xs text-[#37334D]">
                    {hero.bestFor.map((b) => (
                      <li key={b} className="flex items-start gap-1.5">
                        <span className="text-[#10B981] font-black">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stat bars */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-[11px] font-bold text-[#595470]">
                  {[
                    { k: 'chat', label: '聊天写作' },
                    { k: 'code', label: '逻辑代码' },
                    { k: 'media', label: '视听多模态' },
                    { k: 'value', label: '小白亲和/性价比' },
                  ].map((s) => (
                    <div key={s.k}>
                      <div className="flex justify-between">
                        <span>{s.label}</span>
                        <span>{hero.stats[s.k]}</span>
                      </div>
                      <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${hero.stats[s.k]}%`, backgroundColor: hero.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF0FF]/70 border border-[#5B4BFF]/20 text-xs text-[#2D2A40]">
                <strong>💡 小白上手小技巧：</strong> {hero.beginnerTip}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch3"
        isCompleted={isCompleted}
        onComplete={onComplete}
        xpReward={140}
        nextLabel="去第 4 关：AI 咒语学院 →"
        onNext={onNext}
      />
    </div>
  )
}
