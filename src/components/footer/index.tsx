import { Link } from 'react-router'

import { APP_VERSION, GITHUB_LINK } from '@/constants'

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
      { label: 'Architecture' },
    ],
    title: 'LABORATORY',
  },
  {
    items: [
      { label: 'Poetries', link: '/poetries/entrance' },
      { label: 'Articles' },
      { label: 'Blog' },
      { label: 'Showcase' },
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
        label: 'Cooperative development',
      },
    ],
    title: 'EXPLORE MORE',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-200/60 transition-colors duration-300 dark:bg-neutral-900">
      <div className="base-container py-14 sm:py-18 lg:py-20">
        <div className="grid gap-10 border-b border-black/20 pb-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/20">
          {footerGroups.map(group => (
            <section key={group.title}>
              <p className="mb-6 text-sm tracking-wide text-zinc-400 uppercase dark:text-zinc-600">
                {group.title}
              </p>

              <div className="flex flex-col items-start gap-4">
                {group.items.map(item => renderLink(item, group))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CHANYUXI
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Version
            {' '}
            {APP_VERSION}
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
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
      <span className="cursor-pointer text-sm hover:underline" key={key}>
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
        className="cursor-pointer text-sm hover:underline"
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
        className="cursor-pointer text-sm hover:underline"
        key={key}
        to={item.link}
      >
        {item.label}
      </Link>
    )
  }
}
