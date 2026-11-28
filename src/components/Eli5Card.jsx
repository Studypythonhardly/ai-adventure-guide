import { useState } from 'react'
import { CheckCircle2, Circle, Lock, XCircle } from 'lucide-react'
import { getChapter } from '../lib/progress'

/**
 * 三段式结构化核心卡片：一句话懂它 / 生活比喻 / 与你的关系
 */
export function Eli5Box({ badge = '一分钟秒懂', title, what, analogy, soWhat }) {
  return (
    <div className="card-playful p-5 sm:p-6 bg-white space-y-4">
      <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0A0A0A]">
        {title || badge}
      </h2>

      <div className="grid grid-cols-1 gap-2.5 text-sm leading-relaxed">
        <div className="p-3.5 rounded-lg bg-[#F7F7F8] border border-[#E4E4E7]">
          <span className="font-semibold text-[#0A0A0A]">核心定义：</span>
          <span className="text-[#3F3F46]">{what}</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#F7F7F8] border border-[#E4E4E7]">
          <span className="font-semibold text-[#0A0A0A]">生活比喻：</span>
          <span className="text-[#3F3F46]">{analogy}</span>
        </div>

        {soWhat && (
          <div className="p-3.5 rounded-lg bg-[#ECFDF5]/60 border border-[#A7F3D0]">
            <span className="font-semibold text-[#065F46]">实用意义：</span>
            <span className="text-[#064E3B]">{soWhat}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 单选小测验。答对后调用 onPass；答错可重选。
 */
export function CheckpointQuiz({ quiz, onPass, passed, title = '通关小测' }) {
  const [chosen, setChosen] = useState(passed ? quiz.correct : null)
  const answered = chosen !== null
  const isCorrect = chosen === quiz.correct

  const handlePick = (idx) => {
    if (answered && isCorrect) return
    setChosen(idx)
    if (idx === quiz.correct) onPass?.()
  }

  return (
    <section className="card-playful p-5 sm:p-6 space-y-4 bg-white" aria-labelledby={`${quiz.id}-title`}>
      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F7F7F8] text-[#52525B] text-xs font-medium border border-[#E4E4E7]">
        {title}
      </span>
      <h2 id={`${quiz.id}-title`} className="font-semibold text-base sm:text-lg text-[#0A0A0A]">
        {quiz.question}
      </h2>
      <div className="space-y-2" role="group" aria-label="选项">
        {quiz.options.map((opt, idx) => {
          const selected = chosen === idx
          const right = selected && idx === quiz.correct
          const wrong = selected && idx !== quiz.correct
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handlePick(idx)}
              aria-pressed={selected}
              className={`w-full text-left px-4 py-3 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                right
                  ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                  : wrong
                  ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                  : 'bg-white border-[#E4E4E7] text-[#27272A] hover:border-[#0A0A0A] hover:bg-[#FAFAFA]'
              }`}
            >
              <span>{opt}</span>
              {right && <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />}
              {wrong && <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
      <div aria-live="polite">
        {answered && (
          <p
            className={`text-xs sm:text-sm p-3 rounded-lg border ${
              isCorrect
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
            }`}
          >
            <strong>{isCorrect ? '回答正确。' : '还差一点，可以重新选择。'}</strong>{' '}
            {isCorrect && quiz.feedback}
          </p>
        )}
      </div>
    </section>
  )
}

/**
 * 极简画廊风吸顶页内快速定位条
 */
export function SectionJumpBar({ items = [], missions = [], isCompleted = false }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const doneCount = isCompleted ? missions.length : missions.filter((m) => m.done).length

  return (
    <div className="sticky top-[68px] z-20 px-3 py-2 rounded-xl bg-white/95 backdrop-blur border border-[#E4E4E7] shadow-sm flex flex-wrap items-center justify-between gap-2 no-print">
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className="px-3 py-1 rounded-lg bg-[#F7F7F8] hover:bg-[#0A0A0A] hover:text-white text-xs font-medium text-[#27272A] cursor-pointer transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
      {missions.length > 0 && (
        <button
          type="button"
          onClick={() => scrollToSection('chapter-footer')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border cursor-pointer shrink-0 transition-colors tabular-nums ${
            doneCount === missions.length
              ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
              : 'bg-[#F7F7F8] text-[#52525B] border-[#E4E4E7] hover:border-[#0A0A0A]'
          }`}
        >
          {doneCount === missions.length ? '已完成全部任务' : `任务 ${doneCount}/${missions.length}`}
        </button>
      )}
    </div>
  )
}

/**
 * 关卡底部：任务清单 + 打卡按钮 + 下一课
 */
export function ChapterFooterNav({ chapterId, isCompleted, onComplete, nextLabel, onNext, missions = [] }) {
  const xpReward = getChapter(chapterId)?.xp ?? 0
  const doneCount = missions.filter((m) => m.done).length
  const allDone = doneCount === missions.length
  const canComplete = !isCompleted && allDone

  return (
    <section
      id="chapter-footer"
      className="mt-10 scroll-mt-32 rounded-xl bg-[#F7F7F8] border border-[#E4E4E7] p-5 sm:p-6 space-y-4"
      aria-label="本课任务与打卡"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2.5">
          <h2 className="text-sm font-semibold text-[#0A0A0A]">
            {isCompleted
              ? '本课已完成'
              : `本课互动任务（${doneCount}/${missions.length}）· 完成后可获 +${xpReward} XP`}
          </h2>
          {missions.length > 0 && (
            <ul className="space-y-1.5">
              {missions.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-xs sm:text-sm">
                  {m.done || isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#059669] shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4 mt-0.5 text-[#A1A1AA] shrink-0" aria-hidden="true" />
                  )}
                  <span className={m.done || isCompleted ? 'text-[#065F46] font-medium' : 'text-[#52525B]'}>
                    {m.label}
                    <span className="sr-only">{m.done || isCompleted ? '（已完成）' : '（未完成）'}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!isCompleted && (
            <button
              type="button"
              onClick={() => onComplete(chapterId)}
              disabled={!canComplete}
              className="px-5 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm cursor-pointer inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {!canComplete && <Lock className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>完成打卡 (+{xpReward} XP)</span>
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 rounded-lg bg-[#0A0A0A] hover:bg-[#27272A] text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              {nextLabel || '下一课 →'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
