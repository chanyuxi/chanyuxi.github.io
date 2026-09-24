import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const career = [
  {
    company: 'Guangzhou Yanqu Information Technology Co., Ltd.',
    contributions: [
      'Built a responsive resume platform from the ground up, covering internationalization, accounts, payments, assessments, and more than 100 REST integrations.',
      'Improved team delivery efficiency by about 30% with shared business components and technical documentation.',
      'Reduced branch-specific local build time from five minutes to one with a custom Vite plugin.',
      'Delivered cross-platform work including a JSON-driven H5 canvas, multi-window state coordination, and shared React Native components.',
    ],
    period: 'Mar 2023 — Nov 2025',
    summary:
      'Worked on web and mobile products, shared business components, build tooling, and frontend standards.',
  },
  {
    company: 'Guangzhou Nantian Computer Systems Co., Ltd.',
    contributions: [
      'Completed more than 30 high-fidelity pages and roughly half of the frontend implementation.',
      'Created reusable request, permission, table, batch-operation, and export capabilities.',
      'Implemented document parsing, form generation, keyword highlighting, document anchors, and image lazy loading.',
    ],
    period: 'Oct 2022 — Feb 2023',
    summary:
      'Built contract-management pages, document workflows, and reusable CRUD features for an internal banking system.',
  },
]

export function ExperienceSection() {
  return (
    <section
      className="scroll-mt-18 py-14 sm:py-18 lg:py-24"
      id="experience"
    >
      <div className="base-container">
        <div className="grid gap-8">
          <div>
            <p className="text-xs font-medium tracking-navigation text-muted-soft uppercase dark:text-stone-500">
              Experience
            </p>
            <h2 className="mt-3 text-3xl font-normal tracking-section">
              Where I worked
            </h2>
          </div>

          <div>
            {career.map(item => (
              <Collapsible
                key={item.company}
              >
                <CollapsibleTrigger className="w-full cursor-pointer py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                  <div className="grid gap-3 sm:grid-cols-experience-meta sm:gap-8 md:grid-cols-[minmax(0,1fr)_11rem]">
                    <p className="font-mono text-xs leading-7 text-muted-foreground md:order-2 md:text-right">
                      {item.period}
                    </p>
                    <div className="md:order-1">
                      <h3 className="text-lg font-medium text-ink dark:text-stone-100">
                        {item.company}
                      </h3>
                      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <span className="sr-only">Toggle key contributions</span>
                </CollapsibleTrigger>

                <CollapsibleContent className="collapsible-panel-height overflow-hidden transition-collapsible duration-300 data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0">
                  <div className="pb-7 sm:ml-52 md:ml-0">
                    <p className="text-xs font-medium tracking-label text-muted-soft uppercase dark:text-stone-500">
                      Key contributions
                    </p>
                    <ul className="mt-4 max-w-2xl space-y-3">
                      {item.contributions.map(contribution => (
                        <li
                          className="flex gap-3 text-sm leading-6 text-muted-foreground italic"
                          key={contribution}
                        >
                          <span>{contribution}</span>
                        </li>
                      ))}
                    </ul>
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
