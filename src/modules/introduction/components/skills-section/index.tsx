import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const skills = [
  {
    details: ['JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Sass'],
    items: 'JavaScript · TypeScript · Node.js',
    label: 'Languages',
  },
  {
    details: ['Vue 2', 'Vue 3', 'React', 'React Native', 'Uniapp'],
    items: 'Vue 2 / 3 · React · React Native · Uniapp',
    label: 'Frameworks',
  },
  {
    details: ['Vuex', 'Pinia', 'Redux', 'Axios', 'REST API', 'JSON'],
    items: 'Vuex · Pinia · Redux · Axios',
    label: 'State & data',
  },
  {
    details: ['Vite', 'Webpack', 'Rollup', 'Esbuild', 'ESLint', 'Vite plugins'],
    items: 'Vite · Webpack · Rollup · Esbuild · ESLint',
    label: 'Tooling',
  },
  {
    details: [
      'Tailwind CSS',
      'Ant Design',
      'Element UI',
      'GitFlow',
      'Responsive UI',
      'Design systems',
    ],
    items: 'Tailwind CSS · Ant Design · Element UI · GitFlow',
    label: 'UI & delivery',
  },
]

export function SkillsSection() {
  return (
    <section className="bg-canvas-soft py-14 sm:py-18 lg:py-24 dark:bg-dark-elevated">
      <div className="base-container">
        <div className="grid gap-8">
          <div>
            <p className="text-xs font-medium tracking-navigation text-muted-soft uppercase dark:text-stone-500">
              Skills
            </p>
            <h2 className="mt-3 text-3xl font-normal tracking-section">
              What I use
            </h2>
          </div>

          <div className="grid gap-x-10 md:grid-cols-2">
            {skills.map(group => (
              <Collapsible
                className="py-5"
                key={group.label}
              >
                <CollapsibleTrigger className="w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                  <h3 className="font-medium text-skill-label">
                    {group.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-skill-summary">
                    {group.items}
                  </p>
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-panel-height overflow-hidden transition-collapsible duration-300 data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0">
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.details.map(skill => (
                      <Badge key={skill} variant="skill">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
