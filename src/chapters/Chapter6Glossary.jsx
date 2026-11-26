import React, { useState, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { GLOSSARY_TERMS, SAFETY_RULES, GRADUATION_QUIZ } from '../data/courseData'
import { Search, ShieldAlert, GraduationCap, Award, CheckCircle2, XCircle, Printer } from 'lucide-react'

const CATEGORIES = ['全部', '核心原理', '2026 前沿', '实用技巧', '行业常识', '避坑必懂']
const AUDIENCES = [
  { id: 'kid5', label: '🧒 5岁小朋友版', desc: '超萌玩具与生活比喻' },
  { id: 'beginner', label: '🧑 零基础小白版', desc: '清晰接地气大白话' },
  { id: 'worker', label: '💼 职场实用版', desc: '专业边界与落地用法' },
]

export function Chapter6Glossary({ isCompleted, onComplete, nickname, setNickname }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [audience, setAudience] = useState('kid5')

  // Graduation quiz state
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
  const passed = submitted && correctCount >= 3

  const handleSubmitQuiz = () => {
    setSubmitted(true)
    if (correctCount >= 3) {
      if (!isCompleted) onComplete('ch6')
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
    }
  }

  return (
    <div className="space-y-10 animate-pop">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-[#E8F6FE] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl">
          🎓
        </span>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-[#0284C7]">第 06 关 · 终极修炼 & 毕业</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">AI 黑话翻译局 & 毕业典礼</h1>
        </div>
      </div>

      {/* ELI5 Glossary Section */}
      <section className="card-playful p-5 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8F6FE] text-[#0369A1] text-xs font-black border border-[#0EA5E9]/30 mb-1">
              📖 ELI5 多档位黑话词典（共 {GLOSSARY_TERMS.length} 词）
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E1B2E]">
              听不懂新闻里的 AI 专业词？切换听众档位，一秒翻译成人话！
            </h2>
          </div>

          {/* Signature ELI5 Audience Switcher */}
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                onClick={() => setAudience(a.id)}
                className={`px-3.5 py-2 rounded-xl border-2 text-xs sm:text-sm font-black cursor-pointer transition-all ${
                  audience === a.id
                    ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E]'
                    : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/25 hover:border-[#1E1B2E]'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8E89A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜一个听不懂的 AI 黑话（如：Token、RAG、MCP、Agent、Lean、幻觉）..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1E1B2E]/25 bg-[#FFFBF5] text-sm font-medium focus:outline-none focus:border-[#5B4BFF]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
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

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/20 hover:border-[#1E1B2E] transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <h3 className="font-black text-base text-[#1E1B2E]">{item.term}</h3>
                </div>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white border border-[#1E1B2E]/20 text-[#595470] shrink-0">
                  {item.category}
                </span>
              </div>

              <div className="text-xs font-extrabold text-[#5B4BFF]">
                一句话：{item.oneLiner}
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#1E1B2E]/10 text-xs sm:text-sm text-[#37334D] leading-relaxed">
                <span className="inline-block text-[11px] font-black px-2 py-0.5 rounded-md bg-[#EEF0FF] text-[#3A2EDB] mr-1.5">
                  {AUDIENCES.find((a) => a.id === audience)?.label}
                </span>
                {item.audiences[audience]}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8 text-sm text-[#595470]">
            没有搜到相关词条，换个关键词试试吧！
          </div>
        )}
      </section>

      {/* Safety Rules */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-[#1E1B2E] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#FF6B57]" /> 用 AI 前必背：4 条防坑保命法则
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAFETY_RULES.map((rule) => (
            <div key={rule.title} className="card-playful p-5 space-y-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-[#1E1B2E]"
                  style={{ backgroundColor: `${rule.color}20` }}
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

      {/* Graduation Challenge & Certificate */}
      <section className="card-playful p-5 sm:p-8 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#FEF6E4] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E1B2E] text-white text-xs font-black mb-1">
              <GraduationCap className="w-4 h-4" /> 终极毕业挑战
            </span>
            <h2 className="text-2xl font-black text-[#1E1B2E]">答对 3 题以上，解锁你的 2026 AI 毕业证书！</h2>
          </div>
        </div>

        <div className="space-y-4">
          {GRADUATION_QUIZ.map((q, idx) => {
            const chosen = answers[q.id]
            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1E1B2E]/15 space-y-3">
                <div className="font-black text-sm sm:text-base text-[#1E1B2E]">
                  {idx + 1}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx
                    const showRight = submitted && optIdx === q.correct
                    const showWrong = submitted && isSelected && optIdx !== q.correct
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!submitted) setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }}
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
                        {showRight && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />}
                        {showWrong && <XCircle className="w-4 h-4 text-[#FF6B57] shrink-0" />}
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

        <div className="flex flex-wrap items-center gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className="btn-playful px-7 py-3.5 rounded-2xl bg-[#5B4BFF] text-white font-black text-base cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            >
              🎓 提交答卷，领取毕业证书！
            </button>
          ) : (
            <button
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
              }}
              className="btn-playful px-5 py-2.5 rounded-xl bg-white text-[#1E1B2E] font-extrabold text-sm cursor-pointer"
            >
              🔄 重新挑战一次
            </button>
          )}
          {!submitted && !allAnswered && (
            <span className="text-xs font-bold text-[#595470]">
              还有 {GRADUATION_QUIZ.length - Object.keys(answers).length} 道题没选哦～
            </span>
          )}
          {submitted && (
            <span className="text-sm font-black text-[#1E1B2E]">
              你的成绩：{correctCount} / {GRADUATION_QUIZ.length}{' '}
              {passed ? '🎉 恭喜顺利毕业！' : '💪 再试一次就能拿证书啦！'}
            </span>
          )}
        </div>

        {/* Personalized Graduation Certificate */}
        {(passed || isCompleted) && (
          <div className="mt-6 space-y-4 animate-pop">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-black text-[#1E1B2E]">✍️ 填上你的名字印在证书上：</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入你的昵称"
                className="px-3.5 py-2 rounded-xl border-2 border-[#1E1B2E] bg-white text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
              />
              <button
                onClick={() => window.print()}
                className="btn-playful px-4 py-2 rounded-xl bg-[#10B981] text-white font-black text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> 打印 / 存为 PDF 纪念
              </button>
            </div>

            <div className="p-7 sm:p-10 rounded-3xl bg-white border-4 border-[#1E1B2E] shadow-[8px_8px_0_#5B4BFF] text-center space-y-4 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FEF6E4] border-2 border-[#1E1B2E] text-xs font-black text-[#92400E]">
                <Award className="w-4 h-4 text-[#F59E0B]" /> OFFICIAL 2026 CERTIFICATE
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">
                🏆 AI 奇妙漫游指南 · 荣誉毕业证书
              </h3>
              <p className="text-sm sm:text-base text-[#45405C]">兹证明</p>
              <div className="text-3xl sm:text-4xl font-black text-[#5B4BFF] underline decoration-wavy decoration-[#FF6B57] underline-offset-8">
                {nickname.trim() || '勇敢的 AI 探险家'}
              </div>
              <p className="text-sm sm:text-base text-[#37334D] max-w-xl mx-auto leading-relaxed pt-2">
                已从 0 开始系统通关《AI 奇妙漫游指南》全部核心课程：理解了大语言模型底层原理、见证了 2026 年 AI 协助攻破黎曼猜想的历史时刻、掌握了前沿 AI 英雄选型、R-T-C-F 魔法咒语、AI Skill 技能包与零代码造物技能，并熟知 {GLOSSARY_TERMS.length} 个核心 AI 术语与安全防坑法则！
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold text-[#595470]">
                <span>🏅 授予称号：AI 未来领航员</span>
                <span>📅 颁证日期：2026 年</span>
                <span>✨ 签发机构：AI 奇妙漫游学院</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
