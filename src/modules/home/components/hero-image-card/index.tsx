import type { CSSProperties } from 'react'

interface HeroImageCardProps {
  animate: { rotate: number, translateX: number }
  src: string
  srcSet: string
}
export function HeroImageCard(props: HeroImageCardProps) {
  const { animate, src, srcSet } = props
  const style = {
    '--hero-card-rotate': `${animate.rotate}deg`,
    '--hero-card-translate-x': `${animate.translateX}px`,
  } as CSSProperties

  return (
    <div
      className="inline-block size-40 overflow-hidden rounded-2xl border border-hairline bg-card p-2 shadow-soft motion-safe:animate-[hero-card-enter_500ms_ease-out_250ms_both] dark:border-white/10 dark:bg-dark-elevated"
      style={style}
    >
      <img
        alt="Profile illustration"
        className="size-full rounded-xl object-cover"
        decoding="async"
        fetchPriority="high"
        height={160}
        loading="eager"
        sizes="160px"
        src={src}
        srcSet={srcSet}
        width={160}
      />
    </div>
  )
}
