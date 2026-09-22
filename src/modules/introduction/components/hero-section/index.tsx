import { ArrowDown, Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { buttonVariants } from '@/components/ui/button'

import avatar from '../../assets/avatar.png'

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
  const visible = { opacity: 1, y: 0 }

  return (
    <motion.section
      animate={visible}
      className="py-14 sm:py-18 lg:py-24"
      initial={initial}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      <div className="base-container grid gap-10 lg:grid-cols-hero lg:items-center lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-muted-soft uppercase dark:text-stone-500">
            About
          </p>
          <h1 className="text-5xl font-normal tracking-display-hero sm:text-6xl">
            Yongzheng Chen
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Frontend engineer with 3+ years of experience building web and
            mobile products with JavaScript, TypeScript, Vue, and React.
          </p>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            I focus on clear code, reusable components, practical tooling,
            and steady delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className={buttonVariants({ size: 'lg' })}
              href="mailto:2438149743@qq.com"
            >
              <Mail data-icon="inline-start" />
              Email me
            </a>
            <a
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
              href="#experience"
            >
              Experience
              <ArrowDown data-icon="inline-end" />
            </a>
          </div>
        </div>

        <div>
          <img
            alt="Portrait of Yongzheng Chen"
            className="aspect-4/3 w-full rounded-2xl object-cover object-top"
            decoding="async"
            src={avatar}
          />
          <div className="mt-5 grid gap-4 pb-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-soft">Education</p>
              <p className="mt-1 text-ink dark:text-stone-200">
                B.Sc. Computer Science, 2023
              </p>
            </div>
            <div>
              <p className="text-muted-soft">University</p>
              <p className="mt-1 text-ink dark:text-stone-200">
                Guangdong Pharmaceutical University
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
