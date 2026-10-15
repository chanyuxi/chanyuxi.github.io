import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBreakpoint } from '@/hooks/use-breakpoint'

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
        highlights: [
          'Familiar with the source code',
          'Proficient in using hooks',
        ],
        name: 'React',
        proficiency: 90,
        usageTime: 4,
      },
      {
        completedProjects: '5+',
        highlights: ['With expo'],
        name: 'React Native',
        proficiency: 70,
        usageTime: 1,
      },
      'Uniapp',
      'Electron',
    ],
    items: 'Vue · React · React Native · Uniapp',
    label: 'Frameworks',
  },
  {
    details: ['Vuex', 'Pinia', 'Redux', 'Axios', 'Zod', 'Zustand'],
    items: 'Vuex · Pinia · Redux · Axios',
    label: 'State & data',
  },
  {
    details: ['Vite', 'Webpack', 'Rollup', 'Esbuild', 'ESLint'],
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
  const bp = useBreakpoint()

  const [actives, setActives] = useState<number[]>([])

  const handleOpenChange = (index: number) => {
    let indexGroup = []
    if (bp === 'base') {
      indexGroup = [index]
    }
    else {
      indexGroup = index % 2 === 0 ? [index, index + 1] : [index - 1, index]
    }
    setActives(actives.includes(index) ? [] : indexGroup)
  }

  return (
    <section className="bg-canvas-soft section-spacing dark:bg-dark-elevated">
      <div className="base-container">
        <div className="grid gap-8">
          <div>
            <p className="section-eyebrow">
              Skills
            </p>
            <h2 className="section-heading">
              What I use
            </h2>
          </div>

          <div className="grid gap-x-10 md:grid-cols-2">
            {skills.map((group, index) => (
              <Collapsible
                className="py-5"
                key={group.label}
                onOpenChange={() => handleOpenChange(index)}
                open={actives.includes(index)}
              >
                <CollapsibleTrigger>
                  <h3 className="font-medium text-skill-label">
                    {group.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-skill-summary">
                    {group.items}
                  </p>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 flex flex-wrap gap-2 py-1">
                    {group.details.map((skill) => {
                      const name
                        = typeof skill === 'string' ? skill : skill.name

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
  const name = typeof skillDetail === 'string' ? skillDetail : skillDetail.name
  const badge = (
    <Badge variant="skill">
      {name}
    </Badge>
  )

  if (typeof skillDetail === 'string') return badge

  return (
    <Tooltip>
      <TooltipTrigger className="rounded-full">
        {badge}
      </TooltipTrigger>
      <TooltipContent
        hiddenArrow
        sideOffset={8}
        variant="rich"
      >
        <p className="text-sm font-medium">{name}</p>

        <dl className="grid grid-cols-2 gap-3 border-y border-foreground/15 py-3">
          <div>
            <dt>Experience</dt>
            <dd className="mt-1 italic">{`${skillDetail.usageTime} years`}</dd>
          </div>
          <div>
            <dt>Projects</dt>
            <dd className="mt-1 italic">{skillDetail.completedProjects}</dd>
          </div>
        </dl>

        <Progress
          aria-label={`${name} proficiency`}
          className="gap-x-3 gap-y-2 **:data-[slot=progress-indicator]:bg-foreground **:data-[slot=progress-track]:bg-foreground/20"
          value={skillDetail.proficiency}
        >
          <span>Proficiency</span>
          <span className="ml-auto italic">
            {`${skillDetail.proficiency}%`}
          </span>
        </Progress>

        <div>
          <p>Highlights</p>
          <ul className="mt-2 space-y-1.5">
            {skillDetail.highlights.map(highlight => (
              <li className="flex gap-2 leading-5 italic" key={highlight}>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
