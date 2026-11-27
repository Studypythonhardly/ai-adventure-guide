import { useState } from 'react'
import { Eli5Box, CheckpointQuiz, ChapterFooterNav, SectionJumpBar } from '../components/Eli5Card'
import { AI_HEROES, MATCHMAKER_TASKS, CHECKPOINTS } from '../data/courseData'
import { useMissionFlags } from '../hooks/useMissionFlags'
import { Compass, Sparkles, Lightbulb } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: `🌟 全部英雄 (${AI_HEROES.length})` },
  { id: 'allround', label: '🌍 海外通用模型' },
  { id: 'domestic', label: '🇨🇳 国内主流模型' },
  { id: 'creative', label: '🎬 视频与造物工具' },
]

export function Chapter3Heroes({ isCompleted, onComplete, onNext }) {
  const [flags, mark] = useMissionFlags('ch3')
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(MATCHMAKER_TASKS[0].id)

  const visibleHeroes =
    filter === 'all' ? AI_HEROES : AI_HEROES.filter((h) => h.category === filter)

  const activeTask = MATCHMAKER_TASKS.find((t) => t.id === selectedTask)

  const missions = [
    { id: 'matchmaker', label: '在“帮我选 AI”匹配器里点击查看另一个生活问题', done: Boolean(flags.matchmaker) },
    { id: 'filtered', label: '用分类按钮筛选一次英雄卡牌', done: Boolean(flags.filtered) },
    { id: 'checkpoint', label: '答对底部的选型通关小测', done: Boolean(flags.checkpoint) },
  ]

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-2xl bg-[#E8FBF3] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🃏
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">03 · 主流 AI 英雄图鉴</h1>
      </div>

      <SectionJumpBar
        items={[
          { id: 'ch3-matchmaker', label: '🎯 帮我选 AI' },
          { id: 'ch3-cards', label: '🃏 工具卡牌' },
          { id: 'chapter-footer', label: '✅ 通关任务' },
        ]}
        missions={missions}
        isCompleted={isCompleted}
      />

      <Eli5Box
        badge="小白选 AI 不迷路"
        accent="#10B981"
        what="市面上 AI 名字眼花缭乱，但其实就像一个工具箱：没有哪一个 AI 样样第一，它们各有擅长的场景。"
        analogy="就像装修房子不会只找一个师傅：画图找设计师、排线找电工、打柜子找木工。用 AI 也一样——读超长合同找长文本模型、写代码和推理找擅长思考的模型、看长视频找原生多模态模型、拍短片找专门的视频生成工具、爸妈语音聊天找说话自然的手机助手。"
        soWhat="记住“按任务类型挑工具”的思路，就算半年后模型全部出了新版本，你依然能一秒选出最顺手的那一个！"
      />

      {/* Interactive Matchmaker Widget */}
      <section id="ch3-matchmaker" className="scroll-mt-32 card-playful p-5 sm:p-7 bg-gradient-to-br from-[#E8FBF3] via-[#FFFFFF] to-[#EEF0FF] space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#5B4BFF]" aria-hidden="true" />
          <h2 className="text-xl font-black text-[#1E1B2E]">🎯 “帮我选 AI！” 场景匹配器</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5" role="group" aria-label="生活问题列表">
          {MATCHMAKER_TASKS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                setSelectedTask(t.id)
                if (t.id !== MATCHMAKER_TASKS[0].id) mark('matchmaker')
              }}
              aria-pressed={selectedTask === t.id}
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
              <span className="text-xs font-black text-[#595470]">🏆 推荐组合：</span>
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
      <section id="ch3-cards" className="scroll-mt-32 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#10B981]" aria-hidden="true" /> 代表性 AI 工具卡牌
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="英雄分类筛选">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => {
                  setFilter(f.id)
                  if (f.id !== 'all') mark('filtered')
                }}
                aria-pressed={filter === f.id}
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
            <article key={hero.id} className="card-playful p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]"
                      style={{ backgroundColor: `${hero.color}18` }}
                      aria-hidden="true"
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
                  <strong>🧸 形象比喻：</strong>
                  {hero.eli5}
                </p>

                <div>
                  <div className="text-xs font-black text-[#1E1B2E] mb-1.5">🔥 典型擅长场景：</div>
                  <ul className="space-y-1 text-xs text-[#37334D]">
                    {hero.bestFor.map((b) => (
                      <li key={b} className="flex items-start gap-1.5">
                        <span className="text-[#10B981] font-black" aria-hidden="true">•</span>
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
                    { k: 'value', label: '上手友好度' },
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
            </article>
          ))}
        </div>
      </section>

      {/* Evergreen Evaluation Principles */}
      <section className="card-playful p-5 sm:p-6 bg-[#FEF6E4]/70 space-y-3">
        <h2 className="text-lg font-black text-[#1E1B2E] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#B45309]" aria-hidden="true" /> 模型几个月就换代，怎么选才不会过时？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#37334D]">
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15">
            <strong>1. 拿真问题同台比试：</strong>别光看宣传分，把你手头最常干的 1 件活同时发给 2 个 AI，谁更懂你一眼便知。
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15">
            <strong>2. 先看模态与记忆上限：</strong>传整本书/长视频看上下文窗口，做海报/短片找专门的视觉模型，别让文字模型硬干图像活。
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15">
            <strong>3. 敏感内容看隐私条款：</strong>公司机密或个人隐私优先选企业合规版或本地开源模型，不在公共免费窗口裸奔。
          </div>
        </div>
      </section>

      <CheckpointQuiz
        quiz={CHECKPOINTS.ch3}
        passed={Boolean(flags.checkpoint) || isCompleted}
        onPass={() => mark('checkpoint')}
      />

      <ChapterFooterNav
        chapterId="ch3"
        isCompleted={isCompleted}
        onComplete={onComplete}
        missions={missions}
        nextLabel="去第 4 关：AI 咒语学院 →"
        onNext={onNext}
      />
    </div>
  )
}

export default Chapter3Heroes
