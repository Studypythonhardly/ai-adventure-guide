import { useState, useEffect, useRef } from 'react'
import { Eli5Box, ChapterFooterNav } from '../components/Eli5Card'
import { BOARD_PRESETS, VIBE_PROJECTS, VIBE_THEMES, generateStandaloneHTML } from '../data/vibeTemplates'
import { celebrate, copyText } from '../lib/browser'
import { useMissionFlags } from '../hooks/useMissionFlags'
import { Download, Copy, Check, Sparkles, Play, Pause, RotateCcw, Plus, Wand2, X, ArrowRight } from 'lucide-react'

const DEFAULT_FOODS = ['红烧牛肉面', '麻辣香锅', '轻食沙拉', '猪脚饭', '回转寿司', '黄焖鸡米饭']

export function Chapter5Maker({ isCompleted, onComplete, onNext }) {
  const [flags, mark] = useMissionFlags('ch5')
  const [projectId, setProjectId] = useState('board')
  const [themeId, setThemeId] = useState('indigo')
  const [isBuilding, setIsBuilding] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [downloadedOnce, setDownloadedOnce] = useState(false)

  // Personal Board state
  const [boardPresetId, setBoardPresetId] = useState('schedule')
  const [boardTitle, setBoardTitle] = useState(BOARD_PRESETS.schedule.title)
  const [boardCols, setBoardCols] = useState(BOARD_PRESETS.schedule.columns)
  const [boardCards, setBoardCards] = useState(BOARD_PRESETS.schedule.cards)
  const [newCardText, setNewCardText] = useState('')
  const [newCardCol, setNewCardCol] = useState(0)

  // Per-project editable configs
  const [wheelTitle, setWheelTitle] = useState('今天中午吃什么？')
  const [wheelItems, setWheelItems] = useState(DEFAULT_FOODS)
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
  const buildTimerRef = useRef(null)

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
          if (enableConfetti) celebrate({ particleCount: 70, spread: 60, origin: { y: 0.65 } })
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
      if (buildTimerRef.current) clearTimeout(buildTimerRef.current)
    }
  }, [])

  const triggerBuildEffect = () => {
    if (spinRef.current) {
      clearInterval(spinRef.current)
      spinRef.current = null
      setSpinning(false)
    }
    clearTimeout(buildTimerRef.current)
    setIsBuilding(true)
    buildTimerRef.current = setTimeout(() => setIsBuilding(false), 450)
  }

  const handleSpin = () => {
    if (spinning || wheelItems.length === 0) return
    mark('played')
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
        if (enableConfetti) celebrate({ particleCount: 65, spread: 65, origin: { y: 0.65 } })
      }
    }, 70)
  }

  const handleAddFood = () => {
    const v = newFood.trim()
    if (!v) return
    setWheelItems((prev) => [...prev, v])
    setNewFood('')
    mark('customized')
  }

  const handleRemoveFood = (idx) => {
    setWheelItems((prev) => prev.filter((_, i) => i !== idx))
    mark('customized')
  }

  const handleApplyBoardPreset = (presetKey) => {
    const p = BOARD_PRESETS[presetKey]
    if (!p) return
    setBoardPresetId(presetKey)
    setBoardTitle(p.title)
    setBoardCols(p.columns)
    setBoardCards(p.cards)
    mark('customized')
    triggerBuildEffect()
  }

  const handleAddBoardCard = () => {
    const v = newCardText.trim()
    if (!v) return
    setBoardCards((prev) => [...prev, { id: `b_${Date.now()}`, text: v, tag: '新增', col: newCardCol }])
    setNewCardText('')
    mark('customized')
  }

  const handleMoveBoardCard = (id) => {
    setBoardCards((prev) => prev.map((c) => (c.id === id ? { ...c, col: (c.col + 1) % 3 } : c)))
    mark('played')
  }

  const handleDeleteBoardCard = (id) => {
    setBoardCards((prev) => prev.filter((c) => c.id !== id))
    mark('customized')
  }

  const getCurrentConfig = () => ({
    title:
      projectId === 'board'
        ? boardTitle
        : projectId === 'wheel'
        ? wheelTitle
        : projectId === 'pomodoro'
        ? pomoTitle
        : cardTitle,
    columns: boardCols,
    cards: boardCards,
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
    mark('exported')
    celebrate({ particleCount: 90, spread: 75, origin: { y: 0.65 } })
  }

  const handleCopyPrompt = async () => {
    const text = project.realPrompt(getCurrentConfig())
    if (await copyText(text)) {
      setCopiedPrompt(true)
      mark('exported')
      setTimeout(() => setCopiedPrompt(false), 1800)
    }
  }

  const fmtClock = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const missions = [
    { id: 'customized', label: '在左侧改一次配置（换配色、改文字，或添加/删除菜品）', done: Boolean(flags.customized) },
    { id: 'played', label: '在右侧预览窗里亲自试玩一次作品', done: Boolean(flags.played) },
    { id: 'exported', label: '点击下载 .html 网页文件，或复制同款真实 Prompt', done: Boolean(flags.exported) },
  ]

  return (
    <div className="space-y-8 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-2xl bg-[#FDECF4] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🛠️
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">05 · 动手造物工坊</h1>
      </div>

      <Eli5Box
        badge="热门新玩法：氛围编程"
        accent="#EC4899"
        title="不会写一行代码，也能做出真正能跑的小工具！"
        what="Vibe Coding（氛围编程）就是：你当“产品导演”，用大白话告诉 AI 你想要什么功能、什么配色，让 AI 帮你写出网页或小工具代码，边看效果边让它改。"
        analogy="就像去定制蛋糕：做个自己和朋友用的小工具时，你不必先学烤胚子，只要说清楚“星空紫配色、写上祝福语、打开会撒彩纸”就能拿到成品！（当然，如果是涉及付款和多人账号的大型正式软件，还是需要专业程序员把关安全哦。）"
        soWhat="下面就是一个造物沙盒：挑一个小作品、改改配置、右边立刻试玩——既能一键下载成双击可开的 .html 网页文件，也能复制同款 Prompt 去任何真实 AI 里自己生成！"
      />

      {/* Project Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="group" aria-label="选择要制作的小作品">
        {VIBE_PROJECTS.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => {
              setProjectId(p.id)
              triggerBuildEffect()
            }}
            aria-pressed={projectId === p.id}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
              projectId === p.id
                ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[4px_4px_0_#EC4899]'
                : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/25 hover:border-[#1E1B2E]'
            }`}
          >
            <div className="text-2xl mb-1" aria-hidden="true">{p.emoji}</div>
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
          <h2 className="font-black text-lg text-[#1E1B2E] flex items-center gap-1.5">
            <Wand2 className="w-5 h-5 text-[#EC4899]" aria-hidden="true" /> 定制指令
          </h2>

          {/* Theme Color Picker */}
          <div className="space-y-2">
            <span className="text-xs font-black text-[#595470] block">1️⃣ 换一套你喜欢的皮肤配色：</span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="皮肤配色">
              {VIBE_THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id)
                    mark('customized')
                    triggerBuildEffect()
                  }}
                  aria-pressed={themeId === t.id}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-extrabold flex items-center gap-2 cursor-pointer ${
                    themeId === t.id
                      ? 'border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] bg-[#FFFBF5]'
                      : 'border-[#1E1B2E]/15 bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-[#1E1B2E] shrink-0"
                    style={{ backgroundColor: t.accent }}
                    aria-hidden="true"
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Specific Controls */}
          {projectId === 'board' && (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-black text-[#595470] block mb-1.5">2️⃣ 一键套用看板场景模板：</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(BOARD_PRESETS).map((bp) => (
                    <button
                      type="button"
                      key={bp.id}
                      onClick={() => handleApplyBoardPreset(bp.id)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                        boardPresetId === bp.id
                          ? 'bg-[#5B4BFF] text-white border-[#1E1B2E]'
                          : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
                      }`}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="board-title" className="text-xs font-black text-[#595470] block mb-1">
                  3️⃣ 看板名称：
                </label>
                <input
                  id="board-title"
                  value={boardTitle}
                  onChange={(e) => {
                    setBoardTitle(e.target.value)
                    mark('customized')
                  }}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label htmlFor="board-card-input" className="text-xs font-black text-[#595470] block mb-1">
                  4️⃣ 添加新卡片：
                </label>
                <div className="flex gap-1.5">
                  <input
                    id="board-card-input"
                    value={newCardText}
                    onChange={(e) => setNewCardText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBoardCard()}
                    placeholder="如：整理本周产品数据"
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm focus:outline-none focus:border-[#5B4BFF]"
                  />
                  <select
                    aria-label="选择所属列"
                    value={newCardCol}
                    onChange={(e) => setNewCardCol(Number(e.target.value))}
                    className="px-2 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-xs font-bold bg-white"
                  >
                    {boardCols.map((c, idx) => (
                      <option key={c} value={idx}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddBoardCard}
                    className="btn-playful px-3 py-2 rounded-xl bg-[#10B981] text-white font-black text-xs shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {projectId === 'wheel' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="wheel-title" className="text-xs font-black text-[#595470] block mb-1">
                  2️⃣ 改一下大转盘标题：
                </label>
                <input
                  id="wheel-title"
                  value={wheelTitle}
                  onChange={(e) => {
                    setWheelTitle(e.target.value)
                    mark('customized')
                  }}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label htmlFor="wheel-new-food" className="text-xs font-black text-[#595470] block mb-1">
                  3️⃣ 加一个你最爱吃的菜：
                </label>
                <div className="flex gap-2">
                  <input
                    id="wheel-new-food"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                    placeholder="比如：潮汕牛肉火锅"
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm focus:outline-none focus:border-[#5B4BFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFood}
                    className="btn-playful px-3 py-2 rounded-xl bg-[#10B981] text-white font-black text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" /> 添加
                  </button>
                </div>
              </div>
            </div>
          )}

          {projectId === 'pomodoro' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="pomo-title" className="text-xs font-black text-[#595470] block mb-1">
                  2️⃣ 给你的番茄钟起个名字：
                </label>
                <input
                  id="pomo-title"
                  value={pomoTitle}
                  onChange={(e) => {
                    setPomoTitle(e.target.value)
                    mark('customized')
                  }}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <span className="text-xs font-black text-[#595470] block mb-1">
                  3️⃣ 专注时长：<strong>{pomoMinutes} 分钟</strong>
                </span>
                <div className="flex gap-2" role="group" aria-label="专注时长">
                  {[1, 15, 25, 45].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => {
                        setPomoMode('focus')
                        setPomoMinutes(m)
                        setPomoSec(m * 60)
                        setPomoRunning(false)
                        setPomoDoneMsg('')
                        mark('customized')
                      }}
                      aria-pressed={pomoMinutes === m && pomoMode === 'focus'}
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
                <label htmlFor="card-title" className="text-xs font-black text-[#595470] block mb-1">
                  2️⃣ 贺卡大标题：
                </label>
                <input
                  id="card-title"
                  value={cardTitle}
                  onChange={(e) => {
                    setCardTitle(e.target.value)
                    mark('customized')
                  }}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm font-bold focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label htmlFor="card-msg" className="text-xs font-black text-[#595470] block mb-1">
                  3️⃣ 想对朋友说的话：
                </label>
                <textarea
                  id="card-msg"
                  rows={3}
                  value={cardMessage}
                  onChange={(e) => {
                    setCardMessage(e.target.value)
                    mark('customized')
                  }}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#1E1B2E]/25 text-sm focus:outline-none focus:border-[#5B4BFF]"
                />
              </div>
              <div>
                <label htmlFor="card-sender" className="text-xs font-black text-[#595470] block mb-1">
                  4️⃣ 你的专属落款：
                </label>
                <input
                  id="card-sender"
                  value={cardSender}
                  onChange={(e) => {
                    setCardSender(e.target.value)
                    mark('customized')
                  }}
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
              onChange={(e) => {
                setEnableConfetti(e.target.checked)
                mark('customized')
              }}
              className="w-5 h-5 accent-[#EC4899] cursor-pointer"
            />
          </label>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadHTML}
              className="w-full btn-playful py-3 px-4 rounded-2xl bg-[#EC4899] text-white font-black text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>一键下载我的独立网页 (.html)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPrompt}
              className="w-full btn-playful py-2.5 px-4 rounded-2xl bg-white text-[#1E1B2E] font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#EEF0FF]"
            >
              {copiedPrompt ? (
                <Check className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{copiedPrompt ? '已复制！去 DeepSeek / Claude / GPT 粘贴就能做同款' : '复制同款真实 Prompt（去任何 AI 都能复现）'}</span>
            </button>

            {downloadedOnce && (
              <div className="p-2.5 rounded-xl bg-[#E8FBF3] border border-[#10B981] text-xs font-bold text-[#047857] text-center animate-pop">
                🎉 太棒了！双击刚刚下载的 .html 文件，就能直接在浏览器里运行你的作品！
              </div>
            )}
          </div>
        </div>

        {/* Right: REAL LIVE WORKING PREVIEW */}
        <div className="lg:col-span-7 card-playful overflow-hidden">
          {/* Browser Top Bar */}
          <div className="px-4 py-2.5 bg-[#1E1B2E] text-white flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF6B57]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]" aria-hidden="true" />
              <span className="ml-2 text-white/80">实时预览</span>
            </div>
          </div>

          <div
            className="p-6 sm:p-8 min-h-[420px] flex items-center justify-center transition-colors duration-300 relative"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            {isBuilding ? (
              <div className="text-center space-y-3 animate-pop" role="status">
                <div className="text-5xl animate-bounce" aria-hidden="true">🤖</div>
                <div className="font-black text-base" style={{ color: theme.accent }}>
                  AI 施工队正在刷新你的页面...
                </div>
              </div>
            ) : projectId === 'board' ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-black">📊 {boardTitle}</h3>
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded-full border"
                    style={{ backgroundColor: theme.card, borderColor: theme.accent, color: theme.accent }}
                  >
                    完成度 {boardCards.length ? Math.round((boardCards.filter((c) => c.col === 2).length / boardCards.length) * 100) : 0}%
                  </span>
                </div>

                {/* Live KPI Strip */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { lbl: '总条目', val: boardCards.length },
                    { lbl: boardCols[1], val: boardCards.filter((c) => c.col === 1).length },
                    { lbl: boardCols[2], val: boardCards.filter((c) => c.col === 2).length },
                  ].map((s) => (
                    <div
                      key={s.lbl}
                      className="p-2.5 rounded-xl border-2 text-center"
                      style={{
                        backgroundColor: theme.card,
                        borderColor: isDark ? theme.accent : '#1E1B2E',
                      }}
                    >
                      <div className="text-lg font-black" style={{ color: theme.accent }}>
                        {s.val}
                      </div>
                      <div className="text-[11px] font-bold opacity-75">{s.lbl}</div>
                    </div>
                  ))}
                </div>

                {/* 3 Live Interactive Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {boardCols.map((colName, ci) => {
                    const list = boardCards.filter((c) => c.col === ci)
                    return (
                      <div
                        key={colName}
                        className="p-3 rounded-2xl border-2 space-y-2"
                        style={{
                          backgroundColor: theme.card,
                          borderColor: isDark ? theme.accent : '#1E1B2E',
                        }}
                      >
                        <div className="text-xs font-black flex items-center justify-between">
                          <span>{colName}</span>
                          <span className="opacity-65">{list.length}</span>
                        </div>
                        <div className="space-y-2">
                          {list.map((card) => (
                            <div
                              key={card.id}
                              className="p-2.5 rounded-xl border text-left space-y-1.5"
                              style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}66` }}
                            >
                              <div className="flex items-start justify-between gap-1 text-xs font-bold leading-snug">
                                <span>{card.text}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBoardCard(card.id)}
                                  aria-label={`删除 ${card.text}`}
                                  className="opacity-50 hover:opacity-100 cursor-pointer shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                                  style={{ backgroundColor: theme.card, color: theme.accent }}
                                >
                                  {card.tag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveBoardCard(card.id)}
                                  className="text-[10px] font-black px-2 py-0.5 rounded-lg text-white inline-flex items-center gap-0.5 cursor-pointer"
                                  style={{ backgroundColor: theme.accent }}
                                >
                                  <span>{ci < 2 ? boardCols[ci + 1] : '重排'}</span>
                                  <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
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
                  aria-live="polite"
                  className="py-5 px-4 rounded-2xl border-2 border-dashed text-xl font-black min-h-[72px] flex items-center justify-center"
                  style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                >
                  {wheelItems.length === 0 ? '菜品都被删光啦，先添加几个吧！' : wheelResult}
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSpin}
                    disabled={spinning || wheelItems.length === 0}
                    className="btn-playful px-6 py-3 rounded-2xl text-white font-black text-sm cursor-pointer disabled:opacity-60"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {spinning ? '🎰 飞速转动中...' : '✨ 帮我决定吃什么！'}
                  </button>
                  {wheelItems.length === 0 && (
                    <button
                      type="button"
                      onClick={() => setWheelItems(DEFAULT_FOODS)}
                      className="btn-playful px-4 py-3 rounded-2xl text-xs font-black cursor-pointer"
                      style={{ backgroundColor: theme.bg, color: theme.text }}
                    >
                      恢复默认菜单
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {wheelItems.map((food, idx) => (
                    <span
                      key={`${food}-${idx}`}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-bold border"
                      style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                    >
                      <span>{food}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFood(idx)}
                        aria-label={`删除 ${food}`}
                        className="p-0.5 rounded-full opacity-65 hover:opacity-100 cursor-pointer"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
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
                <div className="text-xs font-bold opacity-80" aria-live="polite">
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
                    type="button"
                    onClick={() => {
                      mark('played')
                      setPomoDoneMsg('')
                      if (!pomoRunning && pomoSec === 0) {
                        setPomoSec(pomoMode === 'break' ? 5 * 60 : pomoMinutes * 60)
                      }
                      setPomoRunning((r) => !r)
                    }}
                    className="btn-playful px-5 py-2.5 rounded-xl text-white font-black text-sm inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {pomoRunning ? (
                      <Pause className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Play className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>{pomoRunning ? '暂停' : pomoMode === 'break' ? '继续休息' : '开始专注'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPomoMode('focus')
                      setPomoRunning(false)
                      setPomoDoneMsg('')
                      setPomoSec(pomoMinutes * 60)
                    }}
                    className="btn-playful px-4 py-2.5 rounded-xl font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer"
                    style={{ backgroundColor: theme.bg, color: theme.text }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> 重置专注
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      mark('played')
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
                    <div className="text-6xl animate-float" aria-hidden="true">✉️</div>
                    <div className="font-black text-lg">你收到一封来自朋友的魔法贺卡！</div>
                    <button
                      type="button"
                      onClick={() => {
                        mark('played')
                        setCardOpened(true)
                        if (enableConfetti) celebrate({ particleCount: 80, spread: 70, origin: { y: 0.65 } })
                      }}
                      className="btn-playful px-6 py-3 rounded-2xl text-white font-black text-sm inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: theme.accent }}
                    >
                      <Sparkles className="w-4 h-4" aria-hidden="true" /> 点击拆开贺卡
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-pop">
                    <div className="text-5xl" aria-hidden="true">💌✨</div>
                    <h3 className="text-xl font-black" style={{ color: theme.accent }}>
                      {cardTitle}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">{cardMessage}</p>
                    <div className="text-right text-sm font-black pt-2">—— {cardSender}</div>
                    <button
                      type="button"
                      onClick={() => setCardOpened(false)}
                      className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer"
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

      {/* Concise 3-Step Guide: How to build ANY Personal Dashboard with AI */}
      <section className="card-playful p-5 sm:p-6 bg-[#FFFBF5] space-y-3">
        <h2 className="text-base sm:text-lg font-black text-[#1E1B2E]">
          📊 举一反三：用 AI 做个人看板（工作排期 / 产品分析 / 内容展示）的 3 步公式
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15 space-y-1">
            <div className="font-black text-[#5B4BFF]">① 先定“顶栏 3 数字 + 3 列结构”</div>
            <p className="text-[#45405C]">告诉 AI 看板最上面放哪 3 个核心指标（如完成率、本周产出、待办数），下面分哪几列。</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15 space-y-1">
            <div className="font-black text-[#10B981]">② 直接粘贴你的原始清单或数据</div>
            <p className="text-[#45405C]">把凌乱的备忘录、产品分析要点或作品链接直接贴给 AI，让它帮你自动分类填进看板。</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#1E1B2E]/15 space-y-1">
            <div className="font-black text-[#EC4899]">③ 加上“单文件 HTML + 本地保存”</div>
            <p className="text-[#45405C]">让 AI 用 localStorage 存数据，下载成单个 .html 文件，每天双击就能当专属个人工作台！</p>
          </div>
        </div>
      </section>

      <ChapterFooterNav
        chapterId="ch5"
        isCompleted={isCompleted}
        onComplete={onComplete}
        missions={missions}
        nextLabel="去最终关：黑话翻译局 & 领毕业证 →"
        onNext={onNext}
      />
    </div>
  )
}

export default Chapter5Maker
