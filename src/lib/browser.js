// 浏览器相关的小工具：复制、庆祝特效、减少动画偏好
import confetti from 'canvas-confetti'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** 撒花特效：自动尊重系统“减少动画”设置 */
export function celebrate(options = {}) {
  if (prefersReducedMotion()) return
  confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true, ...options })
}

/** 复制文本，优先使用 Clipboard API，失败时回退到 execCommand。返回是否成功 */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}
