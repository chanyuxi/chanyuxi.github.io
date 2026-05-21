import type { Transition, Variants } from 'motion/react'

const POETRY_EASE = [0.22, 1, 0.36, 1] as const

const REDUCED_FADE_DURATION = 0.22

export function createPoetryPageVariants(
  shouldReduceMotion: boolean | null
): Variants {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: REDUCED_FADE_DURATION,
          staggerChildren: 0.04,
          delayChildren: 0.03,
        },
      },
    }
  }

  return {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.72,
        ease: POETRY_EASE,
        staggerChildren: 0.1,
        delayChildren: 0.08,
      },
    },
  }
}

export function createPoetryItemVariants(
  shouldReduceMotion: boolean | null
): Variants {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: REDUCED_FADE_DURATION } },
    }
  }

  return {
    hidden: { opacity: 0, y: 28, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.68,
        ease: POETRY_EASE,
      },
    },
  }
}

export function createPoetryMediaVariants(
  shouldReduceMotion: boolean | null
): Variants {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: REDUCED_FADE_DURATION } },
    }
  }

  return {
    hidden: { opacity: 0, scale: 1.04 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.95,
        ease: POETRY_EASE,
      },
    },
  }
}

export const poetryHoverTransition: Transition = {
  duration: 0.45,
  ease: POETRY_EASE,
}
