import { FrameworkCard } from '@/modules/home/components/frame-work-card'
import { SectionTitle } from '@/modules/home/components/section-title'
import { ToolCard } from '@/modules/home/components/tool-card'

const frameworks = [
  {
    achievements: [
      'Accumulated completion of 30+ projects',
      'Research on source code',
      '3 years of experience',
      'Use it to work for the longest time',
    ],
    icon: '/images/vue-logo.svg',
    name: 'Vue',
  },
  {
    achievements: [
      'Accumulated completion of 10+ projects',
      'Research on source code',
      '3 years of experience',
      'My favorite framework',
    ],
    icon: '/images/react-logo.svg',
    name: 'React',
  },
  {
    achievements: [
      'Almost no one uses it domestically',
      'Just hang it up and take a look',
      'I don\'t know either.',
      'Preparing to make a friend',
    ],
    icon: '/images/angular-logo.ico',
    name: 'Angular',
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

export default function Introduction() {
  return (
    <div>
      <section className="py-8 sm:py-10 md:py-12 lg:py-20">
        <div className="base-container">
          <SectionTitle title=" What to use for work" />

          <div className="flex flex-col justify-center gap-6 lg:flex-row">
            {frameworks.map(framework => (
              <div className="flex-1" key={framework.name}>
                <FrameworkCard
                  achievements={framework.achievements}
                  icon={framework.icon}
                  name={framework.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 lg:py-20">
        <div className="base-container">
          <SectionTitle title="Commonly used tools" />

          {commonlyUsedTools.map(block => (
            <div className="mb-4" key={block.title}>
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
    </div>
  )
}
