import { useState, useEffect } from 'react'
import { RotateCcw, ArrowRight, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

const DEMOS = [
  {
    id: 'report',
    tab: '📝 流水账变周报',
    durationMs: 6000,
    inputText: '这周修了3个页面报错，跟设计定了一版活动海报，周三开了2小时需求会，下周准备把新活动页上线。',
    steps: ['拆解零散流水账', '提炼业务价值', '输出结构化周报'],
    targetId: 'cases',
    targetLabel: '去案例库复制同款咒语',
  },
  {
    id: 'contract',
    tab: '📄 合同标红排雷',
    durationMs: 6000,
    inputText: '帮我看看这段租房合同有什么坑，给我修改建议。',
    steps: ['通读合同条款', '标红 2 处高风险霸王条款', '生成沟通修改话术'],
    targetId: 'cases',
    targetLabel: '去案例库看完整排雷模板',
  },
  {
    id: 'table',
    tab: '📊 表格自动找异常',
    durationMs: 6000,
    inputText: '这周数据表哪天最异常？直接给我结论和下一步建议。',
    steps: ['读取明细数据', '定位周三异常波动', '生成复盘结论'],
    targetId: 'cases',
    targetLabel: '去案例库看数据分析模板',
  },
  {
    id: 'miniapp',
    tab: '🛠️ 一句话做排期看板',
    durationMs: 6000,
    inputText: '帮我做一个本周工作排期小工具，点一下能打勾，自动算完成率！',
    steps: ['生成页面布局', '接入点击勾选逻辑', '实时渲染可用成品'],
    targetId: 'ch5',
    targetLabel: '去第 5 关亲手做一个带回家',
  },
]

const TABLE_ROWS = [
  { day: '周一', visits: 1240, orders: 62, rate: '5.0%', abnormal: false },
  { day: '周二', visits: 1310, orders: 68, rate: '5.2%', abnormal: false },
  { day: '周三', visits: 1280, orders: 36, rate: '2.8%', abnormal: true },
  { day: '周四', visits: 1420, orders: 84, rate: '5.9%', abnormal: false },
]

export function AiActionAnimations({ onNavigate }) {
  const [demoIdx, setDemoIdx] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [playSeed, setPlaySeed] = useState(0)
  // Interactive mini-app checkboxes for Demo 4
  const [miniTasks, setMiniTasks] = useState([
    { id: 1, text: '完成 Q4 指标复盘', done: true },
    { id: 2, text: '确认活动海报终稿', done: false },
    { id: 3, text: '同步下周上线排期', done: false },
  ])

  const demo = DEMOS[demoIdx]

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const diff = Date.now() - start
      if (diff >= demo.durationMs) {
        setElapsedMs(demo.durationMs)
        clearInterval(timer)
      } else {
        setElapsedMs(diff)
      }
    }, 60)
    return () => clearInterval(timer)
  }, [demoIdx, playSeed, demo.durationMs])

  // Stage progression over 6 seconds:
  // 0 ~ 1.8s: User typing input
  // 1.8 ~ 3.2s: AI processing
  // 3.2 ~ 6.0s: Real output reveals progressively
  const typedCount = Math.min(
    demo.inputText.length,
    Math.floor((elapsedMs / 1700) * demo.inputText.length)
  )
  const typedInput = demo.inputText.slice(0, typedCount)
  const isProcessing = elapsedMs >= 1650 && elapsedMs < 3100
  const showOutput1 = elapsedMs >= 3000
  const showOutput2 = elapsedMs >= 4100
  const showOutput3 = elapsedMs >= 5100
  const progressPct = Math.min(100, Math.round((elapsedMs / demo.durationMs) * 100))

  const miniDone = miniTasks.filter((t) => t.done).length
  const miniPct = Math.round((miniDone / miniTasks.length) * 100)

  const handleSelectDemo = (idx) => {
    setDemoIdx(idx)
    setElapsedMs(0)
    setPlaySeed((s) => s + 1)
  }

  const handleReplay = () => {
    setElapsedMs(0)
    setPlaySeed((s) => s + 1)
  }

  return (
    <section className="card-playful p-5 sm:p-6 space-y-4 bg-white">
      {/* Top Bar: Tabs + Replay */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="AI 实例演示">
          {DEMOS.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={demoIdx === idx}
              onClick={() => handleSelectDemo(idx)}
              className={`px-3.5 py-2 rounded-xl border-2 text-xs sm:text-sm font-black cursor-pointer transition-all ${
                demoIdx === idx
                  ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[2px_2px_0_#5B4BFF]'
                  : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/20 hover:border-[#1E1B2E]'
              }`}
            >
              {d.tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReplay}
          className="px-3 py-1.5 rounded-xl bg-[#FFFBF5] hover:bg-[#EEF0FF] border-2 border-[#1E1B2E]/25 text-xs font-black text-[#1E1B2E] inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>重播 6 秒过程</span>
        </button>
      </div>

      {/* 6-second Live Playback Bar */}
      <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5B4BFF] transition-all duration-100"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Split Live Stage: Left = What Human Gives | Right = What AI Produces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT: Human Input */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="text-xs font-black text-[#595470]">🧑 你发给 AI 的原话</div>

            {/* Typing chat bubble */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#1E1B2E] text-sm font-bold text-[#1E1B2E] leading-relaxed min-h-[76px]">
              {typedInput}
              {elapsedMs < 1750 && (
                <span className="inline-block w-0.5 h-4 bg-[#5B4BFF] ml-0.5 align-middle animate-pulse" />
              )}
            </div>

            {/* Extra raw material for Contract or Table demos */}
            {demo.id === 'contract' && (
              <div className="p-3 rounded-xl bg-white border border-[#1E1B2E]/15 text-xs text-[#45405C] leading-relaxed space-y-1.5">
                <div className="font-black text-[#1E1B2E]">附件：租房合同（节选）</div>
                <p>
                  第 6 条：租期一年，租金按季支付。
                  <span
                    className={`transition-colors duration-300 px-1 rounded ${
                      elapsedMs >= 2600 ? 'bg-[#FECACA] text-[#991B1B] font-bold' : ''
                    }`}
                  >
                    乙方提前退租需扣除 3 个月押金作为违约金。
                  </span>
                </p>
                <p>
                  第 11 条：
                  <span
                    className={`transition-colors duration-300 px-1 rounded ${
                      elapsedMs >= 3200 ? 'bg-[#FDE68A] text-[#92400E] font-bold' : ''
                    }`}
                  >
                    合同到期前未书面通知，视为自动按原价续约一年。
                  </span>
                </p>
              </div>
            )}

            {demo.id === 'table' && (
              <div className="rounded-xl bg-white border border-[#1E1B2E]/15 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F3F4F6] text-[#595470]">
                    <tr>
                      <th className="py-1.5 px-2.5">日期</th>
                      <th className="py-1.5 px-2.5">访客</th>
                      <th className="py-1.5 px-2.5">成交</th>
                      <th className="py-1.5 px-2.5">转化率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS.map((r) => (
                      <tr
                        key={r.day}
                        className={`border-t border-[#1E1B2E]/10 transition-colors duration-300 ${
                          r.abnormal && elapsedMs >= 2600 ? 'bg-[#FEE2E2] font-black text-[#991B1B]' : 'text-[#37334D]'
                        }`}
                      >
                        <td className="py-1.5 px-2.5">{r.day}</td>
                        <td className="py-1.5 px-2.5">{r.visits}</td>
                        <td className="py-1.5 px-2.5">{r.orders}</td>
                        <td className="py-1.5 px-2.5">{r.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Live AI step indicator */}
          <div className="pt-2 border-t border-[#1E1B2E]/10 flex flex-wrap gap-1.5">
            {demo.steps.map((st, idx) => {
              const reached = elapsedMs >= 1700 + idx * 1100
              return (
                <span
                  key={st}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    reached
                      ? 'bg-[#E8FBF3] text-[#047857] border-[#10B981]'
                      : 'bg-white text-[#8E89A6] border-[#1E1B2E]/15'
                  }`}
                >
                  {reached ? '✓ ' : '· '}
                  {st}
                </span>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Real AI Output */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#1E1B2E] text-white flex flex-col justify-between space-y-4 min-h-[260px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-[#A5B4FC]">🤖 AI 给你的直接成品</span>
              {isProcessing && <span className="text-[#FDE047] animate-pulse">正在处理中...</span>}
              {elapsedMs >= demo.durationMs && <span className="text-[#34D399]">✓ 已生成</span>}
            </div>

            {!showOutput1 ? (
              <div className="py-12 text-center text-sm text-white/60">
                {elapsedMs < 1650 ? '等待输入完成...' : 'AI 正在理解你的内容并组织结果...'}
              </div>
            ) : (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {/* DEMO 1 OUTPUT: Polished Weekly Report */}
                {demo.id === 'report' && (
                  <>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 animate-pop">
                      <div className="font-black text-[#34D399] mb-1">一、本周核心成果</div>
                      <ul className="space-y-1 text-white/90">
                        <li>• 修复 3 项线上页面报错，保障主流程稳定运行</li>
                        <li>• 完成活动视觉海报定稿，推进跨组需求对齐</li>
                      </ul>
                    </div>
                    {showOutput2 && (
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 animate-pop">
                        <div className="font-black text-[#FDE047] mb-1">二、下周重点计划</div>
                        <p className="text-white/90">• 完成新活动页开发测试并按期上线，同步监控首日转化数据</p>
                      </div>
                    )}
                    {showOutput3 && (
                      <div className="text-xs font-bold text-[#A5B4FC] animate-pop">
                        ✨ 语气专业不浮夸，直接复制即可发给主管！
                      </div>
                    )}
                  </>
                )}

                {/* DEMO 2 OUTPUT: Contract Risks + Negotiation Script */}
                {demo.id === 'contract' && (
                  <>
                    <div className="p-3 rounded-xl bg-[#F43F5E]/20 border border-[#F43F5E]/60 animate-pop flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#FDA4AF] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <div className="font-black text-[#FDA4AF]">高风险（第 6 条）：违约金过高</div>
                        <p className="text-white/90 mt-0.5">提前退租扣 3 个月押金明显偏高，通常协商为 1 个月。</p>
                      </div>
                    </div>
                    {showOutput2 && (
                      <div className="p-3 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/60 animate-pop">
                        <div className="font-black text-[#FDE68A]">中风险（第 11 条）：隐性自动续约</div>
                        <p className="text-white/90 mt-0.5">建议补充“到期前 30 天双方书面确认后再续约”。</p>
                      </div>
                    )}
                    {showOutput3 && (
                      <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/60 animate-pop">
                        <div className="font-black text-[#6EE7B7] mb-0.5">💬 直接可发的沟通话术：</div>
                        <p className="text-white/95">“房东您好，条款基本没问题，第 6 条违约金改成 1 个月、第 11 条加上提前 30 天确认，改好我今天就签！”</p>
                      </div>
                    )}
                  </>
                )}

                {/* DEMO 3 OUTPUT: Table Anomaly + Bar Chart + Action */}
                {demo.id === 'table' && (
                  <>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 animate-pop space-y-2">
                      <div className="font-black text-[#FDA4AF]">🔴 异常定位：周三转化率骤降 46%（5.2% → 2.8%）</div>
                      <div className="grid grid-cols-4 gap-2 items-end h-16 pt-2">
                        {[
                          { d: '周一', h: '76%', c: '#6366F1' },
                          { d: '周二', h: '80%', c: '#6366F1' },
                          { d: '周三', h: '40%', c: '#F43F5E' },
                          { d: '周四', h: '94%', c: '#10B981' },
                        ].map((b) => (
                          <div key={b.d} className="flex flex-col items-center h-full justify-end gap-1">
                            <div
                              className="w-full max-w-[36px] rounded-t-md transition-all duration-500"
                              style={{ height: b.h, backgroundColor: b.c }}
                            />
                            <span className="text-[10px] text-white/75">{b.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {showOutput2 && (
                      <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/60 animate-pop">
                        <div className="font-black text-[#6EE7B7]">📌 结论与行动建议：</div>
                        <p className="text-white/90 mt-0.5">访客数没掉但成交腰斩，优先排查周三下单页面或活动入口变更；周四已反弹至 5.9%。</p>
                      </div>
                    )}
                  </>
                )}

                {/* DEMO 4 OUTPUT: REAL CLICKABLE MINI SCHEDULE BOARD */}
                {demo.id === 'miniapp' && (
                  <div className="p-3.5 rounded-xl bg-white text-[#1E1B2E] space-y-3 animate-pop">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">📅 本周排期小看板（可直接点打勾！）</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B4BFF]">
                        完成 {miniPct}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] transition-all duration-300"
                        style={{ width: `${miniPct}%` }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {miniTasks.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            setMiniTasks((prev) =>
                              prev.map((item) => (item.id === t.id ? { ...item, done: !item.done } : item))
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                            t.done
                              ? 'bg-[#E8FBF3] border-[#10B981] text-[#065F46] line-through'
                              : 'bg-[#FFFBF5] border-[#1E1B2E]/20 text-[#1E1B2E] hover:border-[#5B4BFF]'
                          }`}
                        >
                          {t.done ? (
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#6B6685] shrink-0" aria-hidden="true" />
                          )}
                          <span>{t.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate(demo.targetId)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5B4BFF] hover:bg-[#4338CA] text-white text-xs font-black flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>{demo.targetLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
