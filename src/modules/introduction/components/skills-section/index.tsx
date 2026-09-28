import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Skill {
  details: (SkillDetail | string)[]
  items: string
  label: string
}

interface SkillDetail {
  completedProjects: string
  highlights: string[]
  name: string
  proficiency: number
  usageTime: number
}

const skills: Skill[] = [
  {
    details: [
      'JavaScript',
      'TypeScript',
      'Node.js',
      'CSS',
      'Sass',
      'Java',
      'Kotlin',
      'Rust',
      'C',
    ],
    items: 'JavaScript · TypeScript · Node.js',
    label: 'Languages',
  },
  {
    details: [
      {
        completedProjects: '30+',
        highlights: ['Familiar with the source code'],
        name: 'Vue',
        proficiency: 80,
        usageTime: 4,
      },
      {
        completedProjects: '30+',
        highlights: ['Familiar with the source code', 'Proficient in using hooks'],
        name: 'React',
        proficiency: 80,
        usageTime: 4,
      },
      {
        completedProjects: '5+',
        highlights: ['With expo'],
        name: 'React Native',
        proficiency: 60,
        usageTime: 1,
      },
      'Uniapp',
      'Electron',
    ],
    items: 'Vue · React · React Native · Uniapp',
    label: 'Frameworks',
  },
  {
    details: [
      'Vuex',
      'Pinia',
      'Redux',
      'Axios',
      'Zod',
      'Zustand',
    ],
    items: 'Vuex · Pinia · Redux · Axios',
    label: 'State & data',
  },
  {
    details: [
      'Vite',
      'Webpack',
      'Rollup',
      'Esbuild',
      'ESLint',
    ],
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
    ],
    items: 'Tailwind CSS · Ant Design · Element UI · GitFlow',
    label: 'UI & delivery',
  },
]

export function SkillsSection() {
  const [active, setActive] = useState<null | string>(null)

  const handleOpenChange = (label: string, open: boolean) => {
    setActive(current => open ? label : current === label ? null : current)
  }

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
                onOpenChange={open => handleOpenChange(group.label, open)}
                open={active === group.label}
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
                  <div className="mt-4 flex flex-wrap gap-2 py-1">
                    {group.details.map((skill) => {
                      const name = typeof skill === 'string' ? skill : skill.name

                      return <SkillBadge key={name} skillDetail={skill} />
                    })}
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

function SkillBadge({
  skillDetail,
}: {
  skillDetail: Skill['details'][number]
}) {
  const name = typeof skillDetail === 'string'
    ? skillDetail
    : skillDetail.name
  const badge = (
    <Badge className="shadow-2xs" variant="skill">
      {name}
    </Badge>
  )

  if (typeof skillDetail === 'string')
    return badge

  return (
    <Tooltip>
      <TooltipTrigger className="cursor-help rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {badge}
      </TooltipTrigger>
      <TooltipContent
        className="w-64 max-w-[calc(100vw-2rem)] flex-col items-stretch gap-4 rounded-xl p-4 shadow-soft"
        sideOffset={8}
      >
        <p className="text-sm font-medium">{name}</p>

        <dl className="grid grid-cols-2 gap-3 border-y border-background/15 py-3">
          <div>
            <dt className="text-[11px] text-background/65">Experience</dt>
            <dd className="mt-1 font-mono text-xs">
              {`${skillDetail.usageTime} years`}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-background/65">Projects</dt>
            <dd className="mt-1 font-mono text-xs">
              {skillDetail.completedProjects}
            </dd>
          </div>
        </dl>

        <Progress
          aria-label={`${name} proficiency`}
          className="gap-x-3 gap-y-2 **:data-[slot=progress-indicator]:bg-background **:data-[slot=progress-track]:bg-background/20"
          value={skillDetail.proficiency}
        >
          <span className="text-[11px] text-background/65">Proficiency</span>
          <span className="ml-auto font-mono text-xs">
            {`${skillDetail.proficiency}%`}
          </span>
        </Progress>

        <div>
          <p className="text-[11px] text-background/65">Highlights</p>
          <ul className="mt-2 space-y-1.5">
            {skillDetail.highlights.map(highlight => (
              <li className="flex gap-2 leading-5" key={highlight}>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
