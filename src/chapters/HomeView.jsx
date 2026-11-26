import React from 'react'
import { CHAPTERS } from '../data/courseData'
import { USE_CASES } from '../data/useCasesData'
import { AiActionAnimations } from '../components/AiActionAnimations'
import { Sparkles, Play, CheckCircle2, ArrowRight, Trophy } from 'lucide-react'

export function HomeView({ completedChapters, onNavigate, xp, levelInfo }) {
  const learningChapters = CHAPTERS.filter((c) => c.id !== 'home')
  const doneCount = learningChapters.filter((c) => completedChapters.includes(c.id)).length

  return (
    <div className="space-y-8 animate-pop">
      {/* Hero Banner */}
      <section className="card-playful p-6 sm:p-10 bg-gradient-to-br from-[#EEF0FF] via-[#FFFFFF] to-[#FFF0ED] relative overflow-hidden">
        <div className="max-w-3xl lg:pr-48 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF6E4] text-[#92400E] font-extrabold text-xs sm:text-sm badge-pill mb-5">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>2026 零基础互动大冒险 · 全程 ELI5 大白话</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1E1B2E] leading-[1.2]">
            从 0 开始，像玩游戏一样
            <span className="inline-block bg-[#5B4BFF] text-white px-3 py-0.5 rounded-xl mx-1.5 -rotate-1 border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E]">
              彻底搞懂 AI
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#45405C] leading-relaxed">
            完全不懂电脑代码？没关系！这里没有催眠的论文和公式。
            你会亲手滑动 <strong>AI 的大脑脑洞滑块</strong>、围观 AI 如何协助攻破困扰人类 167 年的
            <strong>黎曼猜想</strong>、逛一遍 <strong>2026 前沿 AI 英雄图鉴</strong>，最后甚至
            <strong>不写一行代码，亲手做出一个能下载带回家的网页小作品！</strong>
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('ch1')}
              className="btn-playful px-7 py-3.5 rounded-2xl bg-[#5B4BFF] text-white font-black text-base sm:text-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{doneCount > 0 ? '继续我的 AI 冒险' : '立即出发：第 1 关'}</span>
            </button>

            <button
              onClick={() => onNavigate('cases')}
              className="btn-playful px-5 py-3.5 rounded-2xl bg-[#FEF6E4] text-[#1E1B2E] font-extrabold text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-[#FDE68A]"
            >
              <span>🧰 逛 AI 实战案例库 ({USE_CASES.length}个)</span>
            </button>

            <button
              onClick={() => onNavigate('ch2')}
              className="btn-playful px-5 py-3.5 rounded-2xl bg-[#E8F6FE] text-[#1E1B2E] font-extrabold text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-[#BAE6FD]"
            >
              <span>🚲 围观“鹈鹕骑单车”动画</span>
            </button>

            <button
              onClick={() => onNavigate('ch5')}
              className="btn-playful px-5 py-3.5 rounded-2xl bg-[#FFFFFF] text-[#1E1B2E] font-extrabold text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-[#FEF6E4]"
            >
              <span>🛠️ 零代码做网页</span>
            </button>
          </div>
        </div>

        {/* Playful floating emoji art on desktop */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute right-10 top-1/2 -translate-y-1/2 select-none">
          <div className="text-8xl animate-float">🤖</div>
          <div className="mt-3 px-4 py-1.5 rounded-full bg-white border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] text-xs font-extrabold text-[#1E1B2E]">
            “别怕，我超好聊的！”
          </div>
        </div>
      </section>

      {/* Quick Curiosity Hooks */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-playful p-5 bg-[#FFFBF5]">
          <div className="text-3xl mb-2">🧒</div>
          <h3 className="font-black text-base text-[#1E1B2E]">全程 ELI5 讲人话</h3>
          <p className="text-sm text-[#595470] mt-1.5 leading-relaxed">
            把每个高大上的专业词都变成“切乐高”“找厨师”“翻小抄”的生活比喻，5 岁小朋友都能听懂！
          </p>
        </div>
        <div className="card-playful p-5 bg-[#FFFBF5]">
          <div className="text-3xl mb-2">📐</div>
          <h3 className="font-black text-base text-[#1E1B2E]">紧跟 2026 最前沿</h3>
          <p className="text-sm text-[#595470] mt-1.5 leading-relaxed">
            收录 2026 年 11 月 AI 协助攻破黎曼猜想、Claude / GPT / Gemini / DeepSeek 格局与智能体浪潮。
          </p>
        </div>
        <div className="card-playful p-5 bg-[#FFFBF5]">
          <div className="text-3xl mb-2">🎮</div>
          <h3 className="font-black text-base text-[#1E1B2E]">每关都能动手玩</h3>
          <p className="text-sm text-[#595470] mt-1.5 leading-relaxed">
            不只是看文章！切词实验、咒语炼金、AI 选型器、零代码造物工坊，玩完直接拿毕业证！
          </p>
        </div>
      </section>

      {/* Interactive AI Action Animations Theater */}
      <AiActionAnimations />

      {/* Direct Banner to AI Use Case Library */}
      <section className="card-playful p-5 sm:p-6 bg-gradient-to-r from-[#FEF6E4] via-[#FFFFFF] to-[#E8FBF3] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-black text-[#D97706]">🧰 遇到事不知道 AI 能不能帮？</div>
          <h3 className="text-lg sm:text-xl font-black text-[#1E1B2E]">
            打开「AI 实战案例库」：{USE_CASES.length} 个职场/团队/生活/学习/省钱案例，自带一键复制咒语！
          </h3>
          <p className="text-xs sm:text-sm text-[#595470]">
            周报、Excel 公式、租房合同避坑、体检单翻译、辅导作业、买手机对比……下次随时回来搜着抄作业！
          </p>
        </div>
        <button
          onClick={() => onNavigate('cases')}
          className="btn-playful px-5 py-3 rounded-2xl bg-[#F59E0B] text-white font-black text-sm shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>进入案例库</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Adventure Map */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-[#1E1B2E]">🗺️ 6 关漫游路线图</h2>
            <p className="text-sm text-[#595470]">
              当前称号：{levelInfo.emoji} <strong>{levelInfo.title}</strong> · 已通关{' '}
              <strong>
                {doneCount} / {learningChapters.length}
              </strong>{' '}
              关 · 经验值 {xp} XP
            </p>
          </div>
          {doneCount === learningChapters.length && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-extrabold badge-pill">
              <Trophy className="w-4 h-4" /> 全部通关！
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {learningChapters.map((ch) => {
            const done = completedChapters.includes(ch.id)
            return (
              <button
                key={ch.id}
                onClick={() => onNavigate(ch.id)}
                className="card-playful card-playful-hover p-5 text-left flex flex-col justify-between cursor-pointer group"
                style={{ backgroundColor: done ? '#F0FDF4' : '#FFFFFF' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]"
                      style={{ backgroundColor: ch.bgLight }}
                    >
                      {ch.emoji}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#1E1B2E] border border-[#1E1B2E]/20">
                        第 {ch.number} 关
                      </span>
                      {done && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#1E1B2E] group-hover:text-[#5B4BFF] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-sm text-[#595470] mt-1.5 leading-relaxed">{ch.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E1B2E]/10 flex items-center justify-between text-xs font-extrabold">
                  <span style={{ color: ch.color }}>+{ch.xp} XP · {ch.badge?.emoji} {ch.badge?.name}</span>
                  <span className="inline-flex items-center gap-1 text-[#1E1B2E] group-hover:translate-x-1 transition-transform">
                    {done ? '再玩一次' : '进入关卡'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
