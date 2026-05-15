import './index.css'

import { Github, Send } from 'lucide-react'
import { motion } from 'motion/react'

import { GITHUB_LINK } from '@/constants'

import { HeroImageCard } from './components/hero-image-card'

const heroImages = [
  {
    id: 1,
    src: '/images/bc603030dabf48723ece562bc43ad844.png',
    animate: { translateX: -16, rotate: -8 },
  },
  {
    id: 2,
    src: '/images/bc603030dabf48723ece562bc43ad844.png',
    animate: { translateX: 0, rotate: -0 },
  },
  {
    id: 3,
    src: '/images/bc603030dabf48723ece562bc43ad844.png',
    animate: { translateX: 16, rotate: 8 },
  },
]

export default function Home() {
  const handleGithubClick = () => {
    window.location.href = GITHUB_LINK
  }

  return (
    <div>
      <section className="py-8 sm:py-10 md:py-12 lg:py-20">
        <div className="base-container relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-8 xl:order-2">
            <div className="mx-auto size-40">
              {heroImages.map(image => (
                <div key={image.id} className="absolute size-40">
                  <HeroImageCard src={image.src} animate={image.animate} />
                </div>
              ))}
            </div>

            <div>
              <h1 className="home-hero-title text-center text-4xl font-bold select-none xl:text-5xl">
                Forever{' '}
                <span className="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-2xl font-extrabold text-transparent xl:text-3xl">
                  Leslie
                </span>
              </h1>
            </div>

            <div className="flex items-center justify-end gap-4 xl:justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2"
              >
                <Send size={16} />
                <span>Contact me</span>
              </button>
              <button
                onClick={handleGithubClick}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-blue-500/50 px-4 py-2"
              >
                <Github size={16} />
                <span>Github</span>
              </button>
            </div>
          </div>

          <div className="leading-xl space-y-8 tracking-wide opacity-90 xl:order-1 xl:w-1/2 xl:text-lg">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Hello there! I'm not just a <strong>frontend engineer</strong>—I'm
              a digital wizard who turns caffeine into responsive, pixel-perfect
              interfaces. When I'm not wrestling with CSS or convincing
              JavaScript to behave, you'll find me deep in the browser DevTools,
              hunting down rogue bugs like a detective in a digital noir film.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              I'm a man with salt in my veins and code in my soul—originally
              from <strong>Zhanjiang</strong>, <strong>Guangdong</strong>, where
              the sea taught me patience and how to ride the waves of
              ever-changing web trends. 😉
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  )
}
