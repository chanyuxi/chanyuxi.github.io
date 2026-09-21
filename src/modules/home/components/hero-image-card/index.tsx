import { motion } from 'motion/react'

interface HeroImageCardProps {
  animate: { rotate: number, translateX: number }
  src: string
}
export function HeroImageCard(props: HeroImageCardProps) {
  const { animate, src } = props

  return (
    <motion.div
      className="inline-block size-40 rounded-lg bg-white p-2 shadow-lg transition-shadow dark:shadow-none"
      initial={{ rotate: 0, translateX: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      whileInView={animate}
    >
      <img
        alt="Profile illustration"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={src}
      />
    </motion.div>
  )
}
