import './index.css'

import { Github, Send } from 'lucide-react'
import { motion } from 'motion/react'

import Button from '@/components/button'
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
              <Button type="button">
                <Send size={16} />
                <span>Contact me</span>
              </Button>
              <Button onClick={handleGithubClick} type="button" variant="solid">
                <Github size={16} />
                <span>Github</span>
              </Button>
            </div>
          </div>

          <div className="leading-xl space-y-8 tracking-wide opacity-90 xl:order-1 xl:w-1/2 xl:text-lg">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Hello there! I'm a frontend engineer focused on building
              responsive, polished, and user-friendly interfaces. Most of my
              work revolves around React, CSS, JavaScript, and the small details
              that make web experiences feel smooth.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              I'm originally from Zhanjiang, Guangdong, a coastal city that
              taught me patience, adaptability, and respect for change. I try to
              bring the same mindset into my work: stay steady, keep improving,
              and build things with care.
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  )
}
