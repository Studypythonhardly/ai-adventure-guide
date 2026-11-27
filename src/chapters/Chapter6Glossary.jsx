import { useState, useMemo } from 'react'
import { GLOSSARY_TERMS, SAFETY_RULES, GRADUATION_QUIZ, CONTENT_UPDATED_AT } from '../data/courseData'
import { celebrate } from '../lib/browser'
import { Search, ShieldAlert, GraduationCap, Award, CheckCircle2, XCircle, Printer } from 'lucide-react'

const CATEGORIES = ['全部', '核心原理', '2026 前沿', '实用技巧', '行业常识', '避坑必懂']
const AUDIENCES = [
  { id: 'kid5', label: '🧒 5岁小朋友版' },
  { id: 'beginner', label: '🧑 零基础小白版' },
  { id: 'worker', label: '💼 职场实用版' },
]

function formatCertDate(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date()
  if (Number.isNaN(d.getTime())) return CONTENT_UPDATED_AT
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function Chapter6Glossary({ isCompleted, onComplete, nickname = '', setNickname, graduatedAt }) {
  const [activeTab, setActiveTab] = useState('glossary') // 'glossary' | 'safety' | 'grad'
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [audience, setAudience] = useState('kid5')

  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchCat = category === '全部' || t.category === category
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.oneLiner.toLowerCase().includes(q) ||
        t.audiences[audience].toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category, audience])

  const correctCount = GRADUATION_QUIZ.reduce(
    (acc, q) => (answers[q.id] === q.correct ? acc + 1 : acc),
    0
  )
  const allAnswered = Object.keys(answers).length === GRADUATION_QUIZ.length
  const passed = submitted && correctCount >= 4

  const handleSubmitQuiz = () => {
    setSubmitted(true)
    if (correctCount >= 4) {
      if (!isCompleted) onComplete('ch6')
      celebrate({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
    }
  }

  return (
    <div className="space-y-6 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3 no-print">
        <span
          className="w-12 h-12 rounded-2xl bg-[#E8F6FE] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🎓
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">06 · AI 黑话翻译局 & 毕业典礼</h1>
      </div>

      {/* 3-Tab Switcher (No more endless scrolling past 19 glossary cards!) */}
      <div
        className="sticky top-[68px] z-20 p-1.5 rounded-2xl bg-[#FFFBF5]/95 backdrop-blur border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] grid grid-cols-3 gap-1.5 no-print"
        role="tablist"
        aria-label="第 6 关内容切换"
      >
        {[
          { id: 'glossary', label: `📖 黑话词典 (${GLOSSARY_TERMS.length})` },
          { id: 'safety', label: `🛡️ 防坑法则 (${SAFETY_RULES.length})` },
          { id: 'grad', label: isCompleted ? '🏆 毕业证书 ✓' : '🎓 毕业考 & 领证' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-[#1E1B2E] text-white shadow-[2px_2px_0_#0EA5E9]'
                : 'bg-white text-[#1E1B2E] hover:bg-[#EEF0FF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ELI5 Glossary */}
      {activeTab === 'glossary' && (
        <section className="card-playful p-5 sm:p-7 space-y-5 no-print animate-pop">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-black text-[#1E1B2E]">📖 AI 黑话翻译局</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="讲解档位切换">
              {AUDIENCES.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  aria-pressed={audience === a.id}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                    audience === a.id
                      ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                      : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/25 hover:border-[#1E1B2E]'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="glossary-search" className="sr-only">
                搜索 AI 术语
              </label>
              <Search className="w-4 h-4 text-[#6B6685] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="glossary-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜术语（Token、RAG、MCP、Agent、Skill、Lean、幻觉）..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1E1B2E]/25 bg-[#FFFBF5] text-sm font-medium focus:outline-none focus:border-[#5B4BFF]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="术语分类筛选">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold border-2 cursor-pointer transition-all ${
                    category === c
                      ? 'bg-[#1E1B2E] text-white border-[#1E1B2E]'
                      : 'bg-white text-[#37334D] border-[#1E1B2E]/15 hover:border-[#1E1B2E]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map((item) => (
              <article
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/20 hover:border-[#1E1B2E] transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
                    <h3 className="font-black text-base text-[#1E1B2E]">{item.term}</h3>
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white border border-[#1E1B2E]/20 text-[#595470] shrink-0">
                    {item.category}
                  </span>
                </div>

                <div className="text-xs font-extrabold text-[#5B4BFF]">{item.oneLiner}</div>

                <div className="p-3 rounded-xl bg-white border border-[#1E1B2E]/10 text-xs sm:text-sm text-[#37334D] leading-relaxed">
                  {item.audiences[audience]}
                </div>
              </article>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-sm text-[#595470]">没有搜到相关词条，换个关键词试试吧！</div>
          )}
        </section>
      )}

      {/* TAB 2: Safety Rules */}
      {activeTab === 'safety' && (
        <section className="space-y-4 no-print animate-pop">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-black text-[#1E1B2E] flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#FF6B57]" aria-hidden="true" /> 用 AI 必背 {SAFETY_RULES.length} 条防坑与合规法则
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('grad')}
              className="btn-playful px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-black cursor-pointer"
            >
              去毕业挑战 →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAFETY_RULES.map((rule) => (
              <div key={rule.title} className="card-playful p-5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-[#1E1B2E]"
                    style={{ backgroundColor: `${rule.color}20` }}
                    aria-hidden="true"
                  >
                    {rule.emoji}
                  </span>
                  <h3 className="font-black text-base text-[#1E1B2E]">{rule.title}</h3>
                </div>
                <p className="text-sm text-[#45405C] leading-relaxed">{rule.eli5}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Graduation Challenge & Certificate */}
      {activeTab === 'grad' && (
        <section className="card-playful p-5 sm:p-8 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#FEF6E4] space-y-6 print-section animate-pop">
          <div className="no-print">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#5B4BFF]" aria-hidden="true" />
              终极毕业挑战（答对 4/{GRADUATION_QUIZ.length} 题解锁证书）
            </h2>
          </div>

          <div className="space-y-4 no-print">
            {GRADUATION_QUIZ.map((q, idx) => {
              const chosen = answers[q.id]
              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1E1B2E]/15 space-y-3">
                  <div className="font-black text-sm sm:text-base text-[#1E1B2E]">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="space-y-2" role="group" aria-label={`毕业挑战第 ${idx + 1} 题`}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = chosen === optIdx
                      const showRight = submitted && optIdx === q.correct
                      const showWrong = submitted && isSelected && optIdx !== q.correct
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => {
                            if (!submitted) setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }}
                          aria-pressed={isSelected}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            showRight
                              ? 'bg-[#E8FBF3] border-[#10B981] text-[#065F46]'
                              : showWrong
                              ? 'bg-[#FFF0ED] border-[#FF6B57] text-[#9A3412]'
                              : isSelected
                              ? 'bg-[#EEF0FF] border-[#5B4BFF] text-[#3A2EDB]'
                              : 'bg-[#FFFBF5] border-[#1E1B2E]/15 text-[#37334D] hover:border-[#1E1B2E]'
                          }`}
                        >
                          <span>{opt}</span>
                          {showRight && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />}
                          {showWrong && <XCircle className="w-4 h-4 text-[#FF6B57] shrink-0" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                  {submitted && (
                    <div className="text-xs text-[#45405C] bg-[#FFFBF5] p-2.5 rounded-lg border border-[#1E1B2E]/10">
                      💡 {q.feedback}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 no-print">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="btn-playful px-7 py-3.5 rounded-2xl bg-[#5B4BFF] text-white font-black text-base cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              >
                🎓 提交答卷，领取毕业证书
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                }}
                className="btn-playful px-5 py-2.5 rounded-xl bg-white text-[#1E1B2E] font-extrabold text-sm cursor-pointer"
              >
                🔄 重新挑战
              </button>
            )}
            {submitted && (
              <span className="text-sm font-black text-[#1E1B2E]" role="status">
                成绩：{correctCount} / {GRADUATION_QUIZ.length}{' '}
                {passed ? '🎉 恭喜毕业！' : '💪 答对 4 题即可拿证书！'}
              </span>
            )}
          </div>

          {(passed || isCompleted) && (
            <div className="mt-6 space-y-4 animate-pop">
              <div className="flex flex-wrap items-center gap-3 no-print">
                <label htmlFor="cert-nickname" className="text-xs font-black text-[#1E1B2E]">
                  ✍️ 证书署名：
                </label>
                <input
                  id="cert-nickname"
                  value={nickname}
                  maxLength={24}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="输入你的名字"
                  className="px-3.5 py-2 rounded-xl border-2 border-[#1E1B2E] bg-white text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
                />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-playful px-4 py-2 rounded-xl bg-[#10B981] text-white font-black text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" /> 打印 / 存 PDF
                </button>
              </div>

              <div className="print-certificate p-7 sm:p-10 rounded-3xl bg-white border-4 border-[#1E1B2E] shadow-[8px_8px_0_#5B4BFF] text-center space-y-4 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FEF6E4] border-2 border-[#1E1B2E] text-xs font-black text-[#92400E]">
                  <Award className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" /> HONORARY CERTIFICATE
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">
                  🏆 AI 奇妙漫游指南 · 荣誉毕业证书
                </h3>
                <p className="text-sm sm:text-base text-[#45405C]">兹证明</p>
                <div className="text-3xl sm:text-4xl font-black text-[#5B4BFF] underline decoration-wavy decoration-[#FF6B57] underline-offset-8">
                  {nickname.trim() || '勇敢的 AI 探险家'}
                </div>
                <p className="text-sm sm:text-base text-[#37334D] max-w-xl mx-auto leading-relaxed pt-2">
                  已完成《AI 奇妙漫游指南》核心互动课程：掌握了大语言模型原理、前沿案例与工具选型、R-T-C-F 提示词与 AI Skill、零代码网页制作，以及 {GLOSSARY_TERMS.length} 个核心术语与安全防坑法则！
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold text-[#595470]">
                  <span>🏅 称号：AI 未来领航员</span>
                  <span>📅 日期：{formatCertDate(graduatedAt)}</span>
                  <span>✨ AI 奇妙漫游学院</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default Chapter6Glossary
