import { useState, useMemo } from 'react'
import { Eli5Box, CheckpointQuiz, ChapterFooterNav, SectionJumpBar } from '../components/Eli5Card'
import { NEXT_TOKEN_SCENARIOS, CHECKPOINTS } from '../data/courseData'
import { softmaxWithTemperature, sampleIndex, simulateTokenize } from '../lib/llmDemo'
import { useMissionFlags } from '../hooks/useMissionFlags'
import { Dices, Flame, Snowflake, Scissors, AlertTriangle } from 'lucide-react'

const LEGO_COLORS = [
  'bg-[#EEF0FF] border-[#5B4BFF] text-[#3A2EDB]',
  'bg-[#FFF0ED] border-[#FF6B57] text-[#C83726]',
  'bg-[#E8FBF3] border-[#10B981] text-[#047857]',
  'bg-[#FEF6E4] border-[#F59E0B] text-[#B45309]',
  'bg-[#F3EEFF] border-[#8B5CF6] text-[#6D28D9]',
  'bg-[#FDECF4] border-[#EC4899] text-[#BE185D]',
]

export function Chapter1Brain({ isCompleted, onComplete, onNext }) {
  const [flags, mark] = useMissionFlags('ch1')

  // Lab 1A state
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [pickedResult, setPickedResult] = useState(null)

  // Lab 1B state
  const [tokenInput, setTokenInput] = useState('2026年，AI不仅会写诗画画，还协助数学家证明了黎曼猜想！')

  const scenario = NEXT_TOKEN_SCENARIOS[scenarioIdx]

  const candidatesWithProb = useMemo(() => {
    const probs = softmaxWithTemperature(
      scenario.candidates.map((c) => c.baseScore),
      temperature
    )
    return scenario.candidates.map((c, idx) => ({ ...c, prob: probs[idx] }))
  }, [scenario, temperature])

  const handleRoll = () => {
    const idx = sampleIndex(candidatesWithProb.map((c) => c.prob))
    setPickedResult(candidatesWithProb[idx])
    mark('rolled')
  }

  const tokens = useMemo(() => simulateTokenize(tokenInput), [tokenInput])

  const tempLabel =
    temperature <= 0.4
      ? { text: '🧊 保守稳定模式（几乎只选最高概率词——注意：稳定≠一定正确！）', color: '#0369A1' }
      : temperature <= 1.0
      ? { text: '😊 自然均衡模式（既通顺又有一点变化，日常聊天默认档）', color: '#047857' }
      : { text: '🔥 脑洞放飞模式（冷门词也有机会被抽中，灵感多但更容易跑题！）', color: '#C83726' }

  const missions = [
    { id: 'rolled', label: '在实验 1A 里点一次“让 AI 掷骰子猜下一个词”', done: Boolean(flags.rolled) },
    { id: 'tokenized', label: '在实验 1B 切词机里输入或切换一句测试文字', done: Boolean(flags.tokenized) },
    { id: 'quiz', label: '答对底部的“温度与幻觉”通关小测', done: Boolean(flags.quiz) },
  ]

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-2xl bg-[#FFF0ED] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🧠
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#C83726]">第 01 关</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">AI 到底是个啥？</h1>
        </div>
      </div>

      <SectionJumpBar
        items={[
          { id: 'ch1-lab-token', label: '🎲 词语接龙与温度' },
          { id: 'ch1-lab-lego', label: '✂️ 乐高切词机' },
          { id: 'chapter-footer', label: '✅ 通关任务' },
        ]}
        missions={missions}
        isCompleted={isCompleted}
      />

      {/* ELI5 Core */}
      <Eli5Box
        badge="ELI5 核心真相"
        title="大语言模型（LLM）= 读过海量文字的“超级词语接龙高手”"
        accent="#FF6B57"
        what="平时我们聊天的 ChatGPT、Claude、DeepSeek 等大语言模型，核心本领是通过海量阅读统计语言规律，根据你前面给的内容，一步步预测“下一个最合理的词元（Token）”。现代 AI 还加上了人类反馈训练和工具调用，但“逐词预测”依然是它的底子。"
        analogy="想象一个记性超群的小书虫，读遍了童话、菜谱、百科和代码。当你说“床前明月___”时，他脑子里瞬间给候选字打分：“光”排第一！当你问复杂问题时，他其实是在高速做一连串超精密的“词语接龙”。"
        soWhat="懂了这个底层逻辑，你就同时想通了两件事：① 为什么 AI 说话这么自然顺滑（接龙接得太溜了）；② 为什么 AI 有时会“一本正经胡说八道”（遇到没学过或记混的冷门事实，它也会顺着语气硬猜一个听起来很像真的词）！"
      />

      {/* Interactive Lab 1A: Next-Token Prediction */}
      <section id="ch1-lab-token" className="scroll-mt-32 card-playful p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[#1E1B2E]">🎲 词语接龙透视镜 · 温度滑块（Temperature）</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="示例句子">
            {NEXT_TOKEN_SCENARIOS.map((sc, i) => (
              <button
                type="button"
                key={sc.id}
                onClick={() => {
                  setScenarioIdx(i)
                  setPickedResult(null)
                }}
                aria-pressed={scenarioIdx === i}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#1E1B2E] cursor-pointer transition-all ${
                  scenarioIdx === i
                    ? 'bg-[#5B4BFF] text-white shadow-[2px_2px_0_#1E1B2E]'
                    : 'bg-white text-[#1E1B2E] hover:bg-[#FFFBF5]'
                }`}
              >
                场景 {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt sentence box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1E1B2E] text-white font-bold text-base sm:text-lg leading-relaxed">
          <span className="text-[#A5B4FC] text-xs font-extrabold block mb-1">你输入的前半句话：</span>
          <span>{scenario.prefix}</span>
          <span className="inline-block ml-1.5 px-3 py-0.5 rounded-lg bg-[#FF6B57] text-white border border-white/40 animate-pulse">
            {pickedResult ? pickedResult.word : '_____ ？'}
          </span>
        </div>

        {/* Temperature Slider */}
        <div className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 space-y-2">
          <div className="flex items-center justify-between text-sm font-extrabold">
            <span className="inline-flex items-center gap-1 text-[#0369A1]">
              <Snowflake className="w-4 h-4" aria-hidden="true" /> 保守稳定 (0.1)
            </span>
            <label htmlFor="temp-slider" className="px-3 py-0.5 rounded-full bg-white border border-[#1E1B2E] text-xs">
              当前温度 Temperature = <strong>{temperature.toFixed(1)}</strong>
            </label>
            <span className="inline-flex items-center gap-1 text-[#C83726]">
              天马行空 (1.8) <Flame className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
          <input
            id="temp-slider"
            type="range"
            min="0.1"
            max="1.8"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-3 cursor-pointer"
          />
          <div className="text-xs font-bold text-center" style={{ color: tempLabel.color }}>
            {tempLabel.text}
          </div>
        </div>

        {/* Probability Bars */}
        <div className="space-y-2.5">
          <div className="text-xs font-black text-[#595470]">👀 透视 AI 大脑：它给每个候选词算出的“抽中概率”</div>
          {candidatesWithProb.map((item) => {
            const isPicked = pickedResult?.word === item.word
            return (
              <div
                key={item.word}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isPicked
                    ? 'border-[#5B4BFF] bg-[#EEF0FF] shadow-[2px_2px_0_#5B4BFF]'
                    : 'border-[#1E1B2E]/10 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-sm font-bold mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E1B2E]">{item.word}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#595470] font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <span className="font-black text-[#5B4BFF] tabular-nums">{item.prob.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#1E1B2E]/15">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(item.prob, 1.5)}%`,
                      backgroundColor: item.prob > 30 ? '#5B4BFF' : item.prob > 10 ? '#10B981' : '#FF6B57',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Roll Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleRoll}
            className="btn-playful px-6 py-3 rounded-2xl bg-[#FF6B57] text-white font-black text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Dices className="w-5 h-5" aria-hidden="true" />
            <span>让 AI 掷骰子猜下一个词！</span>
          </button>

          <div aria-live="polite" className="flex-1 w-full">
            {pickedResult && (
              <div className="p-3.5 rounded-xl bg-[#FEF6E4] border-2 border-[#F59E0B] text-sm text-[#78350F] animate-pop">
                <strong>AI 抽中了「{pickedResult.word}」：</strong> {pickedResult.comment}
              </div>
            )}
          </div>
        </div>

        {/* Crucial Myth-Busting Callout: Temperature vs Hallucination */}
        <div className="p-4 rounded-2xl bg-[#FFF0ED] border-2 border-[#FF6B57]/45 text-xs sm:text-sm text-[#7C2D12] leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C83726] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-[#9A3412]">新手头号误区：把温度调低，AI 就不会瞎编了吗？不会！</strong>
            <p className="mt-1">
              温度只管<strong>“抽签有多随机”</strong>，不管<strong>“记忆对不对”</strong>。如果问一个 AI 根本没学过的冷门数字或法条，哪怕把温度调到 0.1，它也会<strong>每次都一字不差地给出同一个编出来的答案</strong>——这就是真正的「AI 幻觉」。对付幻觉要靠：给它参考资料、开联网搜索、让它附出处并亲自核对。
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Lab 1B: Token Lego Machine */}
      <section id="ch1-lab-lego" className="scroll-mt-32 card-playful p-5 sm:p-7 space-y-5">
        <h2 className="text-xl font-black text-[#1E1B2E] flex items-center gap-2">
          <Scissors className="w-5 h-5 text-[#10B981]" aria-hidden="true" /> 乐高切词机 · Token 词元实验
        </h2>

        <div className="space-y-3">
          <label htmlFor="token-input" className="sr-only">
            输入要体验切词的句子
          </label>
          <input
            id="token-input"
            type="text"
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.target.value)
              if (e.target.value.trim()) mark('tokenized')
            }}
            placeholder="输入任何你想测试的中英文句子..."
            className="w-full p-3.5 rounded-xl border-2 border-[#1E1B2E] bg-[#FFFBF5] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
          />
          <div className="flex flex-wrap gap-2">
            {[
              '你好 AI，请给我讲个冷笑话！',
              'Hello! Formal verification checks every step.',
              '今天不想上班，想变成一只晒太阳的橘猫 🐱',
            ].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => {
                  setTokenInput(preset)
                  mark('tokenized')
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F3F4F6] hover:bg-[#EEF0FF] text-[#37334D] font-bold cursor-pointer transition-colors"
              >
                试试：“{preset.slice(0, 14)}...”
              </button>
            ))}
          </div>
        </div>

        {/* Lego Blocks Output */}
        <div className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-dashed border-[#1E1B2E]/30 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-extrabold text-[#595470]">
            <span>🧱 教学示意切分结果（真实模型用 BPE 分词，每家切法略有不同）：</span>
            <span className="px-2.5 py-1 rounded-full bg-[#1E1B2E] text-white">
              示意 {tokens.length} 块 Token
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.length === 0 ? (
              <span className="text-sm text-[#6B6685]">在上面随便打几个字，积木就会出现啦！</span>
            ) : (
              tokens.map((tok, i) => (
                <span
                  key={`${tok}-${i}`}
                  className={`px-2.5 py-1 rounded-lg border-2 font-bold text-sm shadow-[2px_2px_0_rgba(30,27,46,0.15)] ${
                    LEGO_COLORS[i % LEGO_COLORS.length]
                  }`}
                >
                  {tok}
                </span>
              ))
            )}
          </div>
          <p className="text-xs text-[#595470]">
            💡 真实的分词器（如 OpenAI 的 tiktoken）会把高频词合成一块，把生僻字或表情符号拆成多个字节块；通常 1 个英文单词 ≈ 1~1.3 个 Token，1 个汉字 ≈ 0.6~2 个 Token。
          </p>
        </div>

        {/* Context Window Mini Comparison */}
        <div className="p-4 rounded-2xl bg-[#EEF0FF]/70 border-2 border-[#5B4BFF]/25 text-sm text-[#2D2A40] leading-relaxed">
          <strong>🪑 顺手秒懂“上下文窗口（Context Window）”：</strong>
          如果每个 Token 是一块积木，那“上下文窗口”就是 AI 面前的<strong>课桌大小</strong>！
          早期 AI 的课桌只能摆几页纸，聊太长就会把开头挤掉忘光；现在的主流模型课桌能摆下十几万到上百万块积木，相当于一次读完几本厚书。不过课桌再大，塞太多无关杂物也会让 AI 分心哦！
        </div>
      </section>

      <CheckpointQuiz
        quiz={CHECKPOINTS.ch1}
        passed={Boolean(flags.quiz) || isCompleted}
        onPass={() => mark('quiz')}
      />

      <ChapterFooterNav
        chapterId="ch1"
        isCompleted={isCompleted}
        onComplete={onComplete}
        missions={missions}
        nextLabel="去第 2 关：看 AI 高光与短板 →"
        onNext={onNext}
      />
    </div>
  )
}

export default Chapter1Brain
