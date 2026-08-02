import { useEffect, useState } from 'react'

/** Sandpack's own breakpoint — below it, it stacks editor over preview. */
export const NARROW_QUERY = '(max-width: 768px)'

export function isNarrow() {
  return window.matchMedia(NARROW_QUERY).matches
}

/** Tracks the narrow breakpoint, so JS behaviour and CSS agree on one number. */
export function useNarrow() {
  const [narrow, setNarrow] = useState(isNarrow)

  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY)
    const onChange = () => setNarrow(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return narrow
}
