import { useState, useMemo, useEffect } from 'react'
import { USE_CASE_CATEGORIES, USE_CASES } from '../data/useCasesData'
import { copyText } from '../lib/browser'
import { Search, Copy, Check, Star, ChevronDown, ChevronUp } from 'lucide-react'

const FAV_STORAGE_KEY = 'ai_adventure_fav_cases_v1'

export function UseCaseLibrary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [expandedId, setExpandedId] = useState(USE_CASES[0].id)
  const [copiedId, setCopiedId] = useState(null)

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCopyPrompt = async (id, text) => {
    if (await copyText(text)) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    }
  }

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase()
    return USE_CASES.filter((c) => {
      if (onlyFavs && !favorites.includes(c.id)) return false
      if (category !== 'all' && c.category !== category) return false
      if (!q) return true
      return (
        c.title.toLowerCase().includes(q) ||
        c.pain.toLowerCase().includes(q) ||
        c.wowProof.toLowerCase().includes(q) ||
        c.tools.some((t) => t.toLowerCase().includes(q)) ||
        c.prompt.toLowerCase().includes(q)
      )
    })
  }, [search, category, onlyFavs, favorites])

  return (
    <div className="space-y-7 animate-pop">
      {/* Compact Header */}
      <div className="flex items-center gap-3">
        <span
          className="w-12 h-12 rounded-2xl bg-[#FEF6E4] border-2 border-[#1E1B2E] shadow-[3px_3px_0_#1E1B2E] flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          🧰
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B2E]">
            AI 实战案例库 ({USE_CASES.length})
          </h1>
        </div>
      </div>

      {/* Sticky Search + Filters */}
      <section className="sticky top-[68px] z-20 card-playful p-3.5 sm:p-4 bg-[#FFFBF5]/95 backdrop-blur space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <label htmlFor="case-search" className="sr-only">
              搜索实战案例
            </label>
            <Search className="w-4 h-4 text-[#6B6685] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="case-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜你想解决的事（如：周报、合同、Excel、体检、旅游、买手机、辅导作业、猫）..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1E1B2E]/25 bg-[#FFFBF5] text-sm font-medium focus:outline-none focus:border-[#5B4BFF]"
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyFavs((v) => !v)}
            aria-pressed={onlyFavs}
            className={`px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all ${
              onlyFavs
                ? 'bg-[#B45309] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                : 'bg-white text-[#1E1B2E] border-[#1E1B2E]/25 hover:border-[#1E1B2E]'
            }`}
          >
            <Star className={`w-4 h-4 ${onlyFavs ? 'fill-current' : ''}`} aria-hidden="true" />
            <span>我的收藏 ({favorites.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="场景分类">
          {USE_CASE_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 cursor-pointer transition-all ${
                category === cat.id
                  ? 'bg-[#5B4BFF] text-white border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E]'
                  : 'bg-[#FFFBF5] text-[#1E1B2E] border-[#1E1B2E]/15 hover:border-[#1E1B2E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Case Cards Grid */}
      {filteredCases.length === 0 ? (
        <div className="card-playful p-10 text-center space-y-2">
          <div className="text-4xl" aria-hidden="true">🔍</div>
          <div className="font-black text-base text-[#1E1B2E]">
            {onlyFavs ? '你还没有收藏任何案例哦！' : '暂时没搜到这个关键词'}
          </div>
          <p className="text-xs sm:text-sm text-[#595470]">
            {onlyFavs
              ? '点一下任意案例右上角的星标按钮，下次来就能一秒找到啦！'
              : '试试换个更简短的词（比如“合同”“英语”“减肥”“表格”），或者点“全部场景”逛逛！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCases.map((item) => {
            const isFav = favorites.includes(item.id)
            const isOpen = expandedId === item.id
            const isCopied = copiedId === item.id
            return (
              <article
                key={item.id}
                className="card-playful p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-11 h-11 rounded-2xl bg-[#FFFBF5] border-2 border-[#1E1B2E] shadow-[2px_2px_0_#1E1B2E] flex items-center justify-center text-2xl shrink-0"
                        aria-hidden="true"
                      >
                        {item.emoji}
                      </span>
                      <div>
                        <span className="inline-block text-[11px] font-black px-2 py-0.5 rounded-full bg-[#E8FBF3] text-[#047857] border border-[#10B981]/40">
                          ⚡ {item.timeCompare}
                        </span>
                        <h2 className="font-black text-base text-[#1E1B2E] mt-1 leading-snug">
                          {item.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFav(item.id)}
                      aria-pressed={isFav}
                      aria-label={isFav ? `取消收藏：${item.title}` : `收藏案例：${item.title}`}
                      className={`p-2 rounded-xl border-2 cursor-pointer transition-all shrink-0 ${
                        isFav
                          ? 'bg-[#FEF6E4] border-[#F59E0B] text-[#B45309]'
                          : 'bg-white border-[#1E1B2E]/15 text-[#6B6685] hover:border-[#1E1B2E]'
                      }`}
                      title={isFav ? '取消收藏' : '收藏常用案例'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Pain Point */}
                  <p className="text-xs sm:text-sm text-[#595470] leading-relaxed">
                    <strong>😩 常见痛点：</strong>
                    {item.pain}
                  </p>

                  {/* Why AI really can do it */}
                  <div className="p-3.5 rounded-xl bg-[#EEF0FF]/70 border-2 border-[#5B4BFF]/20 text-xs sm:text-sm text-[#2D2A40] leading-relaxed">
                    <strong>💡 AI 怎么帮忙：</strong>
                    {item.wowProof}
                  </div>

                  {/* Recommended Tools */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black text-[#595470]">适用工具：</span>
                    {item.tools.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFFBF5] border border-[#1E1B2E]/25 text-[#1E1B2E]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expandable Copy-Ready Prompt Drawer */}
                <div className="pt-2 border-t border-[#1E1B2E]/10 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="text-xs font-black text-[#5B4BFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isOpen ? '收起提示词模板' : '✨ 查看现成提示词模板'}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(item.id, item.prompt)}
                      className="btn-playful px-3 py-1.5 rounded-xl bg-[#1E1B2E] text-white text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#34D399]" aria-hidden="true" />
                          <span>已复制！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>一键复制咒语</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed p-3.5 rounded-xl bg-[#1E1B2E] text-[#F8FAFC] animate-pop">
                      {item.prompt}
                    </pre>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UseCaseLibrary
