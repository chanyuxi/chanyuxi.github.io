import { motion } from 'motion/react'

interface HeroImageCardProps {
  src: string
  animate: { translateX: number; rotate: number }
}
export function HeroImageCard(props: HeroImageCardProps) {
  const { src, animate } = props

  return (
    <motion.div
      initial={{ translateX: 0, rotate: 0 }}
      animate={animate}
      transition={{ duration: 0.5 }}
      className="inline-block size-40 rounded-lg bg-white p-2 shadow-lg transition-shadow dark:shadow-none"
    >
      <img src={src} />
    </motion.div>
  )
}
