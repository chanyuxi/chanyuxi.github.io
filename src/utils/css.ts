export function breakpoint(ranges: { min?: number, max?: number }[]) {
  return (content: string) => {
    return ranges.map(({ min, max }) => {
      if (!min && !max) {
        throw new Error('min or max is required')
      }
      let media = '@media '
      if (min) {
        media += `(min-width: ${min}px) `
      }
      if (max) {
        media += `${min ? 'and ' : ''}(max-width: ${max}px) `
      }
      return `${media}{${content}}`
    }).join('\n')
  }
}

export const mobile = breakpoint([{ max: 768 }])
export const tablet = breakpoint([{ min: 769, max: 1024 }])
