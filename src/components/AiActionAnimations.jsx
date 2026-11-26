import React, { useState, useEffect } from 'react'
import { Play, Pause, Layers, ArrowRight } from 'lucide-react'

const SCENES = [
  {
    id: 'contract',
    tab: '01 · 长文档风控审查',
    category: '法务 / 办公提效',
    title: '68 页合作协议智能审阅：自动识别风险条款与缺失项',
    metric: '审阅耗时：3 小时 ➔ 45 秒',
    eli5: '就像请了一位自带“高亮荧光笔”的资深法务助理：几万字的长文档一秒通读，把违约责任、隐性续约和权责不对等的条款逐条摘出来，并直接附上修改建议。',
    tools: '代表能力：Kimi / Claude / DeepSeek（超长上下文）',
    accent: '#6366F1',
  },
  {
    id: 'bi_data',
    tab: '02 · 经营数据自动洞察',
    category: '数据分析 / 业务复盘',
    title: '万行报表一键解析：自动生成可视化趋势与归因简报',
    metric: '复盘准备：半天 ➔ 2 分钟',
    eli5: '不用再对着密密麻麻的表格发呆或死记公式——把脱敏后的周期数据传给 AI，它自动算出环比波动、揪出异常增长或下滑的真正原因，直接输出可上会汇报的结论。',
    tools: '代表能力：DeepSeek / GPT / 通义千问（代码解释器）',
    accent: '#0EA5E9',
  },
  {
    id: 'agent_flow',
    tab: '03 · 智能体跨系统协同',
    category: '2026 核心趋势：Agent + MCP',
    title: '一句指令驱动全流程：检索资料、归类汇总、自动分发',
    metric: '人工反复复制粘贴 ➔ 全自动闭环',
    eli5: '2026 年的 AI 不再只是陪聊窗口，而是像一位能同时打开多个办公软件的项目助理：通过 MCP 标准接口，自动查资料、整理 500 条用户反馈、生成周报草稿并推送待办。',
    tools: '代表能力：AI Agent + MCP 万能工具协议',
    accent: '#10B981',
  },
  {
    id: 'app_build',
    tab: '04 · 零代码定制业务工具',
    category: 'Vibe Coding / 办公自动化',
    title: '用自然语言描述需求，5 分钟生成可运行的专属对账/查询工具',
    metric: '外包排期 2 周 ➔ 5 分钟即时可用',
    eli5: '遇到两张财务流水对不上、或者需要一个内部排班/查询小网页时，不必等排期开发——用大白话讲清规则，AI 直接写出单文件本地网页，数据不上传、打开即用。',
    tools: '代表能力：Claude / Cursor / Trae / Antigravity',
    accent: '#8B5CF6',
  },
]

export function AiActionAnimations() {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % SCENES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [autoPlay])

  const scene = SCENES[sceneIdx]

  return (
    <section className="card-playful p-5 sm:p-7 space-y-5 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1B2E] text-white text-xs font-black mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" /> 真实工作流动态演示
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
            AI 在真实工作与专业场景中如何创造价值？
          </h2>
          <p className="text-xs sm:text-sm text-[#595470] mt-0.5">
            点击切换 4 大高频正式场景，直观查看 AI 从“输入信息”到“产出结果”的完整工作流。
          </p>
        </div>

        <button
          onClick={() => setAutoPlay((v) => !v)}
          className={`btn-playful px-4 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
            autoPlay ? 'bg-[#FF6B57] text-white' : 'bg-[#1E1B2E] text-white'
          }`}
        >
          {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoPlay ? '暂停演示轮播' : '自动轮播演示'}</span>
        </button>
      </div>

      {/* Formal Segmented Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SCENES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setAutoPlay(false)
              setSceneIdx(idx)
            }}
            className={`px-3.5 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
              sceneIdx === idx
                ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[3px_3px_0_#6366F1]'
                : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/15 hover:border-[#1E1B2E]'
            }`}
          >
            <div className="text-xs sm:text-sm font-black truncate">{s.tab}</div>
            <div
              className={`text-[11px] font-bold mt-0.5 truncate ${
                sceneIdx === idx ? 'text-[#A5B4FC]' : 'text-[#595470]'
              }`}
            >
              {s.category}
            </div>
          </button>
        ))}
      </div>

      {/* Main Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sleek Dark Tech Demo Canvas */}
        <div className="lg:col-span-7 rounded-2xl border-2 border-[#1E1B2E] shadow-[5px_5px_0_#1E1B2E] overflow-hidden bg-[#0F172A]">
          {/* Window Chrome Header */}
          <div className="px-4 py-2 bg-[#1E293B] border-b border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-slate-200">{scene.tab} · 实时流程模拟</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
              AI RUNNING
            </span>
          </div>

          <svg viewBox="0 0 540 260" className="w-full h-56 sm:h-64 block select-none">
            <defs>
              <pattern id="techGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#334155" strokeWidth="0.6" opacity="0.45" />
              </pattern>
              <linearGradient id="scanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chartBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="540" height="260" fill="url(#techGrid)" />

            {/* ==================== 01: FORMAL CONTRACT & RISK AUDIT ==================== */}
            {scene.id === 'contract' && (
              <g>
                {/* Left Document Panel */}
                <rect x="28" y="26" width="186" height="208" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="1.8" />
                <rect x="28" y="26" width="186" height="30" rx="12" fill="#334155" />
                <text x="42" y="45" fontSize="11" fontWeight="800" fill="#F8FAFC">合作协议_终稿.pdf · 68页</text>

                {/* Document Lines */}
                <rect x="42" y="70" width="142" height="6" rx="3" fill="#64748B" />
                <rect x="42" y="84" width="124" height="6" rx="3" fill="#64748B" />
                {/* Highlighted Risk Clause 1 */}
                <rect x="38" y="98" width="166" height="26" rx="6" fill="#F43F5E" opacity="0.18" stroke="#F43F5E" strokeWidth="1.2" />
                <rect x="44" y="105" width="146" height="5" rx="2.5" fill="#FDA4AF" />
                <rect x="44" y="114" width="110" height="5" rx="2.5" fill="#FDA4AF" />

                <rect x="42" y="136" width="150" height="6" rx="3" fill="#64748B" />
                <rect x="42" y="150" width="118" height="6" rx="3" fill="#64748B" />
                {/* Highlighted Risk Clause 2 */}
                <rect x="38" y="164" width="166" height="26" rx="6" fill="#F59E0B" opacity="0.18" stroke="#F59E0B" strokeWidth="1.2" />
                <rect x="44" y="171" width="138" height="5" rx="2.5" fill="#FDE68A" />
                <rect x="44" y="180" width="96" height="5" rx="2.5" fill="#FDE68A" />

                <rect x="42" y="204" width="130" height="6" rx="3" fill="#64748B" />

                {/* Laser Scan Bar */}
                <g className="anim-scan">
                  <rect x="28" y="64" width="186" height="3" fill="#38BDF8" />
                  <rect x="28" y="67" width="186" height="26" fill="url(#scanGlow)" />
                </g>

                {/* Animated Data Flow Connector */}
                <path d="M216 130 C248 130, 248 130, 286 130" fill="none" stroke="#6366F1" strokeWidth="3" className="anim-dash-flow" />
                <circle cx="252" cy="130" r="18" fill="#4F46E5" stroke="#A5B4FC" strokeWidth="2" className="anim-hub-ring" />
                <text x="242" y="134" fontSize="11" fontWeight="900" fill="#FFFFFF">AI</text>

                {/* Right Risk Audit Report Panel */}
                <rect x="292" y="26" width="220" height="208" rx="12" fill="#1E293B" stroke="#6366F1" strokeWidth="1.8" />
                <text x="308" y="50" fontSize="12" fontWeight="900" fill="#E0E7FF">风险审查摘要报告</text>
                <rect x="438" y="36" width="60" height="18" rx="9" fill="#10B981" opacity="0.2" />
                <text x="448" y="49" fontSize="10" fontWeight="800" fill="#34D399">已完成</text>

                {/* Risk Item 1 */}
                <rect x="306" y="66" width="192" height="44" rx="8" fill="#0F172A" stroke="#F43F5E" strokeWidth="1.2" />
                <text x="316" y="83" fontSize="10" fontWeight="900" fill="#FB7185">● 高风险 · 第 14.2 条 违约金比例</text>
                <text x="316" y="100" fontSize="9.5" fill="#CBD5E1">单方解约金达 30%，建议下调至 10%</text>

                {/* Risk Item 2 */}
                <rect x="306" y="118" width="192" height="44" rx="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
                <text x="316" y="135" fontSize="10" fontWeight="900" fill="#FBBF24">● 中风险 · 第 22.1 条 自动续约</text>
                <text x="316" y="152" fontSize="9.5" fill="#CBD5E1">未约定提前 30 天书面提醒义务</text>

                {/* Action Output */}
                <rect x="306" y="172" width="192" height="46" rx="8" fill="#10B981" opacity="0.14" stroke="#10B981" strokeWidth="1.2" />
                <text x="316" y="191" fontSize="10" fontWeight="900" fill="#34D399">✓ 已生成 3 条标准修订批注</text>
                <text x="316" y="207" fontSize="9.5" fill="#A7F3D0">支持一键导出 Word 修订对照版</text>
              </g>
            )}

            {/* ==================== 02: EXECUTIVE BI & DATA INSIGHT ==================== */}
            {scene.id === 'bi_data' && (
              <g>
                {/* Left Raw CSV Table */}
                <rect x="24" y="28" width="154" height="204" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="1.8" />
                <text x="36" y="50" fontSize="11" fontWeight="800" fill="#E2E8F0">月度明细.xlsx</text>
                <text x="36" y="65" fontSize="9.5" fill="#94A3B8">12,480 行原始记录</text>
                {[82, 104, 126, 148, 170, 192].map((ry, i) => (
                  <g key={ry} className="anim-slide-line" style={{ animationDelay: `${i * 0.25}s` }}>
                    <rect x="36" y={ry} width="38" height="12" rx="3" fill="#334155" />
                    <rect x="80" y={ry} width="42" height="12" rx="3" fill="#334155" />
                    <rect x="128" y={ry} width="38" height="12" rx="3" fill={i === 2 ? '#0EA5E9' : '#475569'} opacity="0.85" />
                  </g>
                ))}

                {/* Pipeline Flow */}
                <path d="M180 130 L238 130" fill="none" stroke="#38BDF8" strokeWidth="3" className="anim-dash-flow" />
                <polygon points="236,123 248,130 236,137" fill="#38BDF8" />

                {/* Right BI Dashboard */}
                <rect x="252" y="28" width="264" height="204" rx="12" fill="#1E293B" stroke="#0EA5E9" strokeWidth="1.8" />
                <text x="268" y="50" fontSize="12" fontWeight="900" fill="#E0F2FE">经营趋势与异常归因</text>
                <rect x="414" y="36" width="88" height="20" rx="10" fill="#10B981" opacity="0.2" />
                <text x="424" y="50" fontSize="10" fontWeight="900" fill="#34D399">转化率 +18.4%</text>

                {/* Animated Bar Chart */}
                <line x1="270" y1="154" x2="496" y2="154" stroke="#475569" strokeWidth="1.5" />
                <rect x="284" y="106" width="28" height="48" rx="5" fill="url(#chartBarGrad)" className="anim-bar-1" />
                <rect x="330" y="92" width="28" height="62" rx="5" fill="url(#chartBarGrad)" className="anim-bar-2" />
                <rect x="376" y="114" width="28" height="40" rx="5" fill="#F59E0B" className="anim-bar-3" />
                <rect x="422" y="72" width="28" height="82" rx="5" fill="#10B981" className="anim-bar-4" />
                <text x="288" y="168" fontSize="9" fill="#94A3B8">W1</text>
                <text x="334" y="168" fontSize="9" fill="#94A3B8">W2</text>
                <text x="380" y="168" fontSize="9" fill="#FBBF24">W3↓</text>
                <text x="426" y="168" fontSize="9" fill="#34D399">W4↑</text>

                {/* Insight Summary Card */}
                <rect x="268" y="178" width="232" height="42" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
                <text x="278" y="195" fontSize="10" fontWeight="800" fill="#38BDF8">AI 核心结论：W4 增长来自复购客群提升</text>
                <text x="278" y="211" fontSize="9.5" fill="#CBD5E1">建议：下周优先复盘 W3 流失环节并放大主力渠道</text>
              </g>
            )}

            {/* ==================== 03: AUTONOMOUS AGENT + MCP WORKFLOW ==================== */}
            {scene.id === 'agent_flow' && (
              <g>
                {/* Left Natural Language Trigger */}
                <rect x="20" y="88" width="136" height="84" rx="12" fill="#1E293B" stroke="#A5B4FC" strokeWidth="1.8" />
                <text x="32" y="110" fontSize="10" fontWeight="900" fill="#A5B4FC">自然语言目标指令</text>
                <text x="32" y="130" fontSize="10" fill="#F8FAFC">“汇总本周 500 条</text>
                <text x="32" y="146" fontSize="10" fill="#F8FAFC">反馈，出复盘简报</text>
                <text x="32" y="162" fontSize="10" fill="#F8FAFC">并同步给相关团队”</text>

                {/* Connector to Hub */}
                <path d="M158 130 L210 130" fill="none" stroke="#10B981" strokeWidth="3" className="anim-dash-flow" />

                {/* Central Agent Hub */}
                <circle cx="250" cy="130" r="38" fill="#10B981" opacity="0.16" className="anim-hub-ring" />
                <circle cx="250" cy="130" r="28" fill="#065F46" stroke="#34D399" strokeWidth="2.5" />
                <text x="233" y="127" fontSize="11" fontWeight="900" fill="#FFFFFF">Agent</text>
                <text x="234" y="142" fontSize="9" fontWeight="800" fill="#A7F3D0">调度中枢</text>

                {/* Animated Bezier Branches to 4 Tool Nodes */}
                <path d="M280 118 C320 118, 320 50, 358 50" fill="none" stroke="#38BDF8" strokeWidth="2.5" className="anim-dash-flow" />
                <path d="M280 126 C320 126, 320 104, 358 104" fill="none" stroke="#818CF8" strokeWidth="2.5" className="anim-dash-flow" />
                <path d="M280 134 C320 134, 320 158, 358 158" fill="none" stroke="#34D399" strokeWidth="2.5" className="anim-dash-flow" />
                <path d="M280 142 C320 142, 320 212, 358 212" fill="none" stroke="#FBBF24" strokeWidth="2.5" className="anim-dash-flow" />

                {/* 4 MCP Tool Nodes */}
                {[
                  { y: 28, title: '1. 知识库与表格读取', status: '500条已载入', color: '#38BDF8' },
                  { y: 82, title: '2. 情感与痛点自动归类', status: 'Top3已提取', color: '#818CF8' },
                  { y: 136, title: '3. 自动排版周报文档', status: '已生成终稿', color: '#34D399' },
                  { y: 190, title: '4. 飞书/邮件待办推送', status: '待人工确认', color: '#FBBF24' },
                ].map((node) => (
                  <g key={node.title}>
                    <rect x="360" y={node.y} width="160" height="44" rx="10" fill="#1E293B" stroke={node.color} strokeWidth="1.6" />
                    <text x="372" y={node.y + 18} fontSize="10.5" fontWeight="800" fill="#F8FAFC">{node.title}</text>
                    <text x="372" y={node.y + 34} fontSize="9.5" fontWeight="700" fill={node.color}>✓ {node.status}</text>
                  </g>
                ))}
              </g>
            )}

            {/* ==================== 04: VIBE CODING BUSINESS TOOL ==================== */}
            {scene.id === 'app_build' && (
              <g>
                {/* Left Prompt + AI Code Generator */}
                <rect x="24" y="26" width="214" height="208" rx="12" fill="#1E293B" stroke="#8B5CF6" strokeWidth="1.8" />
                <rect x="36" y="38" width="190" height="40" rx="8" fill="#312E81" stroke="#818CF8" strokeWidth="1.2" />
                <text x="46" y="54" fontSize="9.5" fontWeight="900" fill="#C7D2FE">自然语言需求：</text>
                <text x="46" y="69" fontSize="9.5" fill="#FFFFFF">“做一个两表自动核对差异的小工具”</text>

                <text x="36" y="98" fontSize="9.5" fontWeight="800" fill="#A78BFA">AI 正在实时生成本地代码...</text>
                {[110, 128, 146, 164, 182, 200].map((cy, idx) => (
                  <g key={cy} className="anim-slide-line" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <rect x="36" y={cy} width={idx % 2 === 0 ? 52 : 34} height="8" rx="4" fill="#C084FC" />
                    <rect x={idx % 2 === 0 ? 94 : 76} y={cy} width={idx % 3 === 0 ? 96 : 114} height="8" rx="4" fill="#38BDF8" opacity="0.75" />
                  </g>
                ))}

                {/* Arrow */}
                <path d="M240 130 L278 130" fill="none" stroke="#C084FC" strokeWidth="3" className="anim-dash-flow" />
                <polygon points="276,123 288,130 276,137" fill="#C084FC" />

                {/* Right Live Mini-App Preview */}
                <rect x="292" y="26" width="224" height="208" rx="12" fill="#F8FAFC" stroke="#8B5CF6" strokeWidth="2" />
                <rect x="292" y="26" width="224" height="30" rx="10" fill="#5B4BFF" />
                <text x="306" y="45" fontSize="11" fontWeight="900" fill="#FFFFFF">多表自动对账工具 v1.0</text>

                {/* KPI Pills */}
                <rect x="306" y="68" width="94" height="44" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                <text x="316" y="85" fontSize="9.5" fontWeight="800" fill="#047857">自动匹配成功</text>
                <text x="316" y="103" fontSize="14" fontWeight="900" fill="#065F46">1,240 条</text>

                <rect x="408" y="68" width="94" height="44" rx="8" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1.5" />
                <text x="418" y="85" fontSize="9.5" fontWeight="800" fill="#BE123C">异常差异项</text>
                <text x="418" y="103" fontSize="14" fontWeight="900" fill="#9F1239">3 条标红</text>

                {/* Result Rows */}
                <rect x="306" y="124" width="196" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
                <text x="316" y="141" fontSize="9.5" fontWeight="800" fill="#E11D48">单号 #88412 · 金额差 ¥120.00</text>

                <rect x="306" y="156" width="196" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
                <text x="316" y="173" fontSize="9.5" fontWeight="800" fill="#E11D48">单号 #88509 · 表 B 缺失记录</text>

                <rect x="306" y="192" width="196" height="28" rx="8" fill="#1E1B2E" />
                <text x="348" y="210" fontSize="10" fontWeight="900" fill="#FFFFFF">⬇ 一键导出差异核对清单</text>
              </g>
            )}
          </svg>
        </div>

        {/* Right Side Formal + ELI5 Explanation */}
        <div className="lg:col-span-5 space-y-3.5 animate-pop" key={scene.id}>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-black text-white border border-[#1E1B2E]"
            style={{ backgroundColor: scene.accent }}
          >
            ⚡ {scene.metric}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#1E1B2E] leading-snug">
            {scene.title}
          </h3>
          <div className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15 text-xs sm:text-sm text-[#37334D] leading-relaxed">
            <strong className="text-[#1E1B2E]">💡 ELI5 大白话原理：</strong>
            {scene.eli5}
          </div>
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#EEF0FF]/70 border border-[#5B4BFF]/25 text-xs font-extrabold text-[#3A2EDB]">
            <span>{scene.tools}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  )
}
