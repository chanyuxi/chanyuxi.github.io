import { Github, Send } from 'lucide-react'
import { HeroImageCard } from './components/HeroImageCard'
import { FrameworkCard } from './components/FrameworkCard'
import { ToolCard } from './components/ToolCard'
import { motion } from 'motion/react'
import { SectionTitle } from './components/SectionTitle'

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

const frameworks = [
  {
    name: 'Vue',
    icon: '/images/vue-logo.svg',
    achievements: [
      'Accumulated completion of 30+ projects',
      'Research on source code',
      '3 years of experience',
      'Use it to work for the longest time',
    ],
  },
  {
    name: 'React',
    icon: '/images/react-logo.svg',
    achievements: [
      'Accumulated completion of 10+ projects',
      'Research on source code',
      '3 years of experience',
      'My favorite framework',
    ],
  },
  {
    name: 'Angular',
    icon: '/images/angular-logo.ico',
    achievements: [
      'Almost no one uses it domestically',
      'Just hang it up and take a look',
      "I don't know either.",
      'Preparing to make a friend',
    ],
  },
]

const commonlyUsedTools = [
  {
    title: 'engineering',
    tools: [
      { src: '/images/webpack-logo.svg' },
      { src: '/images/vite-logo.svg' },
      { src: '/images/esbuild-logo.svg' },
      { src: '/images/rollup-logo.svg' },
      { src: '/images/babeljs-logo.png' },
      { src: '/images/gulp-logo.png' },
    ],
  },
  {
    title: 'style',
    tools: [
      { src: '/images/ant-design-logo.svg' },
      { src: '/images/element-plus-logo.svg' },
      { src: '/images/sass-logo.svg' },
      { src: '/images/bootstrap-logo.png' },
    ],
  },
]

export default function Home() {
  return (
    <div>
      <section className="py-8 sm:py-10 md:py-12 lg:py-20">
        <div className="content-constraint relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-8 xl:order-2">
            <div className="mx-auto size-40">
              {heroImages.map(image => (
                <div key={image.id} className="absolute size-40">
                  <HeroImageCard src={image.src} animate={image.animate} />
                </div>
              ))}
            </div>

            <div>
              <h1 className="font-mogra text-center text-4xl font-bold select-none xl:text-5xl">
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

      <section className="bg-blue-100 py-8 sm:py-10 md:py-12 lg:py-20 dark:bg-zinc-800">
        <div className="content-constraint">
          <SectionTitle title=" What to use for work" />

          <div className="flex flex-col justify-center gap-6 lg:flex-row">
            {frameworks.map(framework => (
              <div key={framework.name} className="flex-1">
                <FrameworkCard
                  name={framework.name}
                  icon={framework.icon}
                  achievements={framework.achievements}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 lg:py-20">
        <div className="content-constraint">
          <SectionTitle title="Commonly used tools" />

          {commonlyUsedTools.map(block => (
            <div key={block.title} className="mb-4">
              <div className="mb-4 text-center xl:text-lg">{block.title}</div>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {block.tools.map(tool => (
                  <ToolCard key={tool.src} src={tool.src} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-100 py-8 sm:py-10 md:py-12 lg:py-20 dark:bg-zinc-800">
        <div className="content-constraint">
          <SectionTitle title="Work Experience" />
        </div>
      </section>
    </div>
  )
}
