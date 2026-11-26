import { useCallback, useEffect, useState } from 'react'

/**
 * 极简 hash 路由：#/ch1、#/cases……
 * 用 hash 而不是 history API，是因为站点部署在 GitHub Pages 子路径下，刷新不会 404。
 */
export function parseHash(hash, validIds, fallback = 'home') {
  const id = String(hash || '').replace(/^#\/?/, '').split(/[?#]/)[0]
  return validIds.includes(id) ? id : fallback
}

export function useHashRoute(validIds, fallback = 'home') {
  const [route, setRoute] = useState(() => parseHash(window.location.hash, validIds, fallback))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash, validIds, fallback))
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [validIds, fallback])

  const navigate = useCallback(
    (id) => {
      const target = validIds.includes(id) ? id : fallback
      const nextHash = target === fallback ? '' : `#/${target}`
      if (window.location.hash === nextHash || (!nextHash && !window.location.hash)) {
        setRoute(target)
        return
      }
      if (nextHash) {
        window.location.hash = nextHash
      } else {
        // 回首页时去掉 hash，保持网址干净
        window.history.pushState(null, '', window.location.pathname + window.location.search)
        setRoute(target)
      }
    },
    [validIds, fallback]
  )

  return [route, navigate]
}
