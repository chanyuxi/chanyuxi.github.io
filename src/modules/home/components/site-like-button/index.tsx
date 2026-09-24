import type { CSSProperties } from 'react'

import { Heart, LoaderCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import { useSiteLikes } from './use-site-likes'

interface FlyingHeart {
  duration: number
  id: number
  rotate: number
  x: number
  y: number
}

interface FlyingHeartsProps {
  hearts: FlyingHeart[]
  onComplete: (id: number) => void
}

export function SiteLikeButton() {
  const {
    count,
    hasLikedToday,
    isLoading,
    isSubmitting,
    like,
  } = useSiteLikes()
  const [hearts, setHearts] = useState<FlyingHeart[]>([])
  const nextHeartIdRef = useRef(0)

  const handleClick = () => {
    nextHeartIdRef.current += 1

    const heart: FlyingHeart = {
      duration: 1.2 + Math.random() * 0.4,
      id: nextHeartIdRef.current,
      rotate: (Math.random() - 0.5) * 36,
      x: (Math.random() - 0.5) * 72,
      y: -(56 + Math.random() * 28),
    }

    setHearts(current => [...current, heart])
    like()
  }

  const removeHeart = useCallback((id: number) => {
    setHearts(current => current.filter(heart => heart.id !== id))
  }, [])

  return (
    <Button
      aria-busy={isLoading || isSubmitting}
      aria-label={`Like this site. Current count: ${count ?? 'loading'}`}
      aria-pressed={hasLikedToday}
      className="relative overflow-visible"
      onClick={handleClick}
      type="button"
      variant="outline"
    >
      <Heart
        className={hasLikedToday
          ? 'fill-destructive text-destructive transition-colors duration-300'
          : 'fill-transparent transition-colors duration-300'}
        data-icon="inline-start"
        size={16}
      />
      <span
        aria-live="polite"
        className="inline-flex min-w-4 justify-end text-right text-sm text-muted-foreground tabular-nums dark:text-stone-400"
      >
        {isLoading
          ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-3.5 animate-spin motion-reduce:animate-none"
                />
                <span className="sr-only">Loading likes</span>
              </>
            )
          : <span className="translate-y-0.5">{count ?? '0'}</span>}
      </span>
      <FlyingHearts hearts={hearts} onComplete={removeHeart} />
    </Button>
  )
}

function FlyingHearts({ hearts, onComplete }: FlyingHeartsProps) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible"
    >
      {hearts.map((heart) => {
        const style = {
          '--flying-heart-duration': `${heart.duration}s`,
          '--flying-heart-rotate': `${heart.rotate}deg`,
          '--flying-heart-x': `${heart.x}px`,
          '--flying-heart-y': `${heart.y}px`,
        } as CSSProperties

        return (
          <span
            className="absolute inline-flex text-destructive motion-safe:animate-[flying-heart_var(--flying-heart-duration)_ease-out_forwards] motion-reduce:animate-[flying-heart-reduced_300ms_ease-out_forwards]"
            key={heart.id}
            onAnimationEnd={() => onComplete(heart.id)}
            style={style}
          >
            <Heart className="size-4 fill-current" />
          </span>
        )
      })}
    </span>
  )
}
