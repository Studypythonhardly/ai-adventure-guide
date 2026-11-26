import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { VIBE_PROJECTS, VIBE_THEMES, generateStandaloneHTML } from '../data/vibeTemplates'
import { Download, Copy, Check, Sparkles, Play, Pause, RotateCcw, Plus, Wand2 } from 'lucide-react'

export function Chapter5Maker({ isCompleted, onComplete, onNext }) {
  const [projectId, setProjectId] = useState('wheel')
  const [themeId, setThemeId] = useState('indigo')
  const [isBuilding, setIsBuilding] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [downloadedOnce, setDownloadedOnce] = useState(false)

  // Per-project editable configs
  const [wheelTitle, setWheelTitle] = useState('今天中午吃什么？')
  const [wheelItems, setWheelItems] = useState([
    '红烧牛肉面',
    '麻辣香锅',
    '轻食沙拉',
    '猪脚饭',
    '回转寿司',
    '黄焖鸡米饭',
  ])
  const [newFood, setNewFood] = useState('')
  const [wheelResult, setWheelResult] = useState('点击下方按钮开始抽选！')
  const [spinning, setSpinning] = useState(false)

  const [pomoTitle, setPomoTitle] = useState('我的超级专注番茄钟')
  const [pomoMinutes, setPomoMinutes] = useState(25)
  const [pomoSec, setPomoSec] = useState(25 * 60)
  const [pomoMode, setPomoMode] = useState('focus') // 'focus' | 'break'
  const [pomoRunning, setPomoRunning] = useState(false)
  const [pomoCount, setPomoCount] = useState(0)
  const [pomoDoneMsg, setPomoDoneMsg] = useState('')

  const [cardTitle, setCardTitle] = useState('祝你每天都像抽中隐藏款一样开心！')
  const [cardSender, setCardSender] = useState('刚学会 AI 的未来造物主')
  const [cardMessage, setCardMessage] = useState(
    '这是我用 AI 零代码亲手做的第一张电子贺卡！愿你烦恼清零，好运爆棚，天天吃好睡好～'
  )
  const [cardOpened, setCardOpened] = useState(false)

  const [enableConfetti, setEnableConfetti] = useState(true)

  const spinRef = useRef(null)

  const theme = VIBE_THEMES.find((t) => t.id === themeId) || VIBE_THEMES[0]
  const project = VIBE_PROJECTS.find((p) => p.id === projectId) || VIBE_PROJECTS[0]
  const isDark = theme.id === 'cyber'

  // Pomodoro tick effect
  useEffect(() => {
    if (!pomoRunning) return
    const timer = setInterval(() => {
      setPomoSec((s) => {
        if (s <= 1) {
          clearInterval(timer)
          setPomoRunning(false)
          if (pomoMode === 'focus') {
            setPomoCount((c) => c + 1)
            setPomoDoneMsg('🎉 太棒了！完成一颗专注番茄，休息一下吧！')
          } else {
            setPomoDoneMsg('☕ 5 分钟休息结束！元气满满，准备下一轮专注～')
          }
          if (enableConfetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [pomoRunning, pomoMode, enableConfetti])

  useEffect(() => {
    return () => {
      if (spinRef.current) clearInterval(spinRef.current)
    }
  }, [])

  const triggerBuildEffect = () => {
    if (spinRef.current) {
      clearInterval(spinRef.current)
      spinRef.current = null
      setSpinning(false)
    }
    setIsBuilding(true)
    setTimeout(() => setIsBuilding(false), 550)
  }

  const handleSpin = () => {
    if (spinning || wheelItems.length === 0) return
    setSpinning(true)
    let ticks = 0
    spinRef.current = setInterval(() => {
      setWheelResult(wheelItems[Math.floor(Math.random() * wheelItems.length)])
      ticks++
      if (ticks > 16) {
        clearInterval(spinRef.current)
        const finalPick = wheelItems[Math.floor(Math.random() * wheelItems.length)]
        setWheelResult(`🎉 就决定吃：${finalPick}！`)
        setSpinning(false)
        if (enableConfetti) confetti({ particleCount: 65, spread: 65, origin: { y: 0.65 } })
      }
    }, 70)
  }

  const handleAddFood = () => {
    const v = newFood.trim()
    if (!v) return
    setWheelItems((prev) => [...prev, v])
    setNewFood('')
  }

  const getCurrentConfig = () => ({
    title: projectId === 'wheel' ? wheelTitle : projectId === 'pomodoro' ? pomoTitle : cardTitle,
    items: wheelItems,
    minutes: pomoMinutes,
    sender: cardSender,
    message: cardMessage,
    confetti: enableConfetti,
    themeName: theme.name,
  })

  const handleDownloadHTML = () => {
    const html = generateStandaloneHTML(projectId, getCurrentConfig(), theme)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `我的AI作品-${project.name}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setDownloadedOnce(true)
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.65 } })
  }

  const handleCopyPrompt = async () => {
    const text = project.realPrompt(getCurrentConfig())
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 1800)
    } catch {
      // ignore
    }
  }

  const fmtClock = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#FDECF4] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          🛠️
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#DB2777]">第 05 关 · 真正用 AI 做个东西</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">动手造物工坊（Vibe Coding 体验）</h1>
        </div>
      </div>

      <Eli5Box
        badge="2026 最爽新技能：氛围编程"
        accent="#EC4899"
        title="不会写一行代码，也能亲手做出真正能跑的软件！"
        what="Vibe Coding（氛围编程）就是：你当“甲方总导演”，用大白话告诉 AI 你想要什么功能、什么颜色，AI 施工队几秒钟就给你把真正能用的网页/小工具做出来！"
        analogy="就像去定制蛋糕：你不需要自己学打发奶油和烤胚子，你只要跟蛋糕师说“我要一个星空紫色的、上面写着祝你开心、切开还会爆浆的蛋糕”，就能直接提货！"
        soWhat="下面就是一个真实可用的造物沙盒！挑一个你喜欢的小作品，用大白话改改配置，右边就能立刻试玩——还能一键下载成真正的 .html 网页文件，双击发给朋友炫耀！"
      />

      {/* Project Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VIBE_PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setProjectId(p.id)
              triggerBuildEffect()
            }}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
              projectId === p.id
                ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[4px_4px_0_#EC4899]'
                : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/25 hover:border-[#1E1B2E]'
            }`}
          >
            <div className="text-2xl mb-1">{p.emoji}</div>
            <div className="font-black text-base">{p.name}</div>
            <div className={`text-xs mt-0.5 ${projectId === p.id ? 'text-white/80' : 'text-[#595470]'}`}>
              {p.tagline}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Split Studio */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Plain-Chinese AI Instruction Panel */}
        <div className="lg:col-span-5 card-playful p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-lg text-[#1E1B2E] flex items-center gap-1.5">
              <Wand2 className="w-5 h-5 text-[#EC4899]" /> 给 AI 下大白话指令
            </h2>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#FDECF4] text-[#BE185D]">
              无需写代码
            </span>
          </div>

          {/* Theme Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#595470] block">1️⃣ 换一套你喜欢的皮肤配色：</label>
            <div className="grid grid-cols-2 gap-2">
              {VIBE_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id)
                    triggerBuildEffect()
                  }}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-extrabold flex items-center gap-2 cursor-pointer ${
                    themeId === t.id
                      ? 'border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] bg-[#FFFBF5]'
                      : 'border-[#1E1B2E]/15 bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-[#1E1B2E] shrink-0"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Specific Controls */}
          {projectId === 'wheel' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">2️⃣ 改一下大转盘标题：</label>
                <input
                  value={wheelTitle}
                  onChange={(e) => setWheelTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">3️⃣ 加一个你最爱吃的菜：</label>
                <div className="flex gap-2">
                  <input
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                    placeholder="比如：潮汕牛肉火锅"
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm focus:outline-none focus:border-[#5B4BFF]"
                  />
                  <button
                    onClick={handleAddFood}
                    className="btn-playful px-3 py-2 rounded-xl bg-[#10B981] text-white font-black text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> 添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {projectId === 'pomodoro' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">2️⃣ 给你的番茄钟起个名字：</label>
                <input
                  value={pomoTitle}
                  onChange={(e) => setPomoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">
                  3️⃣ 专注时长：<strong>{pomoMinutes} 分钟</strong>
                </label>
                <div className="flex gap-2">
                  {[1, 15, 25, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setPomoMode('focus')
                        setPomoMinutes(m)
                        setPomoSec(m * 60)
                        setPomoRunning(false)
                        setPomoDoneMsg('')
                      }}
                      className={`flex-1 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer ${
                        pomoMinutes === m && pomoMode === 'focus'
                          ? 'bg-[#5B4BFF] text-white border-[#1E1B2E]'
                          : 'bg-white border-[#1E1B2E]/20'
                      }`}
                    >
                      {m}分钟
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {projectId === 'ecard' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">2️⃣ 贺卡大标题：</label>
                <input
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">3️⃣ 想对朋友说的话：</label>
                <textarea
                  rows={3}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-black text-[#595470] block mb-1">4️⃣ 你的专属落款：</label>
                <input
                  value={cardSender}
                  onChange={(e) => setCardSender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
            </div>
          )}

          {/* Extra Magic Toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 cursor-pointer">
            <span className="text-xs font-extrabold text-[#1E1B2E]">🎊 加上“撒花彩带庆祝特效”</span>
            <input
              type="checkbox"
              checked={enableConfetti}
              onChange={(e) => setEnableConfetti(e.target.checked)}
              className="w-5 h-5 accent-[#EC4899] cursor-pointer"
            />
          </label>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleDownloadHTML}
              className="w-full btn-playful py-3 px-4 rounded-2xl bg-[#EC4899] text-white font-black text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>一键下载我的独立网页 (.html)</span>
            </button>

            <button
              onClick={handleCopyPrompt}
              className="w-full btn-playful py-2.5 px-4 rounded-2xl bg-white text-[#1E1B2E] font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#EEF0FF]"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPrompt ? '已复制！去 DeepSeek / Claude / GPT 粘贴就能做同款' : '复制同款真实 Prompt（去任何 AI 都能复现）'}</span>
            </button>

            {downloadedOnce && (
              <div className="p-2.5 rounded-xl bg-[#E8FBF3] border border-[#10B981] text-xs font-bold text-[#047857] text-center animate-pop">
                🎉 太棒了！你刚刚亲手做出了人生第一个可运行的 AI 网页作品！双击下载的文件就能直接打开！
              </div>
            )}
          </div>
        </div>

        {/* Right: REAL LIVE WORKING PREVIEW */}
        <div className="lg:col-span-7 card-playful overflow-hidden">
          {/* Fake Browser Top Bar */}
          <div className="px-4 py-2.5 bg-[#1E1B2E] text-white flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF6B57]" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="ml-2 text-white/75">实时预览 · 你的专属网页（可直接点着玩！）</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15">LIVE 🟢</span>
          </div>

          <div
            className="p-6 sm:p-8 min-h-[420px] flex items-center justify-center transition-colors duration-300 relative"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            {isBuilding ? (
              <div className="text-center space-y-3 animate-pop">
                <div className="text-5xl animate-bounce">🤖</div>
                <div className="font-black text-base" style={{ color: theme.accent }}>
                  AI 施工队正在飞速写代码并刷新页面...
                </div>
              </div>
            ) : projectId === 'wheel' ? (
              <div
                className="w-full max-w-md p-6 rounded-3xl border-3 text-center space-y-4"
                style={{
                  backgroundColor: theme.card,
                  borderColor: isDark ? theme.accent : '#1E1B2E',
                  boxShadow: `6px 6px 0 ${isDark ? theme.accent : '#1E1B2E'}`,
                }}
              >
                <h3 className="text-xl font-black">🎲 {wheelTitle}</h3>
                <div
                  className="py-5 px-4 rounded-2xl border-2 border-dashed text-xl font-black min-h-[72px] flex items-center justify-center"
                  style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                >
                  {wheelResult}
                </div>
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="btn-playful px-6 py-3 rounded-2xl text-white font-black text-sm cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: theme.accent }}
                >
                  {spinning ? '🎰 飞速转动中...' : '✨ 帮我决定吃什么！'}
                </button>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {wheelItems.map((food, idx) => (
                    <span
                      key={`${food}-${idx}`}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border"
                      style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            ) : projectId === 'pomodoro' ? (
              <div
                className="w-full max-w-md p-7 rounded-3xl border-3 text-center space-y-5"
                style={{
                  backgroundColor: theme.card,
                  borderColor: isDark ? theme.accent : '#1E1B2E',
                  boxShadow: `6px 6px 0 ${isDark ? theme.accent : '#1E1B2E'}`,
                }}
              >
                <h3 className="text-xl font-black">🍅 {pomoTitle}</h3>
                <div className="text-xs font-bold opacity-80">
                  {pomoDoneMsg
                    ? pomoDoneMsg
                    : pomoRunning
                    ? pomoMode === 'break'
                      ? '☕ 正在休息 5 分钟中，喝口水放松一下～'
                      : '🔥 正在超级专注中，保持节奏！'
                    : pomoMode === 'break'
                    ? '☕ 休息已暂停，点继续或切回专注'
                    : '准备好了就点开始吧！'}{' '}
                  · 今日已完成 {pomoCount} 颗番茄
                </div>
                <div className="text-6xl font-black tabular-nums tracking-tight" style={{ color: theme.accent }}>
                  {fmtClock(pomoSec)}
                </div>
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      setPomoDoneMsg('')
                      if (!pomoRunning && pomoSec === 0) {
                        setPomoSec(pomoMode === 'break' ? 5 * 60 : pomoMinutes * 60)
                      }
                      setPomoRunning((r) => !r)
                    }}
                    className="btn-playful px-5 py-2.5 rounded-xl text-white font-black text-sm inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {pomoRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{pomoRunning ? '暂停' : pomoMode === 'break' ? '继续休息' : '开始专注'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPomoMode('focus')
                      setPomoRunning(false)
                      setPomoDoneMsg('')
                      setPomoSec(pomoMinutes * 60)
                    }}
                    className="btn-playful px-4 py-2.5 rounded-xl font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer"
                    style={{ backgroundColor: theme.bg, color: theme.text }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 重置专注
                  </button>
                  <button
                    onClick={() => {
                      setPomoMode('break')
                      setPomoDoneMsg('')
                      setPomoSec(5 * 60)
                      setPomoRunning(true)
                    }}
                    className="btn-playful px-4 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer"
                    style={{ backgroundColor: theme.bg, color: theme.text }}
                  >
                    ☕ 休息 5 分钟
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="w-full max-w-md p-7 rounded-3xl border-3 text-center space-y-4"
                style={{
                  backgroundColor: theme.card,
                  borderColor: isDark ? theme.accent : '#1E1B2E',
                  boxShadow: `8px 8px 0 ${theme.accent}`,
                }}
              >
                {!cardOpened ? (
                  <div className="py-6 space-y-4">
                    <div className="text-6xl animate-float">✉️</div>
                    <div className="font-black text-lg">你收到一封来自未来的魔法贺卡！</div>
                    <button
                      onClick={() => {
                        setCardOpened(true)
                        if (enableConfetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } })
                      }}
                      className="btn-playful px-6 py-3 rounded-2xl text-white font-black text-sm inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <Sparkles className="w-4 h-4" /> 点击拆开贺卡
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-pop">
                    <div className="text-5xl">💌✨</div>
                    <h3 className="text-xl font-black" style={{ color: theme.accent }}>
                      {cardTitle}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-90">{cardMessage}</p>
                    <div className="text-right text-sm font-black pt-2">—— {cardSender}</div>
                    <button
                      onClick={() => setCardOpened(false)}
                      className="text-xs underline opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      重新装回信封
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch5"
        isCompleted={isCompleted}
        onComplete={onComplete}
        xpReward={200}
        nextLabel="去最终关：黑话翻译局 & 领毕业证 →"
        onNext={onNext}
      />
    </div>
  )
}
