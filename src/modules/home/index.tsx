import { ArrowRight, Github } from 'lucide-react'
import { Link } from 'react-router'

import { buttonVariants } from '@/components/ui/button'
import { GITHUB_LINK, NEXT_STAGE } from '@/constant'

import { HeroImageCard } from './components/hero-image-card'
import { SiteLikeButton } from './components/site-like-button'
import { heroImages } from './constants'

export default function Home() {
  return (
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

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 xl:justify-center">
            <SiteLikeButton />
            <a
              className={buttonVariants()}
              href={GITHUB_LINK}
              rel="noreferrer"
              target="_blank"
            >
              <Github data-icon="inline-start" size={16} />
              <span>Github</span>
            </a>
          </div>
        </div>

        <div className="space-y-6 text-base leading-7 text-muted-foreground xl:order-1 xl:w-1/2 xl:text-lg xl:leading-8 dark:text-stone-300">
          <p className="text-xs font-medium tracking-navigation text-muted-soft uppercase dark:text-stone-500">
            Frontend engineer · Shenzhen
          </p>
          <p className="animate-in duration-500 fade-in motion-reduce:animate-none">
            I'm Yongzheng, a frontend engineer based in Shenzhen. I mostly
            work with React, TypeScript, and CSS, building interfaces and
            fussing over the little details. Some days, that means persuading
            a button to move two pixels.
          </p>
          <p className="animate-in duration-500 fade-in motion-reduce:animate-none">
            I'm originally from Zhanjiang, Guangdong. This is where I share
            the things I build and a few poems along the way. It's a personal
            site, so expect the occasional detour and a permanently
            unfinished to-do list.
          </p>
        </div>
      </div>

      {NEXT_STAGE && (
        <section
          aria-label="About this project"
          className="base-container mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="max-w-2xl space-y-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 dark:text-stone-300">
            <p>
              Built with React, TypeScript, and Vite, styled with Tailwind CSS,
              and hosted on Vercel.
            </p>
            <p>
              A little motion, a few poems, and the occasional
              {' '}
              &ldquo;while I'm here...&rdquo;
              {' '}
              feature.
            </p>
          </div>
        </section>
      )}

      {NEXT_STAGE && (
        <section
          aria-label="AI chat"
          className="base-container mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="max-w-2xl space-y-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 dark:text-stone-300">
            <p>
              Bring a question, a rough idea, or a stubborn bit of code.
              Small talk is optional.
            </p>
            <Link
              className="group inline-flex min-h-10 items-center gap-2 font-medium text-ink underline-offset-4 transition-colors duration-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:text-stone-100"
              to="/ai"
            >
              Open AI chat
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}
    </section>
  )
}
