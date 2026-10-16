import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/contexts/theme'

// Global ink multiplier: every streak renders 20% quieter.
const ALPHA_SCALE = 0.8
// ±1.5° per-drop jitter: removes perfect parallelism between streaks.
const ANGLE_JITTER = Math.PI / 120
// Base slant direction: top-right towards bottom-left (≈20° from vertical).
const BASE_ANGLE = Math.atan2(0.34, Math.sqrt(1 - 0.34 ** 2))
// Exponent < 1 biases landing depths toward the near ground (denser bottom).
const DEPTH_BIAS = 0.6
// Portion of the travel used to fade a drop in after it spawns.
const FADE_IN_PORTION = 0.15
// Contact flash life on near landings, in seconds.
const FLASH_DURATION = 0.09
const FRAME_INTERVAL = 1_000 / 45
// Wind intensity wave amplitude: rain breathes between 0.65× and 1.35×.
const GUST_AMPLITUDE = 0.35
// Virtual ground-plane horizon. Landings only exist below it.
const HORIZON_RATIO = 0.34
// Depth threshold separating the soft far layer from the near layer.
const NEAR_SPLIT = 0.56
// Render at the canvas's full calculated resolution so streak edges stay crisp.
const RENDER_SCALE = 1
// Share of landings that actually bloom a ripple.
const RIPPLE_PROBABILITY = 0.72
// Keep ripple strokes and contact flashes clear of the canvas bottom edge.
const RIPPLE_BOTTOM_GUTTER = 8
// Lateral spread of landings: far band compresses, near band overflows.
const SPREAD_FAR = 0.72
const SPREAD_NEAR = 1.3
// ±1.5° slow global wind drift over ~14 seconds.
const SWAY_ANGLE = Math.PI / 120
const SWAY_PERIOD = 13.7
const TAU = Math.PI * 2

interface DropFlash {
  alpha: number
  radius: number
}

type DropKind = 'land' | 'pierce'

interface DropSpawnOptions {
  colors: SceneColors
  context: CanvasRenderingContext2D
  gust: number
  height: number
  initial: boolean
  scale: number
  speed: number
  width: number
}

interface RainBackgroundProps {
  density?: number
  scale?: number
  speed?: number
}

interface RainDrop {
  angleJitter: number
  depth: number
  duration: number
  elapsed: number
  endX: number
  endY: number
  fadeOutPortion: number
  gradient: CanvasGradient
  length: number
  lineWidth: number
  pierce: boolean
  travel: number
}

interface RainRipple {
  age: number
  alpha: number
  aspect: number
  depth: number
  duration: number
  flash: DropFlash | null
  maxWidth: number
  x: number
  y: number
}

interface SceneColors {
  rain: string
  ripple: string
}

export default function RainBackground({
  density = 1,
  scale = 1,
  speed = 1,
}: RainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    let animationFrame = 0
    let drops: RainDrop[] = []
    let height = 0
    let lastFrame = performance.now()
    let ripples: RainRipple[] = []
    let sceneTime = 0
    let width = 0

    const colors = readSceneColors()

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextHeight = Math.max(1, entry.contentRect.height)
      const nextWidth = Math.max(1, entry.contentRect.width)
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25) * RENDER_SCALE

      height = nextHeight
      width = nextWidth
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      drops = createDrops(density, {
        colors,
        context,
        gust: getGust(sceneTime),
        height,
        initial: true,
        scale,
        speed,
        width,
      })
      ripples = []

      drawScene({
        colors,
        context,
        drops,
        height,
        ripples,
        sway: getSway(sceneTime),
        width,
      })
    })

    resizeObserver.observe(canvas)

    if (!shouldReduceMotion) {
      const render = (time: number) => {
        const elapsed = time - lastFrame

        if (elapsed >= FRAME_INTERVAL) {
          const delta = Math.min(elapsed / 1_000, 0.05)

          lastFrame = time - (elapsed % FRAME_INTERVAL)
          sceneTime += delta

          const gust = getGust(sceneTime)

          updateScene({
            colors,
            context,
            delta,
            drops,
            gust,
            height,
            ripples,
            scale,
            speed,
            width,
          })
          drawScene({
            colors,
            context,
            drops,
            height,
            ripples,
            sway: getSway(sceneTime),
            width,
          })
        }

        animationFrame = requestAnimationFrame(render)
      }

      animationFrame = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
    }
  }, [density, scale, shouldReduceMotion, speed, theme])

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
      ref={canvasRef}
    />
  )
}

function addRipple(ripples: RainRipple[], ripple: RainRipple) {
  ripples.push(ripple)

  if (ripples.length > 72) {
    ripples.shift()
  }
}

function addRipples(ripples: RainRipple[], drop: RainDrop, sceneScale: number) {
  const depth = drop.depth
  const duration = lerp(0.64, 1.05, Math.random())
  const isNear = depth >= NEAR_SPLIT
  const flash: DropFlash | null = isNear
    ? {
        alpha: lerp(0.45, 0.7, depth),
        radius: lerp(1.4, 2.6, depth) * sceneScale,
      }
    : null
  const ripple: RainRipple = {
    age: 0,
    alpha: lerp(0.15, 0.4, depth),
    aspect: lerp(0.1, 0.14, depth),
    depth,
    duration,
    flash,
    maxWidth: lerp(10, 46, depth) * sceneScale,
    x: drop.endX,
    y: drop.endY,
  }

  addRipple(ripples, ripple)

  if (Math.random() < (isNear ? 0.45 : 0.12)) {
    addRipple(ripples, {
      age: -lerp(0.15, 0.25, Math.random()),
      alpha: ripple.alpha * 0.65,
      aspect: ripple.aspect,
      depth,
      duration: duration * 0.75,
      flash: null,
      maxWidth: ripple.maxWidth * lerp(0.6, 0.75, Math.random()),
      x: ripple.x,
      y: ripple.y,
    })
  }
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function createDrop(kind: DropKind, options: DropSpawnOptions): RainDrop {
  const {
    colors,
    context,
    gust,
    height,
    initial,
    scale,
    speed,
    width,
  } = options
  const pierce = kind === 'pierce'
  const depth = pierce ? 1 : Math.random() ** DEPTH_BIAS
  const isFar = !pierce && depth < NEAR_SPLIT
  const angleJitter = (Math.random() - 0.5) * 2 * ANGLE_JITTER
  const responsiveScale = clamp(Math.min(width / 1_000, height / 720), 0.68, 1.12) * scale
  const gustLength = lerp(0.92, 1.1, gust)
  const length = (pierce ? lerp(40, 64, Math.random()) : lerp(8, 42, depth ** 1.25))
    * responsiveScale
    * gustLength
  // Far drops fake atmospheric softness with wide, dim strokes instead of a
  // per-frame blur filter, which the compositor would pay for every frame.
  const lineWidth = pierce
    ? lerp(1.6, 2, Math.random())
    : isFar
      ? lerp(2.1, 1.16, depth / NEAR_SPLIT)
      : lerp(0.6, 1.6, depth)
  const headAlpha = (pierce
    ? lerp(0.45, 0.6, Math.random())
    : lerp(0.14, 0.6, depth)
      * (isFar ? 0.6 : 1)
      * lerp(0.85, 1.15, Math.random())) * ALPHA_SCALE
  const tailAlpha = headAlpha * (pierce ? 0.5 : lerp(0.25, 0.5, depth))
  const gradient = context.createLinearGradient(0, 0, 0, -length)

  gradient.addColorStop(0, withAlpha(colors.rain, headAlpha))
  gradient.addColorStop(1, withAlpha(colors.rain, tailAlpha))

  const velocity = (pierce ? lerp(420, 560, Math.random()) : lerp(140, 380, depth))
    * lerp(0.86, 1.14, Math.random())
    * lerp(0.9, 1.1, gust)
    * speed
  let endX: number
  let endY: number
  let travel: number

  if (pierce) {
    const angle = BASE_ANGLE + angleJitter
    const startX = width * lerp(0.05, 1.25, Math.random())
    const startY = -lerp(20, 60, Math.random()) * responsiveScale

    travel = (height - startY) / Math.cos(angle) + 40 * responsiveScale
    endX = startX - Math.sin(angle) * travel
    endY = startY + Math.cos(angle) * travel
  }
  else {
    const horizonY = height * HORIZON_RATIO
    const spread = lerp(SPREAD_FAR, SPREAD_NEAR, depth)
    const bottomInset = RIPPLE_BOTTOM_GUTTER * Math.max(1, responsiveScale)
    const landingHeight = Math.max(0, height - horizonY - bottomInset)

    endY = horizonY + landingHeight * depth
    endX = width / 2 + (Math.random() - 0.5) * width * spread

    // Spawn anywhere between just above the top edge and just short of the
    // landing point, so streaks fall across the whole frame instead of
    // only texturing the ground band.
    const maxStartY = Math.max(endY - 48 * responsiveScale, endY * 0.5)
    const startY = lerp(-height * 0.06, maxStartY, Math.random())

    travel = (endY - startY) / Math.cos(BASE_ANGLE + angleJitter)
  }

  const duration = travel / velocity
  const elapsed = initial
    ? Math.random() * duration
    : -(pierce ? lerp(0.4, 1.6, Math.random()) : lerp(0.25, 1.5, Math.random())) / gust

  return {
    angleJitter,
    depth,
    duration,
    elapsed,
    endX,
    endY,
    fadeOutPortion: pierce ? 0.12 : 0.1,
    gradient,
    length,
    lineWidth,
    pierce,
    travel,
  }
}

function createDrops(density: number, options: DropSpawnOptions): RainDrop[] {
  const total = clamp(
    Math.round((options.width * options.height * density) / 40_000),
    14,
    56,
  )
  // Pierce drops are a fixed sparse set: the closest layer crossing the view.
  const pierceCount = clamp(
    Math.round((options.width * options.height) / 475_000),
    2,
    4,
  )
  const landCount = Math.max(total - pierceCount, 8)
  const drops: RainDrop[] = []

  for (let slot = 0; slot < landCount; slot += 1) {
    drops.push(createDrop('land', options))
  }

  for (let slot = 0; slot < pierceCount; slot += 1) {
    drops.push(createDrop('pierce', options))
  }

  return drops
}

function drawDrops(
  context: CanvasRenderingContext2D,
  drops: RainDrop[],
  near: boolean,
  sway: number,
) {
  context.lineCap = 'round'

  for (const drop of drops) {
    const isNear = drop.pierce || drop.depth >= NEAR_SPLIT

    if (isNear !== near) continue
    if (drop.elapsed < 0 || drop.elapsed >= drop.duration) continue

    const progress = drop.elapsed / drop.duration
    const eased = progress ** 1.1
    const angle = BASE_ANGLE + drop.angleJitter + sway
    const remaining = drop.travel * (1 - eased)
    const x = drop.endX + Math.sin(angle) * remaining
    const y = drop.endY - Math.cos(angle) * remaining
    const fadeIn = clamp(progress / FADE_IN_PORTION, 0, 1)
    const fadeOut = clamp((1 - progress) / drop.fadeOutPortion, 0, 1)

    context.save()
    context.translate(x, y)
    context.rotate(angle)
    context.globalAlpha = Math.min(fadeIn, fadeOut)
    context.lineWidth = drop.lineWidth
    context.strokeStyle = drop.gradient
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(0, -drop.length)
    context.stroke()
    context.restore()
  }

  context.globalAlpha = 1
}

function drawRipples(
  context: CanvasRenderingContext2D,
  ripples: RainRipple[],
  colors: SceneColors,
  near: boolean,
) {
  context.lineCap = 'round'
  context.lineWidth = 1
  context.strokeStyle = colors.ripple

  for (const ripple of ripples) {
    if ((ripple.depth >= NEAR_SPLIT) !== near) continue
    if (ripple.age < 0) continue

    const progress = clamp(ripple.age / ripple.duration, 0, 1)
    const eased = 1 - (1 - progress) ** 3
    const width = lerp(4, ripple.maxWidth, eased)

    context.globalAlpha = ripple.alpha * (1 - progress)
    context.beginPath()
    context.ellipse(
      ripple.x,
      ripple.y,
      width / 2,
      width * ripple.aspect / 2,
      0,
      0,
      TAU,
    )
    context.stroke()

    if (ripple.flash && ripple.age < FLASH_DURATION) {
      const flashProgress = ripple.age / FLASH_DURATION

      context.fillStyle = colors.rain
      context.globalAlpha = ripple.flash.alpha * (1 - flashProgress) ** 2
      context.beginPath()
      context.arc(ripple.x, ripple.y, ripple.flash.radius, 0, TAU)
      context.fill()
    }
  }

  context.globalAlpha = 1
}

function drawScene(options: {
  colors: SceneColors
  context: CanvasRenderingContext2D
  drops: RainDrop[]
  height: number
  ripples: RainRipple[]
  sway: number
  width: number
}) {
  const { colors, context, drops, height, ripples, sway, width } = options

  context.clearRect(0, 0, width, height)
  drawRipples(context, ripples, colors, false)
  drawDrops(context, drops, false, sway)
  drawRipples(context, ripples, colors, true)
  drawDrops(context, drops, true, sway)
}

function getGust(time: number) {
  return 1 + GUST_AMPLITUDE * (
    0.5 * Math.sin(time * TAU / 9.3)
    + 0.3 * Math.sin(time * TAU / 17.7 + 1.3)
    + 0.2 * Math.sin(time * TAU / 31 + 4)
  )
}

function getSway(time: number) {
  return SWAY_ANGLE * Math.sin(time * TAU / SWAY_PERIOD + 2)
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function readSceneColors(): SceneColors {
  const styles = getComputedStyle(document.documentElement)

  return {
    rain: styles.getPropertyValue('--foreground').trim() || '#4e4e4e',
    ripple: styles.getPropertyValue('--muted-foreground').trim() || '#777169',
  }
}

function updateScene(options: {
  colors: SceneColors
  context: CanvasRenderingContext2D
  delta: number
  drops: RainDrop[]
  gust: number
  height: number
  ripples: RainRipple[]
  scale: number
  speed: number
  width: number
}) {
  const { colors, context, delta, drops, gust, height, ripples, scale, speed, width } = options
  const spawnOptions: DropSpawnOptions = {
    colors,
    context,
    gust,
    height,
    initial: false,
    scale,
    speed,
    width,
  }

  for (let index = 0; index < drops.length; index += 1) {
    const drop = drops[index]

    drop.elapsed += delta

    if (drop.elapsed < 0) continue

    const progress = drop.elapsed / drop.duration

    if (progress >= 1) {
      if (!drop.pierce && Math.random() < RIPPLE_PROBABILITY) {
        addRipples(ripples, drop, scale)
      }

      drops[index] = createDrop(drop.pierce ? 'pierce' : 'land', spawnOptions)
      continue
    }
  }

  for (let index = ripples.length - 1; index >= 0; index -= 1) {
    const ripple = ripples[index]

    ripple.age += delta

    if (ripple.age >= ripple.duration) {
      ripples.splice(index, 1)
    }
  }
}

function withAlpha(color: string, alpha: number) {
  const hex = color.startsWith('#') ? color.slice(1) : ''
  const value = hex.length === 3
    ? hex.split('').map(part => part + part).join('')
    : hex
  const blue = Number.parseInt(value.slice(4, 6), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const red = Number.parseInt(value.slice(0, 2), 16)

  if (Number.isNaN(blue) || Number.isNaN(green) || Number.isNaN(red)) {
    return `rgba(120, 113, 105, ${alpha})`
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
