import React, { useState } from 'react'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { PROMPT_SCENARIOS } from '../data/courseData'
import { Copy, Check, Wand2, Sparkles } from 'lucide-react'

const BLOCK_META = [
  { key: 'role', label: '🎭 角色 (Role)', desc: '告诉 AI 扮演谁', color: '#8B5CF6' },
  { key: 'task', label: '🎯 任务 (Task)', desc: '具体要它干啥', color: '#FF6B57' },
  { key: 'context', label: '📦 背景 (Context)', desc: '交代你的真实情况', color: '#10B981' },
  { key: 'format', label: '📋 格式 (Format)', desc: '字数/表格/语气要求', color: '#0EA5E9' },
]

const SKILL_CARTRIDGES = [
  {
    id: 'eli5',
    name: '🧒 ELI5 讲人话技能包',
    tag: '本教程正在使用！',
    color: '#5B4BFF',
    inside: '内置规范：① 先判断听众是谁 → ② 一句话说清本质 → ③ 举生活比喻 → ④ 严禁堆砌晦涩黑话',
    userSays: '“解释一下什么是通货膨胀”',
    withoutSkill: '通货膨胀是指在信用货币制度下，流通中的货币数量超过经济实际需要而引起的货币贬值和物价水平全面持续上涨现象。',
    withSkill: '🎯 一句话：钱印得太多了，每张钱能买到的东西变少了。\n🧸 比喻：班里本来只有 10 颗糖和 10 块钱，1 块钱买 1 颗糖；如果突然印了 100 块钱但糖还是 10 颗，现在就得花 10 块钱才能买 1 颗糖啦！\n✨ 跟你关系：只存现金不理财，钱会悄悄“缩水”哦！',
  },
  {
    id: 'audit',
    name: '⚖️ 合同风控审计技能包',
    tag: '法务/商务必备',
    color: '#FF6B57',
    inside: '内置规范：① 逐条扫描违约金/续约/管辖权 → ② 标出高/中风险等级 → ③ 附带可直接复制的修改话术',
    userSays: '“帮我看看这份租房合同有没有问题”',
    withoutSkill: '这份合同整体看起来比较常规，规定了租期、押金和违约条款，建议你仔细阅读后再决定是否签字。',
    withSkill: '🔴 高风险（第 8 条）：提前退租扣 3 个月押金过高，建议改为 1 个月；\n🟡 中风险（第 12 条）：未写明家电自然老化由房东维修；\n💬 谈判话术：“房东您好，合同基本没问题，就是第 8 条和第 12 条咱们按行业惯例微调一下，没问题我今天就能签！”',
  },
  {
    id: 'bi',
    name: '📊 经营复盘分析技能包',
    tag: '团队汇报神器',
    color: '#10B981',
    inside: '内置规范：① 自动算环比/同比 → ② 先给管理层 1 句话结论 → ③ 拆解异常波动 → ④ 给下周可执行动作',
    userSays: '“帮我分析一下这周的数据表”',
    withoutSkill: '本周总数据为 12,480，较上周有所变化，部分指标上升，部分指标下降，整体表现平稳。',
    withSkill: '📌 核心结论：本周整体增长 +18.4%，但周三出现明显流量低谷。\n🔍 异常归因：增长主要由老客复购拉动；周三下滑与活动页入口下线有关。\n🚀 下周动作：① 恢复首页常驻入口；② 针对复购人群加推定向权益。',
  },
]

export function Chapter4Prompt({ isCompleted, onComplete, onNext }) {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [enabled, setEnabled] = useState({
    role: false,
    task: false,
    context: false,
    format: false,
  })
  const [copied, setCopied] = useState(false)
  const [activeSkillId, setActiveSkillId] = useState('eli5')
  const activeSkill = SKILL_CARTRIDGES.find((s) => s.id === activeSkillId) || SKILL_CARTRIDGES[0]

  const scenario = PROMPT_SCENARIOS[scenarioIdx]
  const activeCount = Object.values(enabled).filter(Boolean).length

  const assembledPrompt =
    activeCount === 0
      ? scenario.badPrompt
      : BLOCK_META.filter((m) => enabled[m.key])
          .map((m) => scenario.blocks[m.key])
          .join('\n')

  const outputLevel = activeCount === 0 ? 0 : activeCount === 1 ? 1 : activeCount <= 3 ? 2 : 3
  const simulatedReply = scenario.outputs[outputLevel]

  const toggleBlock = (key) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleAll = (val) => {
    setEnabled({ role: val, task: val, context: val, format: val })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = assembledPrompt
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#F3EEFF] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          ✨
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#7C3AED]">第 04 关 · 掌握核心沟通术</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">AI 咒语学院（Prompt 入门）</h1>
        </div>
      </div>

      <Eli5Box
        badge="ELI5 打破误解"
        accent="#8B5CF6"
        title="为什么别人用的 AI 像大神，你的 AI 像“人工智障”？"
        what="Prompt（提示词）根本不是高深的编程代码，它就是你跟 AI 说的话。差别全在于：你有没有把需求说清楚！"
        analogy="想象你招了一个智商 180、但刚来地球第一天的超级实习生。如果你只对他说“帮我做顿饭”，他可能给你端来一盘生胡萝卜；但如果你说“你是川菜大厨，帮我做一道微辣、10分钟搞定、不放香菜的晚饭，预算 20 块”，他能给你做出米其林水准！"
        soWhat="记住下面这 4 块积木——🎭 角色 + 🎯 任务 + 📦 背景 + 📋 格式（简称 R-T-C-F 万能公式），立刻让你在所有 AI 面前脱胎换骨！"
      />

      {/* Interactive Prompt Alchemy Lab */}
      <section className="card-playful p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#6D28D9] text-xs font-black border border-[#8B5CF6]/30 mb-1">
              🎮 互动实验：咒语炼金工坊
            </span>
            <h2 className="text-xl font-black text-[#1E1B2E]">点亮 4 块魔法积木，亲眼看 AI 回答如何脱胎换骨！</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => {
                  setScenarioIdx(i)
                  toggleAll(false)
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 border-[#1E1B2E] cursor-pointer transition-all ${
                  scenarioIdx === i
                    ? 'bg-[#8B5CF6] text-white shadow-[2px_2px_0_#1E1B2E]'
                    : 'bg-white text-[#1E1B2E] hover:bg-[#FFFBF5]'
                }`}
              >
                {sc.emoji} {sc.title}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Lego Switches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-[#595470]">👇 点击开关，给你的咒语加上“魔法积木”：</span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleAll(false)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#37334D] cursor-pointer"
              >
                全部关闭（小白敷衍版）
              </button>
              <button
                onClick={() => toggleAll(true)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#8B5CF6] text-white cursor-pointer"
              >
                ✨ 一键全开（大师满分版）
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BLOCK_META.map((m) => {
              const on = enabled[m.key]
              return (
                <button
                  key={m.key}
                  onClick={() => toggleBlock(m.key)}
                  className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    on
                      ? 'border-[#1E1B2E] text-white shadow-[3px_3px_0_#1E1B2E] -translate-y-0.5'
                      : 'border-[#1E1B2E]/20 bg-[#FFFBF5] text-[#1E1B2E] hover:border-[#1E1B2E]'
                  }`}
                  style={on ? { backgroundColor: m.color } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{m.label}</span>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                        on ? 'bg-white/25 text-white' : 'bg-[#E5E7EB] text-[#595470]'
                      }`}
                    >
                      {on ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${on ? 'text-white/90' : 'text-[#595470]'}`}>{m.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Your Prompt */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1E1B2E] text-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#A5B4FC] inline-flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" /> 你发给 AI 的话（魔法等级：{activeCount}/4）
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制！' : '复制去真 AI 试'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#F8FAFC] bg-white/10 p-3.5 rounded-xl border border-white/15">
                {assembledPrompt}
              </pre>
            </div>
            <div className="text-xs text-[#C7D2FE]">
              {activeCount === 0
                ? '😴 这样问太笼统啦！试着点亮上面几个积木块看看变化！'
                : activeCount < 4
                ? '🚀 越来越清楚了！再多点亮几个积木，效果会更惊艳！'
                : '🔥 完美咒语！复制这段话发给任何 AI，都会给你惊艳答复！'}
            </div>
          </div>

          {/* AI Output */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-2 ${
              outputLevel === 3
                ? 'bg-[#E8FBF3] border-[#10B981]'
                : outputLevel === 0
                ? 'bg-[#FFF0ED] border-[#FF6B57]'
                : 'bg-[#FFFBF5] border-[#1E1B2E]/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1E1B2E]">🤖 AI 的回复效果预览</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-[#1E1B2E]/20">
                {['🥱 敷衍机器人', '🙂 勉强能用', '👍 靠谱实习生', '👑 顶级专家级'][outputLevel]}
              </span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-[#1E1B2E] bg-white/85 p-3.5 rounded-xl border border-[#1E1B2E]/10">
              {simulatedReply}
            </pre>
          </div>
        </div>
      </section>

      {/* 3 Bonus Pro Tricks */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#8B5CF6]" /> 顺手带走 3 个“隐藏外挂神技”
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-playful p-5 space-y-2">
            <div className="text-2xl">📝</div>
            <h3 className="font-black text-base text-[#1E1B2E]">神技 1：给它打个样（Few-Shot）</h3>
            <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">
              不知道怎么形容你想要的风格？直接贴 1~2 篇你喜欢的范文，说一句：
              <strong>“请完全模仿上面这两段的语气和排版，帮我写一篇新的！”</strong> 比解释半小时管用 10 倍！
            </p>
          </div>
          <div className="card-playful p-5 space-y-2">
            <div className="text-2xl">🧩</div>
            <h3 className="font-black text-base text-[#1E1B2E]">神技 2：让它“一步步想”（思维链）</h3>
            <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">
              遇到算账、做规划、逻辑推理题，在最后加上一句：
              <strong>“别急着给结论，请一步一步列出你的思考过程再回答。”</strong> AI 的智商瞬间飙升！
            </p>
          </div>
          <div className="card-playful p-5 space-y-2">
            <div className="text-2xl">🔍</div>
            <h3 className="font-black text-base text-[#1E1B2E]">神技 3：让 AI 自己挑自己刺！</h3>
            <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">
              拿到第一版结果不满意？千万别放弃！直接追问它：
              <strong>“请站在挑剔读者的角度，找出你刚才回答里的 3 个缺点，然后重写一版更惊艳的！”</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Interactive AI Skill Cartridge Playground */}
      <section className="card-playful p-5 sm:p-7 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#E8FBF3] space-y-5">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#1E1B2E] text-white text-xs font-black mb-1.5">
            🧩 2026 进阶必懂：AI Skill（技能包）
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
            每次都要重写一大段咒语太累？给 AI 插上「Skill 技能卡带」！
          </h2>
          <p className="text-xs sm:text-sm text-[#45405C] mt-1 leading-relaxed">
            <strong>🧸 ELI5 秒懂：</strong>如果说 Prompt 是你每次临时口头交代要求，那 <strong>Skill（技能包）</strong> 就像游戏机里的<strong>专业卡带</strong>——把你最满意的工作步骤（SOP）、模板和脚本打包存好，以后只需说一句大白话，AI 就会自动“插卡”按专家标准干活！
          </p>
        </div>

        {/* Clickable Skill Cartridges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SKILL_CARTRIDGES.map((sk) => {
            const selected = activeSkillId === sk.id
            return (
              <button
                key={sk.id}
                onClick={() => setActiveSkillId(sk.id)}
                className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  selected
                    ? 'text-white border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] -translate-y-0.5'
                    : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
                }`}
                style={selected ? { backgroundColor: sk.color } : undefined}
              >
                <div className="font-black text-sm">{sk.name}</div>
                <div className={`text-[11px] font-bold mt-1 ${selected ? 'text-white/90' : 'text-[#595470]'}`}>
                  {sk.tag}
                </div>
              </button>
            )
          })}
        </div>

        {/* Before vs After Skill Comparison */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#1E1B2E]/15 space-y-3 animate-pop" key={activeSkill.id}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-black text-[#1E1B2E]">💬 你只说了一句偷懒的话：{activeSkill.userSays}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#3A2EDB] font-bold">
              {activeSkill.inside}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#FFF0ED] border border-[#FF6B57]/35 space-y-1.5">
              <div className="text-xs font-black text-[#C83726]">😴 没挂载 Skill（普通泛泛回答）</div>
              <p className="text-xs sm:text-sm text-[#45405C] leading-relaxed">{activeSkill.withoutSkill}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#E8FBF3] border-2 border-[#10B981] space-y-1.5">
              <div className="text-xs font-black text-[#047857]">🚀 挂载「{activeSkill.name}」后</div>
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#064E3B] leading-relaxed">
                {activeSkill.withSkill}
              </pre>
            </div>
          </div>
        </div>

        {/* Golden 3-Way Comparison: Prompt vs Skill vs MCP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15">
            <div className="font-black text-[#8B5CF6] mb-1">✨ Prompt（提示词）</div>
            <div className="text-[#45405C] leading-relaxed">临时口头交代一次活儿，适合随手提问、单次沟通。</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFBF5] border-2 border-[#5B4BFF]/35">
            <div className="font-black text-[#5B4BFF] mb-1">🧩 Skill（技能包）</div>
            <div className="text-[#45405C] leading-relaxed">给 AI 装进脑子的<strong>专业 SOP 秘籍</strong>，让好方法永久复用、团队共享！</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFBF5] border-2 border-[#10B981]/35">
            <div className="font-black text-[#047857] mb-1">🔌 MCP（万能接口）</div>
            <div className="text-[#45405C] leading-relaxed">给 AI 装上的<strong>手脚和插座</strong>，让它能直接连上日历、表格、数据库去干活！</div>
          </div>
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch4"
        isCompleted={isCompleted}
        onComplete={onComplete}
        xpReward={160}
        nextLabel="去第 5 关：动手零代码做个网页！ →"
        onNext={onNext}
      />
    </div>
  )
}
