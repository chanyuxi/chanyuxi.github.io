import { useEffect, useState } from 'react'

export type Breakpoint = '2xl' | 'base' | 'lg' | 'md' | 'sm' | 'xl'

const BREAKPOINTS: { min: number, name: Breakpoint }[] = [
  {
    min: 1536,
    name: '2xl',
  },
  {
    min: 1280,
    name: 'xl',
  },
  {
    min: 1024,
    name: 'lg',
  },
  {
    min: 768,
    name: 'md',
  },
  {
    min: 640,
    name: 'sm',
  },
]

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window === 'undefined' ? 'base' : getBreakpoint(),
  )

  useEffect(() => {
    const onChange = () => setBreakpoint(getBreakpoint())
    window.addEventListener('resize', onChange)
    return () => window.removeEventListener('resize', onChange)
  }, [])

  return breakpoint
}

function getBreakpoint(): Breakpoint {
  const width = window.innerWidth
  return BREAKPOINTS.find(bp => width >= bp.min)?.name ?? 'base'
}
