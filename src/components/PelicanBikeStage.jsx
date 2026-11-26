import { lazy, Suspense, useState, useEffect } from 'react'
import { Play, Pause, Code2, Sparkles, Rotate3d, Layers } from 'lucide-react'
import { prefersReducedMotion } from '../lib/browser'

const Pelican3DCanvas = lazy(() => import('./Pelican3DCanvas'))

const ERAS = [
  {
    id: '2023',
    year: '2023 早期模型',
    badge: '😵 抽象派灵魂画手',
    color: '#FF6B57',
    score: '28 / 100',
    caption: '车轮飞了、车把歪了、鹈鹕的大嘴巴飘在半空中……虽然很努力，但完全像毕加索抽象画！',
    eli5Why: '那时候的 AI 就像蒙着眼睛听别人描述自行车——它知道“要有圆圈和三角形”，但搞不清楚它们怎么拼在一起。',
    codeSnippet: `<circle cx="110" cy="185" r="32" /> <!-- 轮子没接上车架 -->\n<polygon points="240,55 310,70 250,95" /> <!-- 漂浮的神秘大嘴 -->`,
  },
  {
    id: '2025',
    year: '2025 进阶模型',
    badge: '🎨 幼儿园美术课代表',
    color: '#F59E0B',
    score: '72 / 100',
    caption: '终于能一眼认出是“鹈鹕骑单车”了！车架连上了，大喉囊也画出来了，就是踩脚踏的姿势还有点憨憨的～',
    eli5Why: 'AI 开始具备空间感啦！能把鸟身体、座椅、车把、两个轮子的相对位置大体对准。',
    codeSnippet: `<path d="M135 160 L205 110 L265 160" /> <!-- 标准三角车架 -->\n<ellipse cx="195" cy="95" rx="34" ry="22" /> <!-- 可爱鹈鹕身体 -->`,
  },
  {
    id: '2026',
    year: '2026 前沿模型 (100% 纯代码 3D)',
    badge: '🌴 落日海岸 3D 实时渲染',
    color: '#10B981',
    score: '99 / 100',
    caption: '零静态图片！完全由 AI 编写的 Three.js + GLSL 着色器实时渲染：落日紫橙渐变天空、动态波光海面、摇曳棕榈树、海岸天际线与戴飞行员墨镜骑碳纤维公路车的 3D 鹈鹕！',
    eli5Why: '2026 年的顶尖编程模型能直接写出带自定义着色器（GLSL）、电影打光与关节运动（IK）的 3D 场景代码——按住画面拖动鼠标，360° 围观每一处纯代码算出来的光影细节！',
    codeSnippet: `// 100% 纯代码 GLSL 落日海面着色器 + Three.js 实时渲染（零贴图）：\nfloat sunPath = exp(-pow((vWorldPos.x + 12.0) * 0.09, 2.0));\ncol += vec3(1.0, 0.68, 0.32) * (sunPath * 0.32 + sparkle * 0.95);`,
  },
]

export function PelicanBikeStage() {
  const [eraIdx, setEraIdx] = useState(2)
  const [autoPlay, setAutoPlay] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [turbo, setTurbo] = useState(false)
  const [cameraPreset, setCameraPreset] = useState('hero')
  const [render3D, setRender3D] = useState(() => !prefersReducedMotion())
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setEraIdx((prev) => (prev + 1) % ERAS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [autoPlay])

  const era = ERAS[eraIdx]
  const use3D = era.id === '2026' && render3D && !webglFailed

  return (
    <section className="card-playful p-5 sm:p-7 bg-gradient-to-br from-[#E8F6FE] via-[#FFFFFF] to-[#FEF6E4] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-black badge-pill mb-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> AI 圈经典趣味测试 · 互动动画
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
            🚲 著名的“鹈鹕骑单车”进化史
          </h2>
          <p className="text-xs sm:text-sm text-[#45405C] mt-1">
            开发者 Simon Willison 常考新模型一道趣味题：<strong>“请用纯代码画一只骑自行车的鹈鹕！”</strong>
            点击下方年份，对比不同时期模型写图形代码的能力差异（注：下方为教学复刻示意）：
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAutoPlay((v) => !v)}
          aria-pressed={autoPlay}
          className={`btn-playful px-4 py-2.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
            autoPlay ? 'bg-[#FF6B57] text-white' : 'bg-[#5B4BFF] text-white'
          }`}
        >
          {autoPlay ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          <span>{autoPlay ? '暂停进化轮播' : '自动播放进化史'}</span>
        </button>
      </div>

      {/* Era Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="年份切换">
        {ERAS.map((item, idx) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              setAutoPlay(false)
              setEraIdx(idx)
            }}
            aria-pressed={eraIdx === idx}
            className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
              eraIdx === idx
                ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[3px_3px_0_#0EA5E9]'
                : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
            }`}
          >
            <div className="text-xs sm:text-sm font-black">{item.year}</div>
            <div className={`text-[11px] font-bold mt-0.5 ${eraIdx === idx ? 'text-[#BAE6FD]' : 'text-[#595470]'}`}>
              {item.badge}
            </div>
          </button>
        ))}
      </div>

      {/* Animated 2D / 3D Canvas */}
      <div className="rounded-3xl border-3 border-[#1E1B2E] shadow-[5px_5px_0_#1E1B2E] overflow-hidden bg-gradient-to-b from-[#DBEAFE] via-[#EFF6FF] to-[#FEF9C3] relative">
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pr-28">
          <div className="px-3 py-1 rounded-full bg-white/95 border-2 border-[#1E1B2E] text-xs font-black text-[#1E1B2E]">
            完成度示意：<span style={{ color: era.color }}>{era.score}</span>
          </div>
          {era.id === '2026' && (
            <>
              <button
                type="button"
                onClick={() => setTurbo((t) => !t)}
                aria-pressed={turbo}
                className={`px-3 py-1 rounded-full border-2 border-[#1E1B2E] text-xs font-black cursor-pointer transition-all ${
                  turbo
                    ? 'bg-[#FF6B57] text-white shadow-[2px_2px_0_#1E1B2E]'
                    : 'bg-[#FEF6E4] text-[#92400E] hover:bg-[#FDE68A]'
                }`}
              >
                {turbo ? '🔥 冲刺加速中！' : '⚡ 加速冲刺'}
              </button>
              {use3D && (
                <button
                  type="button"
                  onClick={() =>
                    setCameraPreset((p) => (p === 'hero' ? 'side' : p === 'side' ? 'front' : 'hero'))
                  }
                  className="px-3 py-1 rounded-full bg-white/95 hover:bg-[#EEF0FF] border-2 border-[#1E1B2E] text-xs font-black text-[#1E1B2E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Rotate3d className="w-3.5 h-3.5 text-[#5B4BFF]" aria-hidden="true" />
                  <span>切换 3D 机位</span>
                </button>
              )}
              {!webglFailed && (
                <button
                  type="button"
                  onClick={() => setRender3D((v) => !v)}
                  aria-pressed={!render3D}
                  className="px-3 py-1 rounded-full bg-white/95 hover:bg-[#EEF0FF] border-2 border-[#1E1B2E] text-xs font-black text-[#1E1B2E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#0284C7]" aria-hidden="true" />
                  <span>{render3D ? '切到 2D 轻量版' : '切回 3D 渲染'}</span>
                </button>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowCode((s) => !s)}
          aria-expanded={showCode}
          className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#1E1B2E] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#5B4BFF] transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showCode ? '收起代码' : '偷看代码片段'}</span>
        </button>

        {use3D ? (
          <div className="relative bg-[#160F29]">
            <Suspense
              fallback={
                <div className="w-full h-80 sm:h-96 flex items-center justify-center text-white text-xs font-bold">
                  🌴 正在启动 3D 渲染引擎...
                </div>
              }
            >
              <Pelican3DCanvas
                turbo={turbo}
                cameraPreset={cameraPreset}
                onError={() => setWebglFailed(true)}
              />
            </Suspense>
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#1E1B2E]/80 text-white text-[11px] font-bold backdrop-blur-sm whitespace-nowrap">
              🌴 100% 纯代码 WebGL + GLSL 实时渲染 · 鼠标拖拽 360° 旋转 · 滚轮缩放
            </div>
          </div>
        ) : (
        <svg viewBox="0 0 560 270" className="w-full h-60 sm:h-72 block select-none" role="img" aria-label={`${era.year}鹈鹕骑单车矢量示意动画`}>
          <defs>
            <linearGradient id="sky2026" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="55%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id="beakGrad" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="pouchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="65%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Sky backdrop (full bleed across wide viewports) */}
          {era.id === '2026' && <rect x="-300" y="0" width="1160" height="270" fill="url(#sky2026)" />}

          {/* Glowing sun */}
          <g>
            {era.id === '2026' && <circle cx="492" cy="52" r="36" fill="#FDE047" opacity="0.28" />}
            <circle cx="492" cy="52" r="22" fill="#FDE047" stroke="#1E1B2E" strokeWidth="2.8" />
          </g>

          {/* Drifting clouds */}
          <g className="anim-cloud">
            <g fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="2.2" opacity="0.92">
              <path d="M-90 54 Q-84 36 -64 40 Q-52 24 -32 37 Q-16 37 -16 54 Z" />
              <path d="M80 62 Q86 44 106 48 Q118 32 138 45 Q154 45 154 62 Z" />
              <path d="M300 48 Q305 34 322 37 Q332 26 348 36 Q362 36 362 48 Z" />
              <path d="M510 72 Q515 58 532 61 Q542 50 558 60 Q572 60 572 72 Z" />
              <path d="M680 54 Q686 36 706 40 Q718 24 738 37 Q754 37 754 54 Z" />
            </g>
          </g>

          {/* Distant rolling hills + passing trees for 2026 */}
          {era.id === '2026' && (
            <g>
              <path d="M-300 205 Q-150 155 0 205 Q95 152 210 192 T420 182 T650 198 T860 186 L860 225 L-300 225 Z" fill="#86EFAC" opacity="0.7" />
              <g className={turbo ? 'anim-scenery-fast' : 'anim-scenery'}>
                {[-210, -70, 70, 210, 350, 490, 630, 770, 910].map((tx) => (
                  <g key={tx} transform={`translate(${tx}, 0)`}>
                    <rect x="-3" y="182" width="6" height="26" fill="#92400E" />
                    <polygon points="0,148 -16,184 16,184" fill="#10B981" stroke="#1E1B2E" strokeWidth="2" />
                    <polygon points="0,162 -13,190 13,190" fill="#059669" stroke="#1E1B2E" strokeWidth="2" />
                  </g>
                ))}
              </g>
            </g>
          )}

          {/* Ground & asphalt road (full bleed) */}
          <rect x="-300" y="210" width="1160" height="60" fill={era.id === '2026' ? '#334155' : '#86EFAC'} stroke="#1E1B2E" strokeWidth="3" />
          {era.id === '2026' && <rect x="-300" y="206" width="1160" height="8" fill="#4ADE80" stroke="#1E1B2E" strokeWidth="2" />}
          <line
            x1="-300"
            y1="238"
            x2="860"
            y2="238"
            stroke={era.id === '2026' ? '#FDE047' : '#1E1B2E'}
            strokeWidth="3.5"
            strokeDasharray="24 24"
            className="anim-road"
          />

          {/* ==================== ERA 2023: CHAOTIC PICASSO ==================== */}
          {era.id === '2023' && (
            <g transform="translate(0, 12)">
              {/* Detached wobbly back wheel */}
              <g className="anim-wobble">
                <circle cx="170" cy="182" r="26" fill="none" stroke="#1E1B2E" strokeWidth="4" strokeDasharray="10 6" />
                <circle cx="170" cy="182" r="5" fill="#FF6B57" />
              </g>
              {/* Crooked front wheel */}
              <g className="anim-wheel-slow">
                <ellipse cx="365" cy="175" rx="30" ry="20" fill="none" stroke="#1E1B2E" strokeWidth="4" />
                <line x1="340" y1="175" x2="390" y2="175" stroke="#1E1B2E" strokeWidth="2" />
              </g>
              {/* Confused bike frame not connecting properly */}
              <path d="M195 165 L270 115 L335 190 L240 155" fill="none" stroke="#FF6B57" strokeWidth="5" strokeLinecap="round" />
              {/* Floating abstract pelican blob */}
              <g className="anim-wobble">
                <ellipse cx="265" cy="95" rx="36" ry="22" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="3" />
                <polygon points="322,68 395,88 320,108" fill="#FB923C" stroke="#1E1B2E" strokeWidth="3" />
                <circle cx="285" cy="85" r="7" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="2.5" />
                <circle cx="287" cy="84" r="3" fill="#1E1B2E" />
                <text x="220" y="62" fontSize="22" fontWeight="900" fill="#FF6B57">???</text>
              </g>
            </g>
          )}

          {/* ==================== ERA 2025: CUTE CARTOON ==================== */}
          {era.id === '2025' && (
            <g transform="translate(0, 14)" className="anim-bike-bounce">
              <g className="anim-wheel-slow">
                <circle cx="200" cy="176" r="28" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="4" />
                <line x1="200" y1="148" x2="200" y2="204" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="172" y1="176" x2="228" y2="176" stroke="#94A3B8" strokeWidth="2.5" />
              </g>
              <g className="anim-wheel-slow">
                <circle cx="345" cy="176" r="28" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="4" />
                <line x1="345" y1="148" x2="345" y2="204" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="317" y1="176" x2="373" y2="176" stroke="#94A3B8" strokeWidth="2.5" />
              </g>
              <path d="M200 176 L262 176 L316 122 L245 122 Z" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinejoin="round" />
              <line x1="345" y1="176" x2="312" y2="108" stroke="#1E1B2E" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="302" y1="108" x2="328" y2="106" stroke="#1E1B2E" strokeWidth="5" strokeLinecap="round" />
              <line x1="232" y1="118" x2="258" y2="118" stroke="#1E1B2E" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="255" cy="96" rx="34" ry="22" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="3" />
              <circle cx="288" cy="70" r="15" fill="#FFFFFF" stroke="#1E1B2E" strokeWidth="3" />
              <path d="M300 66 L354 74 L302 84 Q326 102 298 84 Z" fill="#FB923C" stroke="#1E1B2E" strokeWidth="3" strokeLinejoin="round" />
              <circle cx="292" cy="66" r="3" fill="#1E1B2E" />
              <path d="M256 116 L264 168" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />
              <circle cx="264" cy="176" r="6" fill="#1E1B2E" />
            </g>
          )}

          {/* ==================== ERA 2026: KURZGESAGT / STUDIO-GRADE ANIMATION ==================== */}
          {era.id === '2026' && (
            <g>
              {/* Soft ground shadow under bike */}
              <ellipse cx="275" cy="222" rx="112" ry="9" fill="#0F172A" opacity="0.35" />

              <g className="anim-bike-bounce">
                {/* Dynamic speed wind streaks */}
                <g opacity={turbo ? 0.95 : 0.55}>
                  <line x1="48" y1="88" x2="116" y2="88" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="30" y1="118" x2="106" y2="118" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <line x1="62" y1="150" x2="122" y2="150" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Rear Tire + Whitewall + 8 Spokes */}
                <g className={turbo ? 'anim-wheel-fast' : 'anim-wheel'}>
                  <circle cx="182" cy="186" r="35" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                  <circle cx="182" cy="186" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="182" cy="186" r="24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeDasharray="7 5" />
                  {[0, 45, 90, 135].map((deg) => (
                    <line
                      key={deg}
                      x1="182"
                      y1="160"
                      x2="182"
                      y2="212"
                      stroke="#64748B"
                      strokeWidth="1.8"
                      transform={`rotate(${deg} 182 186)`}
                    />
                  ))}
                  <circle cx="182" cy="186" r="6" fill="#F59E0B" stroke="#1E1B2E" strokeWidth="2" />
                </g>

                {/* Front Tire + Whitewall + 8 Spokes */}
                <g className={turbo ? 'anim-wheel-fast' : 'anim-wheel'}>
                  <circle cx="366" cy="186" r="35" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                  <circle cx="366" cy="186" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="366" cy="186" r="24" fill="none" stroke="#EC4899" strokeWidth="2.2" strokeDasharray="7 5" />
                  {[0, 45, 90, 135].map((deg) => (
                    <line
                      key={deg}
                      x1="366"
                      y1="160"
                      x2="366"
                      y2="212"
                      stroke="#64748B"
                      strokeWidth="1.8"
                      transform={`rotate(${deg} 366 186)`}
                    />
                  ))}
                  <circle cx="366" cy="186" r="6" fill="#F59E0B" stroke="#1E1B2E" strokeWidth="2" />
                </g>

                {/* Chain & Rear Cassette */}
                <path d="M182 180 L262 174 L262 198 L182 192 Z" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeDasharray="4 3" />

                {/* Metallic Gradient Diamond Bike Frame */}
                <path
                  d="M182 186 L262 186 L328 122 L238 122 Z"
                  fill="none"
                  stroke="url(#frameGrad)"
                  strokeWidth="6.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Seat tube & water bottle */}
                <line x1="262" y1="186" x2="232" y2="108" stroke="url(#frameGrad)" strokeWidth="6" strokeLinecap="round" />
                <rect x="275" y="138" width="12" height="22" rx="4" fill="#38BDF8" stroke="#1E1B2E" strokeWidth="2" transform="rotate(42 281 149)" />

                {/* Front Fork + Drop Handlebars */}
                <line x1="366" y1="186" x2="322" y2="98" stroke="#1E1B2E" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M312 98 L340 96 Q356 96 352 112 Q348 122 336 118" fill="none" stroke="#1E1B2E" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M336 96 Q354 96 352 112" fill="none" stroke="#FF6B57" strokeWidth="3" strokeLinecap="round" />

                {/* Woven Wicker Basket with Fresh Fish */}
                <g>
                  <path d="M342 112 L374 112 L369 138 L347 138 Z" fill="#FDE68A" stroke="#1E1B2E" strokeWidth="2.5" strokeLinejoin="round" />
                  <line x1="345" y1="120" x2="371" y2="120" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="346" y1="128" x2="370" y2="128" stroke="#D97706" strokeWidth="1.5" />
                  <text x="348" y="116" fontSize="16">🐟</text>
                </g>

                {/* Saddle */}
                <path d="M214 108 Q232 100 250 110 Q232 114 214 108 Z" fill="#1E1B2E" />

                {/* Flowing Layered Red & Gold Scarf */}
                <g className="anim-scarf">
                  <path d="M274 74 Q228 54 186 72 Q212 86 266 84 Z" fill="#FF6B57" stroke="#1E1B2E" strokeWidth="2.5" />
                  <path d="M268 79 Q232 72 198 84 Q224 94 264 87 Z" fill="#FBBF24" stroke="#1E1B2E" strokeWidth="2" />
                </g>

                {/* Pelican Tail Feathers */}
                <path d="M208 98 L184 90 L194 104 L182 112 L212 112 Z" fill="#475569" stroke="#1E1B2E" strokeWidth="2.5" strokeLinejoin="round" />

                {/* Pelican Torso with Soft Shading */}
                <path
                  d="M204 102 Q212 70 256 72 Q292 74 294 104 Q290 128 248 126 Q214 124 204 102 Z"
                  fill="url(#bodyGrad)"
                  stroke="#1E1B2E"
                  strokeWidth="3"
                />

                {/* Graceful S-Curve Neck & Head with Tuft Crest */}
                <path
                  d="M268 86 Q278 46 302 42 Q324 40 322 62 Q320 78 290 94 Z"
                  fill="url(#bodyGrad)"
                  stroke="#1E1B2E"
                  strokeWidth="3"
                />
                {/* Cute Crest Feathers */}
                <path d="M286 44 Q276 32 292 37 Q284 26 300 36" fill="none" stroke="#1E1B2E" strokeWidth="2.5" strokeLinecap="round" />

                {/* Cool Retro Mint Cycling Helmet + Goggles */}
                <path d="M286 48 Q304 28 326 48 Z" fill="#10B981" stroke="#1E1B2E" strokeWidth="2.6" />
                <line x1="296" y1="40" x2="318" y2="40" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />

                {/* ICONIC Huge Pelican Bill + Sagging Throat Pouch */}
                <path
                  d="M318 52 L404 62 Q408 66 398 70 L320 68 Z"
                  fill="url(#beakGrad)"
                  stroke="#1E1B2E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                {/* Pouch with subtle highlight */}
                <path
                  d="M320 68 L398 67 Q376 112 324 94 Q310 86 320 68 Z"
                  fill="url(#pouchGrad)"
                  stroke="#1E1B2E"
                  strokeWidth="2.8"
                />
                <path d="M332 76 Q356 96 380 76" fill="none" stroke="#FFF7ED" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

                {/* Expressive Happy Eye + Rosy Cheek */}
                <circle cx="308" cy="56" r="5" fill="#1E1B2E" />
                <circle cx="310" cy="54" r="1.8" fill="#FFFFFF" />
                <ellipse cx="304" cy="66" rx="5.5" ry="3" fill="#FDA4AF" opacity="0.8" />

                {/* Layered Wing Reaching Handlebar */}
                <g className="anim-wing">
                  <path
                    d="M242 94 Q284 82 328 96 Q298 118 244 110 Z"
                    fill="url(#wingGrad)"
                    stroke="#1E1B2E"
                    strokeWidth="2.8"
                  />
                  <path d="M262 99 Q286 96 308 100" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                </g>

                {/* Animated Pedaling Leg & Webbed Foot */}
                <g className={turbo ? 'anim-pedal-fast' : 'anim-pedal'}>
                  <path d="M248 124 L264 156 L262 184" fill="none" stroke="#F97316" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M254 184 L274 184 L278 190 L252 190 Z" fill="#FB923C" stroke="#1E1B2E" strokeWidth="2.2" strokeLinejoin="round" />
                </g>

                {/* Rotating Chainring Crank */}
                <g className={turbo ? 'anim-wheel-fast' : 'anim-wheel'}>
                  <circle cx="262" cy="186" r="13" fill="#FDE047" stroke="#1E1B2E" strokeWidth="3" />
                  <circle cx="262" cy="186" r="4" fill="#1E1B2E" />
                  <line x1="262" y1="173" x2="262" y2="199" stroke="#1E1B2E" strokeWidth="3" />
                </g>
              </g>
            </g>
          )}
        </svg>
        )}
      </div>

      {/* ELI5 Explanation & Optional Code Peek */}
      <div className="p-4 rounded-2xl bg-white border-2 border-[#1E1B2E]/15 space-y-2">
        <div className="text-sm sm:text-base font-black text-[#1E1B2E]">{era.caption}</div>
        <div className="text-xs sm:text-sm text-[#45405C] leading-relaxed">
          <strong>🧸 ELI5 揭秘：</strong> {era.eli5Why}
        </div>
        {showCode && (
          <pre className="mt-2 p-3 rounded-xl bg-[#1E1B2E] text-[#A5B4FC] text-xs font-mono overflow-x-auto animate-pop">
            {`${
              era.id === '2026'
                ? '// AI 不是拿画笔画图，而是直接写出下面这样的着色器与 3D 几何代码：'
                : '<!-- AI 不是拿画笔画图，而是像写作文一样输出这串 SVG 坐标代码： -->'
            }\n${era.codeSnippet}`}
          </pre>
        )}
      </div>
    </section>
  )
}
