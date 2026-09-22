import { Link } from 'react-router'

import { APP_VERSION, GITHUB_LINK, TELEGRAM_LINK } from '@/constants'

interface FooterGroup {
  items: FooterItem[]
  title: string
}

interface FooterItem {
  label: string
  link?: { account: string } | string
}

const footerGroups: FooterGroup[] = [
  {
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
      {
        label: 'Haree',
        link: 'https://github.com/chanyuxi/haree',
      },
    ],
    title: 'LABORATORY',
  },
  {
    items: [
      { label: 'Poetries', link: '/poetries/entrance' },
      { label: 'Articles' },
      { label: 'Blog' },
    ],
    title: 'CREATION',
  },
  {
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
        link: TELEGRAM_LINK,
      },
    ],
    title: 'FIND ME',
  },
  {
    items: [
      {
        label: 'Home',
        link: '/',
      },
      {
        label: 'Introduction',
        link: '/introduction',
      },
      {
        label: 'Posts',
      },
      {
        label: 'Cooperation',
      },
      {
        label: 'Changelog',
        link: '/changelog',
      },
    ],
    title: 'EXPLORE MORE',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline bg-canvas-soft transition-colors duration-300 dark:border-white/10 dark:bg-dark-elevated">
      <div className="base-container py-14 sm:py-18 lg:py-20">
        <div className="grid gap-10 border-b border-hairline pb-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
          {footerGroups.map(group => (
            <section key={group.title}>
              <p className="mb-6 text-xs font-medium tracking-label text-muted-soft uppercase dark:text-stone-500">
                {group.title}
              </p>

              <div className="flex flex-col items-start gap-4">
                {group.items.map(item => renderLink(item, group))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-lg font-semibold tracking-label text-ink dark:text-stone-100">
            CHANYUXI
          </p>
          <p className="text-xs text-muted-foreground dark:text-stone-400">
            Version
            {' '}
            {APP_VERSION}
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground dark:text-stone-400">
          Copyright
          {' '}
          {currentYear}
          {' '}
          CHANYUXI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function renderLink(item: FooterItem, group: FooterGroup) {
  const isExternalLink = (link: string) => /^https?:\/\//.test(link)

  const key = `${group.title}-${item.label}`

  if (!item.link) {
    return (
      <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-ink dark:text-stone-400 dark:hover:text-stone-100" key={key}>
        {item.label}
      </span>
    )
  }
  else if (typeof item.link === 'object') {
    return null
  }
  else if (isExternalLink(item.link)) {
    return (
      <a
        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-ink dark:text-stone-400 dark:hover:text-stone-100"
        href={item.link}
        key={key}
        rel="noreferrer"
        target="_blank"
      >
        {item.label}
      </a>
    )
  }
  else {
    return (
      <Link
        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-ink dark:text-stone-400 dark:hover:text-stone-100"
        key={key}
        to={item.link}
      >
        {item.label}
      </Link>
    )
  }
}
