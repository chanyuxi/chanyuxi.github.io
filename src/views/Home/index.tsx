import { CircleCheck, Github, Send } from 'lucide-react'
import { HeroImageCard } from './components/HeroImageCard'
import { motion } from 'motion/react'

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
  return (
    <div>
      <div className="relative my-8 space-y-8 px-6">
        <section className="flex justify-center">
          <div className="size-40">
            {heroImages.map(image => (
              <div key={image.id} className="absolute size-40">
                <HeroImageCard src={image.src} animate={image.animate} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h1 className="text-center text-4xl font-bold">
            Forever{' '}
            <span className="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-2xl font-extrabold text-transparent">
              Leslie
            </span>
          </h1>
        </section>

        <section className="flex items-center justify-end gap-4 text-right">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2"
          >
            <Send size={16} />
            <span>Contact me</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-blue-500/50 px-4 py-2"
          >
            <Github size={16} />
            <span>Github</span>
          </button>
        </section>

        <section>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="tracking-wide opacity-80"
          >
            Hello there! I'm not just a <strong>frontend engineer</strong>—I'm a
            digital wizard who turns caffeine into responsive, pixel-perfect
            interfaces. When I'm not wrestling with CSS or convincing JavaScript
            to behave, you'll find me deep in the browser DevTools, hunting down
            rogue bugs like a detective in a digital noir film.
          </motion.p>
        </section>

        <section>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="tracking-wide opacity-80"
          >
            I'm a man with salt in my veins and code in my soul—originally from{' '}
            <strong>Zhanjiang</strong>, <strong>Guangdong</strong>, where the
            sea taught me patience and how to ride the waves of ever-changing
            web trends. 😉
          </motion.p>
        </section>
      </div>

      <div className="bg-white px-6 py-8 dark:bg-zinc-800">
        <h3 className="mb-6 text-center text-lg tracking-wider uppercase">
          What to use for work
        </h3>

        <div className="flex flex-col gap-6">
          <div className="rounded bg-linear-to-br from-sky-50 to-zinc-50 p-4 shadow dark:from-zinc-900 dark:to-zinc-700 dark:shadow-none">
            <div className="mb-4 flex items-center justify-center gap-4">
              <img className="w-6" src="/images/vue-logo.svg" />
              <div>Vuejs</div>
            </div>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> Accumulated completion of over 30
                projects
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> Research on source code
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> 3 years of experience
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> Use it to work for the longest time
              </li>
            </ul>
          </div>

          <div className="rounded bg-linear-to-br from-sky-50 to-zinc-50 p-4 shadow dark:from-zinc-900 dark:to-zinc-700 dark:shadow-none">
            <div className="mb-4 flex items-center justify-center gap-2">
              <img className="w-6" src="/images/react-logo.svg" />
              <div>React</div>
            </div>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> Accumulated completion of over 10
                projects
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> Research on source code
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> 3 years of experience
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck size={16} /> My favorite framework
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <h3 className="mb-6 text-center text-lg tracking-wider uppercase">
          Commonly used tools
        </h3>

        <div className="mb-4">
          <div className="mb-4 text-center">engineering</div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/webpack-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/vite-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/esbuild-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/rollup-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/babeljs-logo.png" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/gulp-logo.png" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 text-center">style</div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/ant-design-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/element-plus-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/sass-logo.svg" />
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800">
              <img className="w-5" src="/images/bootstrap-logo.png" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-8 dark:bg-zinc-800">
        <h3 className="mb-6 text-center text-lg tracking-wider uppercase">
          Work Experience
        </h3>
      </div>
    </div>
  )
}
