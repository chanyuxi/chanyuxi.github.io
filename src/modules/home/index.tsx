import { Github, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GITHUB_LINK } from '@/constants'

import { HeroImageCard } from './components/hero-image-card'
import { heroImages } from './constants'

export default function Home() {
  const handleGithubClick = () => {
    window.location.href = GITHUB_LINK
  }

  return (
    <div>
      <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24">
        <div className="relative base-container flex flex-col gap-12 xl:flex-row xl:items-center xl:justify-between xl:gap-20">
          <div className="flex flex-1 flex-col gap-8 xl:order-2">
            <div className="relative mx-auto size-48">
              {heroImages.map(image => (
                <div className="absolute inset-4 size-40" key={image.id}>
                  <HeroImageCard
                    animate={image.animate}
                    src={image.src}
                    srcSet={image.srcSet}
                  />
                </div>
              ))}
            </div>

            <div>
              <h1 className="text-center text-4xl font-normal tracking-display select-none xl:text-5xl">
                Forever
                {' '}
                <span className="text-2xl font-medium text-muted-foreground xl:text-3xl dark:text-stone-400">
                  Leslie
                </span>
              </h1>
            </div>

            <div className="flex items-center justify-end gap-4 xl:justify-center">
              <Button type="button" variant="outline">
                <Send data-icon="inline-start" size={16} />
                <span>Contact me</span>
              </Button>
              <Button onClick={handleGithubClick} type="button">
                <Github data-icon="inline-start" size={16} />
                <span>Github</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6 text-base leading-7 text-muted-foreground xl:order-1 xl:w-1/2 xl:text-lg xl:leading-8 dark:text-stone-300">
            <p className="text-xs font-medium tracking-navigation text-muted-soft uppercase dark:text-stone-500">
              Frontend engineer · Shenzhen
            </p>
            <p className="animate-in duration-500 fade-in motion-reduce:animate-none">
              Hello there! I'm a frontend engineer focused on building
              responsive, polished, and user-friendly interfaces. Most of my
              work revolves around React, CSS, JavaScript, and the small details
              that make web experiences feel smooth.
            </p>
            <p className="animate-in duration-500 fade-in motion-reduce:animate-none">
              I'm originally from Zhanjiang, Guangdong, a coastal city that
              taught me patience, adaptability, and respect for change. I try to
              bring the same mindset into my work: stay steady, keep improving,
              and build things with care.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
