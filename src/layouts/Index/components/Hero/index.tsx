import { motion } from 'motion/react'

export function Hero() {
  return (
    <section className="main-container h-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-9xl leading-26 font-gravitas-one bg-gradient-to-r from-sky-500 via-gray-300 to-slate-100 bg-clip-text text-transparent select-none"
      >
        <p>
          Hello World
        </p>
      </motion.div>
    </section>
  )
}
