import { Link } from 'react-router'

import { APP_VERSION, GITHUB_LINK } from '@/constants'

interface FooterItem {
  label: string
  link?: string
}

interface FooterGroup {
  title: string
  items: FooterItem[]
}

const footerGroups: FooterGroup[] = [
  {
    title: 'LABORATORY',
    items: [
      {
        label: 'Postsop',
        link: 'https://github.com/chanyuxi/postsop',
      },
      {
        label: 'Nausea',
        link: 'https://github.com/chanyuxi/nausea',
      },
      {
        label: 'eslint-waltz',
        link: 'https://github.com/chanyuxi/eslint-waltz',
      },
      { label: 'Architecture' },
    ],
  },
  {
    title: 'CREATION',
    items: [
      { label: 'Poetries', link: '/poetry/entrance' },
      { label: 'Articles' },
      { label: 'Blog' },
      { label: 'Showcase' },
    ],
  },
  {
    title: 'FIND ME',
    items: [
      {
        label: 'GitHub',
        link: GITHUB_LINK,
      },
      {
        label: 'QQ',
      },
      {
        label: 'Wechat',
      },
      {
        label: 'Telegram',
      },
    ],
  },
  {
    title: 'EXPLORE MORE',
    items: [
      {
        label: 'Home',
        link: '/',
      },
      {
        label: 'Skills',
        link: '/skills',
      },
      {
        label: 'Posts',
      },
      {
        label: 'Cooperative development',
      },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const isExternalLink = (link: string) => /^https?:\/\//.test(link)

  return (
    <footer className="border-t border-black/8 bg-sky-100 text-zinc-800 transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
      <div className="base-container py-14 sm:py-18 lg:py-20">
        <div className="grid gap-x-10 gap-y-10 border-b border-black/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
          {footerGroups.map(group => (
            <section key={group.title}>
              <p className="mb-5 text-sm tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                {group.title}
              </p>

              <div className="flex flex-col items-start gap-4">
                {group.items.map(item => {
                  if (!item.link) {
                    return (
                      <span
                        key={`${group.title}-${item.label}`}
                        className="cursor-pointer text-sm text-zinc-700 hover:underline dark:text-zinc-100"
                      >
                        {item.label}
                      </span>
                    )
                  }

                  if (isExternalLink(item.link)) {
                    return (
                      <a
                        key={`${group.title}-${item.label}`}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer text-sm text-zinc-700 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-100 dark:hover:text-white"
                      >
                        {item.label}
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={`${group.title}-${item.label}`}
                      to={item.link}
                      className="cursor-pointer text-sm text-zinc-700 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-100 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CHANYUXI
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Version {APP_VERSION}
          </p>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Copyright {currentYear} CHANYUXI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
