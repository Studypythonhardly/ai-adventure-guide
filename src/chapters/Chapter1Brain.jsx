import React, { useState, useMemo } from 'react'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { NEXT_TOKEN_SCENARIOS } from '../data/courseData'
import { Dices, Flame, Snowflake, Scissors } from 'lucide-react'

const LEGO_COLORS = [
  'bg-[#EEF0FF] border-[#5B4BFF] text-[#3A2EDB]',
  'bg-[#FFF0ED] border-[#FF6B57] text-[#C83726]',
  'bg-[#E8FBF3] border-[#10B981] text-[#047857]',
  'bg-[#FEF6E4] border-[#F59E0B] text-[#B45309]',
  'bg-[#F3EEFF] border-[#8B5CF6] text-[#6D28D9]',
  'bg-[#FDECF4] border-[#EC4899] text-[#BE185D]',
]

// 教学用简易拟真 Token 切词器（把中文词组、英文单词、数字、标点切成积木块）
function simulateTokenize(text) {
  if (!text) return []
  const matches = text.match(/([a-zA-Z]{1,6}|[0-9]+|[\u4e00-\u9fa5]{1,2}|[^\s])/gu)
  return matches || []
}

export function Chapter1Brain({ isCompleted, onComplete, onNext }) {
  // Lab 1A state
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [pickedResult, setPickedResult] = useState(null)

  // Lab 1B state
  const [tokenInput, setTokenInput] = useState('2026年，AI不仅会写诗画画，还帮数学家攻破了黎曼猜想！')

  const scenario = NEXT_TOKEN_SCENARIOS[scenarioIdx]

  // Softmax calculation based on Temperature
  const candidatesWithProb = useMemo(() => {
    const t = Math.max(0.1, temperature)
    const exps = scenario.candidates.map((c) => Math.exp(c.baseScore / t))
    const sum = exps.reduce((a, b) => a + b, 0)
    return scenario.candidates.map((c, idx) => ({
      ...c,
      prob: (exps[idx] / sum) * 100,
    }))
  }, [scenario, temperature])

  const handleRoll = () => {
    const r = Math.random() * 100
    let acc = 0
    let chosen = candidatesWithProb[0]
    for (const item of candidatesWithProb) {
      acc += item.prob
      if (r <= acc) {
        chosen = item
        break
      }
    }
    setPickedResult(chosen)
  }

  const tokens = useMemo(() => simulateTokenize(tokenInput), [tokenInput])

  const tempLabel =
    temperature <= 0.4
      ? { text: '🧊 严谨学霸模式（稳重准确，绝不瞎编）', color: '#0EA5E9' }
      : temperature <= 1.0
      ? { text: '😊 自然均衡模式（像聪明人正常聊天）', color: '#10B981' }
      : { text: '🔥 脑洞大开模式（创意爆棚，但也容易胡说八道！）', color: '#FF6B57' }

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#FFF0ED] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          🧠
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#FF6B57]">第 01 关 · 揭开神秘面纱</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">AI 到底是个啥？</h1>
        </div>
      </div>

      {/* ELI5 Core */}
      <Eli5Box
        badge="ELI5 核心真相"
        title="大语言模型（LLM）= 读完人类所有图书馆的“超级词语接龙大师”"
        accent="#FF6B57"
        what="平时我们聊天的 ChatGPT、Claude、DeepSeek 等 AI，本质上是一个通过海量阅读学会了语言规律，能根据你前面说的话，飞快预测“下一个最合理的词”的超级大脑。"
        analogy="想象一个过目不忘的小天才，他把全世界所有的童话书、菜谱、小说、维基百科和代码都读了一遍。当你说“床前明月___”时，他脑子里瞬间算出来：99.9% 的概率下一个字是“光”！当你问复杂问题时，他其实是在一字一字地做超级高级的“词语接龙”！"
        soWhat="懂了这个原理，你就立刻明白了两件大事：① 为什么 AI 写文章、聊天这么顺滑（接龙接得太溜了）；② 为什么 AI 有时会“一本正经胡说八道”（遇到没见过的冷门问题，它也在硬猜下一个最像人话的词）！"
      />

      {/* Interactive Lab 1A: Next-Token Prediction */}
      <section className="card-playful p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B4BFF] text-xs font-black border border-[#5B4BFF]/30 mb-1">
              🎮 互动实验 1A
            </span>
            <h2 className="text-xl font-black text-[#1E1B2E]">词语接龙透视镜 + 脑洞滑块（Temperature）</h2>
            <p className="text-sm text-[#595470]">
              拖动下面的“温度滑块”，看看 AI 脑子里每个候选词的概率是怎么实时变化的！
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {NEXT_TOKEN_SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => {
                  setScenarioIdx(i)
                  setPickedResult(null)
                }}
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
            <span className="inline-flex items-center gap-1 text-[#0EA5E9]">
              <Snowflake className="w-4 h-4" /> 严谨保守 (0.1)
            </span>
            <span className="px-3 py-0.5 rounded-full bg-white border border-[#1E1B2E] text-xs">
              当前温度 Temperature = <strong>{temperature.toFixed(1)}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-[#FF6B57]">
              天马行空 (1.8) <Flame className="w-4 h-4" />
            </span>
          </div>
          <input
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
          <div className="text-xs font-black text-[#595470]">👀 透视 AI 大脑：它给每个候选词打出的“选中概率”</div>
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
            onClick={handleRoll}
            className="btn-playful px-6 py-3 rounded-2xl bg-[#FF6B57] text-white font-black text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Dices className="w-5 h-5" />
            <span>让 AI 掷骰子猜下一个词！</span>
          </button>

          {pickedResult && (
            <div className="flex-1 p-3.5 rounded-xl bg-[#FEF6E4] border-2 border-[#F59E0B] text-sm text-[#78350F] animate-pop">
              <strong>AI 抽中了「{pickedResult.word}」：</strong> {pickedResult.comment}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Lab 1B: Token Lego Machine */}
      <section className="card-playful p-5 sm:p-7 space-y-5">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8FBF3] text-[#047857] text-xs font-black border border-[#10B981]/30 mb-1">
            🎮 互动实验 1B
          </span>
          <h2 className="text-xl font-black text-[#1E1B2E] flex items-center gap-2">
            <Scissors className="w-5 h-5 text-[#10B981]" /> 乐高切词机（秒懂什么是 Token）
          </h2>
          <p className="text-sm text-[#595470] mt-1">
            AI 看文字不是按“个”看，而是把句子切成一小块一小块的<strong>积木（Token 词元）</strong>！随便输入一句话试试：
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="输入任何你想测试的中英文句子..."
            className="w-full p-3.5 rounded-xl border-2 border-[#1E1B2E] bg-[#FFFBF5] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
          />
          <div className="flex flex-wrap gap-2">
            {[
              '你好 AI，请给我讲个冷笑话！',
              'Hello 2026! AI helps solve Riemann Hypothesis!',
              '今天不想上班，想变成一只晒太阳的橘猫 🐱',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setTokenInput(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F3F4F6] hover:bg-[#EEF0FF] text-[#37334D] font-bold cursor-pointer transition-colors"
              >
                试试：“{preset.slice(0, 14)}...”
              </button>
            ))}
          </div>
        </div>

        {/* Lego Blocks Output */}
        <div className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-dashed border-[#1E1B2E]/30">
          <div className="flex items-center justify-between mb-3 text-xs font-extrabold text-[#595470]">
            <span>🧱 AI 眼里切成的“文字积木块”：</span>
            <span className="px-2.5 py-1 rounded-full bg-[#1E1B2E] text-white">
              约 {tokens.length} 个 Token 积木
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.length === 0 ? (
              <span className="text-sm text-[#8E89A6]">在上面随便打几个字，积木就会出现啦！</span>
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
        </div>

        {/* Context Window Mini Comparison */}
        <div className="p-4 rounded-2xl bg-[#EEF0FF]/70 border-2 border-[#5B4BFF]/25 text-sm text-[#2D2A40] leading-relaxed">
          <strong>🪑 顺手秒懂“上下文窗口（Context Window）”：</strong>
          如果每个 Token 是一块积木，那“上下文窗口”就是 AI 面前的<strong>课桌大小</strong>！
          2023 年的早期 AI 课桌只能摆几页作文；而 2026 年的前沿 AI（如 Gemini、Claude、Kimi）课桌大得像<strong>图书馆大厅</strong>，一次能同时摊开几十万甚至上百万块积木——相当于一口气读完好几本《三体》还不忘开头！
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch1"
        isCompleted={isCompleted}
        onComplete={onComplete}
        xpReward={120}
        nextLabel="去第 2 关：围观 AI 攻破黎曼猜想 →"
        onNext={onNext}
      />
    </div>
  )
}
