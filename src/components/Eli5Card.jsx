import React from 'react'

/**
 * 严格遵循 ELI5 规范的四段式讲解卡片：
 * 1. 一句话懂它 (What)
 * 2. 生活小比喻 (Analogy)
 * 3. 跟我有啥关系 (So What)
 */
export function Eli5Box({ badge = 'ELI5 秒懂时刻', title, what, analogy, soWhat, accent = '#5B4BFF' }) {
  return (
    <div className="card-playful p-5 sm:p-6 relative overflow-hidden">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white mb-3 badge-pill"
        style={{ backgroundColor: accent }}
      >
        <span>💡</span>
        <span>{badge}</span>
      </div>
      {title && <h3 className="text-xl font-black text-[#1E1B2E] mb-3">{title}</h3>}

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

export function ChapterFooterNav({
  chapterId,
  isCompleted,
  onComplete,
  nextLabel,
  onNext,
  xpReward,
}) {
  return (
    <div className="mt-10 card-playful p-5 sm:p-6 bg-gradient-to-r from-[#EEF0FF] via-[#FFFBF5] to-[#FEF6E4] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div className="text-sm font-bold text-[#5B4BFF]">
          {isCompleted ? '✅ 本关已通关！随时可以回来重温' : `🎁 完成本关即可获得 +${xpReward} 经验值 & 专属徽章`}
        </div>
        <div className="text-xs text-[#595470] mt-1">
          玩懂了上面的互动小实验吗？点右侧按钮打卡并前往下一站！
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {!isCompleted && (
          <button
            onClick={() => onComplete(chapterId)}
            className="btn-playful px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-extrabold text-sm cursor-pointer"
          >
            🎉 打卡通关 (+{xpReward} XP)
          </button>
        )}
        {onNext && (
          <button
            onClick={() => {
              if (!isCompleted) onComplete(chapterId)
              onNext()
            }}
            className="btn-playful px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white font-extrabold text-sm cursor-pointer"
          >
            {nextLabel || '下一关 →'}
          </button>
        )}
      </div>
    </div>
  )
}
