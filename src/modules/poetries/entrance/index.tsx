import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'

import { poetryCategories } from '../manifest'
import {
  createPoetryItemVariants,
  createPoetryMediaVariants,
  createPoetryPageVariants,
  poetryHoverTransition,
} from '../motion'

export default function PoetryEntrance() {
  const shouldReduceMotion = useReducedMotion()
  const pageVariants = createPoetryPageVariants(shouldReduceMotion)
  const itemVariants = createPoetryItemVariants(shouldReduceMotion)
  const mediaVariants = createPoetryMediaVariants(shouldReduceMotion)

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="py-10 md:py-12 lg:py-16"
    >
      <div className="base-container">
        <div className="flex flex-col gap-4 md:gap-6">
          {poetryCategories.map((catalog, index) => {
            return (
              <motion.div
                key={catalog.slug}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={poetryHoverTransition}
              >
                <Link
                  to={`/poetries/${catalog.slug}`}
                  className="group relative block min-h-44 overflow-hidden sm:min-h-52 md:min-h-60 lg:min-h-68"
                >
                  <motion.img
                    variants={mediaVariants}
                    src={catalog.image}
                    srcSet={catalog.imageSrcSet}
                    sizes="(min-width: 1280px) 1040px, (min-width: 1024px) 800px, 100vw"
                    alt={catalog.alt}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/15 to-black/45 transition duration-700 group-hover:from-black/30 group-hover:via-black/8 group-hover:to-black/30" />
                  <div className="absolute inset-0 bg-white/0 transition duration-700 group-hover:bg-white/5" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-white">
                    <h1 className="font-mashanzheng text-3xl tracking-wide sm:text-4xl md:text-5xl">
                      {catalog.title}
                    </h1>
                    <p className="text-xs font-medium tracking-wider text-white/80 uppercase sm:text-xs">
                      {catalog.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
