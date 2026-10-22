import { useCallback, useSyncExternalStore } from 'react'

export type Breakpoint = '2xl' | 'lg' | 'md' | 'sm' | 'xl'

const BREAKPOINTS: Record<Breakpoint, string> = {
  '2xl': '96rem',
  'lg': '64rem',
  'md': '48rem',
  'sm': '40rem',
  'xl': '80rem',
}

/** Matches widths at or above the minimum and below the maximum breakpoint. */
export function useBreakpointRange(
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint,
): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS[minBreakpoint]}) and (width < ${BREAKPOINTS[maxBreakpoint]})`,
  )
}

/** Matches widths below the breakpoint. */
export function useMaxBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(width < ${BREAKPOINTS[breakpoint]})`)
}

/** Matches widths at or above the breakpoint. */
export function useMinBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]})`)
}

function getServerSnapshot() {
  return false
}

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mediaQuery = window.matchMedia(query)

    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [query])

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
