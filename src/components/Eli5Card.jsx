import { useState } from 'react'
import { CheckCircle2, Circle, Lock, XCircle } from 'lucide-react'
import { getChapter } from '../lib/progress'

/**
 * ELI5 三段式讲解卡片：
 * 1. 一句话懂它 (What)  2. 生活小比喻 (Analogy)  3. 跟我有啥关系 (So What)
 */
export function Eli5Box({ badge = 'ELI5 秒懂时刻', title, what, analogy, soWhat, accent = '#5B4BFF' }) {
  return (
    <div className="card-playful p-5 sm:p-6 relative overflow-hidden">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white mb-3 badge-pill"
        style={{ backgroundColor: accent }}
      >
        <span aria-hidden="true">💡</span>
        <span>{badge}</span>
      </div>
      {title && <h2 className="text-xl font-black text-[#1E1B2E] mb-3">{title}</h2>}

      <div className="space-y-3 text-sm sm:text-base leading-relaxed">
        <div className="p-3.5 rounded-xl bg-[#FFFBF5] border-2 border-[#1E1B2E]/15">
          <span className="font-extrabold text-[#1E1B2E]">🎯 一句话懂它：</span>
          <span className="text-[#37334D]">{what}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#EEF0FF]/70 border-2 border-[#5B4BFF]/25">
          <span className="font-extrabold text-[#3A2EDB]">🧸 生活小比喻：</span>
          <span className="text-[#2D2A40]">{analogy}</span>
        </div>

        {soWhat && (
          <div className="p-3.5 rounded-xl bg-[#E8FBF3]/80 border-2 border-[#10B981]/30">
            <span className="font-extrabold text-[#047857]">✨ 跟你有什么关系：</span>
            <span className="text-[#1F3A31]">{soWhat}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 单选小测验。答对后调用 onPass；答错可重选。
 */
export function CheckpointQuiz({ quiz, onPass, passed, title = '🧠 通关小测' }) {
  const [chosen, setChosen] = useState(passed ? quiz.correct : null)
  const answered = chosen !== null
  const isCorrect = chosen === quiz.correct

  const handlePick = (idx) => {
    if (answered && isCorrect) return
    setChosen(idx)
    if (idx === quiz.correct) onPass?.()
  }

  return (
    <section className="card-playful p-5 sm:p-6 space-y-3" aria-labelledby={`${quiz.id}-title`}>
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FEF6E4] text-[#92400E] text-xs font-black border border-[#F59E0B]/40">
        {title}
      </span>
      <h2 id={`${quiz.id}-title`} className="font-black text-base sm:text-lg text-[#1E1B2E]">
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
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                right
                  ? 'bg-[#E8FBF3] border-[#10B981] text-[#065F46]'
                  : wrong
                  ? 'bg-[#FFF0ED] border-[#FF6B57] text-[#9A3412]'
                  : 'bg-[#FFFBF5] border-[#1E1B2E]/15 text-[#37334D] hover:border-[#1E1B2E]'
              }`}
            >
              <span>{opt}</span>
              {right && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />}
              {wrong && <XCircle className="w-4 h-4 text-[#FF6B57] shrink-0" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
      <div aria-live="polite">
        {answered && (
          <p
            className={`text-xs sm:text-sm p-3 rounded-xl border ${
              isCorrect
                ? 'bg-[#E8FBF3] border-[#10B981] text-[#065F46]'
                : 'bg-[#FFF0ED] border-[#FF6B57] text-[#9A3412]'
            }`}
          >
            <strong>{isCorrect ? '✅ 答对了！' : '❌ 再想想，可以重新选～'}</strong>{' '}
            {isCorrect && quiz.feedback}
          </p>
        )}
      </div>
    </section>
  )
}

/**
 * 关卡底部：任务清单 + 打卡按钮 + 下一关。
 * missions: [{ id, label, done }]，全部完成才能打卡通关。
 */
export function ChapterFooterNav({ chapterId, isCompleted, onComplete, nextLabel, onNext, missions = [] }) {
  const xpReward = getChapter(chapterId)?.xp ?? 0
  const doneCount = missions.filter((m) => m.done).length
  const allDone = doneCount === missions.length
  const canComplete = !isCompleted && allDone

  return (
    <section
      className="mt-10 card-playful p-5 sm:p-6 bg-gradient-to-r from-[#EEF0FF] via-[#FFFBF5] to-[#FEF6E4] space-y-4"
      aria-label="本关任务与打卡"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-sm font-black text-[#5B4BFF]">
            {isCompleted
              ? '✅ 本关已通关！随时可以回来重温'
              : `🎯 本关任务（${doneCount}/${missions.length}）· 全部完成可得 +${xpReward} XP 与专属徽章`}
          </h2>
          {missions.length > 0 && (
            <ul className="space-y-1.5">
              {missions.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-xs sm:text-sm">
                  {m.done || isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4 mt-0.5 text-[#6B6685] shrink-0" aria-hidden="true" />
                  )}
                  <span className={m.done || isCompleted ? 'text-[#047857] font-bold' : 'text-[#45405C]'}>
                    {m.label}
                    <span className="sr-only">{m.done || isCompleted ? '（已完成）' : '（未完成）'}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isCompleted && (
            <button
              type="button"
              onClick={() => onComplete(chapterId)}
              disabled={!canComplete}
              className="btn-playful px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-extrabold text-sm cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              title={canComplete ? '' : '先完成上面的任务哦'}
            >
              {canComplete ? '🎉' : <Lock className="w-4 h-4" aria-hidden="true" />}
              打卡通关 (+{xpReward} XP)
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="btn-playful px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white font-extrabold text-sm cursor-pointer"
            >
              {nextLabel || '下一关 →'}
            </button>
          )}
        </div>
      </div>
      {!isCompleted && !allDone && (
        <p className="text-xs text-[#595470]">
          💡 可以先逛下一关，但只有完成全部任务才会点亮徽章。任务进度会自动保存在本机浏览器里。
        </p>
      )}
    </section>
  )
}
