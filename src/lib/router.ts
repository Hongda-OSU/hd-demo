import { useCallback, useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL

export interface Route {
  segments: string[]
  query: URLSearchParams
}

function readRoute(): Route {
  const { pathname, search } = window.location
  const path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  return {
    segments: path.split('/').filter(Boolean),
    query: new URLSearchParams(search),
  }
}

/** Reads the current URL and re-renders on back/forward. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onPop = () => setRoute(readRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((path: string, query?: Record<string, string>) => {
    const qs = query ? new URLSearchParams(query).toString() : ''
    window.history.pushState({}, '', BASE + path + (qs ? `?${qs}` : ''))
    setRoute(readRoute())
  }, [])

  const replace = useCallback((path: string, query?: Record<string, string>) => {
    const qs = query ? new URLSearchParams(query).toString() : ''
    window.history.replaceState({}, '', BASE + path + (qs ? `?${qs}` : ''))
    setRoute(readRoute())
  }, [])

  return { route, navigate, replace }
}
