import { Link } from 'react-router'

import { APP_VERSION } from '@/constants/app'
import { EXTERNAL_LINKS } from '@/constants/external-links'

import { QrCodeDialog } from './components/qr-code-dialog'

interface FooterGroup {
  items: FooterItem[]
  title: string
}

interface FooterItem {
  label: string
  link?: { account: string } | string
  qrcode?: QrCodeKey
}

type QrCodeKey = keyof typeof EXTERNAL_LINKS.qrCodes

const footerGroups: FooterGroup[] = [
  {
    items: [
      {
        label: 'Postsop (paused)',
        link: EXTERNAL_LINKS.projects.postsop,
      },
      {
        label: 'eslint-waltz',
        link: EXTERNAL_LINKS.projects.eslintWaltz,
      },
      {
        label: 'form',
        link: EXTERNAL_LINKS.projects.form,
      },
    ],
    title: 'LABORATORY',
  },
  {
    items: [
      { label: 'Poetries', link: '/poetries/entrance' },
      { label: 'Blog' },
    ],
    title: 'CREATION',
  },
  {
    items: [
      {
        label: 'GitHub',
        link: EXTERNAL_LINKS.social.github,
      },
      {
        label: 'QQ',
        qrcode: 'qq',
      },
      {
        label: 'Wechat',
        qrcode: 'wechat',
      },
      {
        label: 'Telegram',
        link: EXTERNAL_LINKS.social.telegram,
      },
      {
        label: 'WhatsApp',
        qrcode: 'whatsapp',
      },
    ],
    title: 'FIND ME',
  },
  {
    items: [
      {
        label: 'Introduction',
        link: '/introduction',
      },
      {
        label: 'Posts',
        link: '/post',
      },
      {
        label: 'About this project',
        link: EXTERNAL_LINKS.projects['chanyuxi.github.io'],
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
    <footer className="border-t border-hairline bg-canvas-soft transition-colors duration-300 dark:bg-dark-elevated">
      <div className="base-container py-14 sm:py-18 lg:py-20">
        <div className="grid gap-10 border-b border-hairline pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map(group => (
            <section key={group.title}>
              <p className="section-eyebrow mb-6">
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
            {`Version ${APP_VERSION}`}
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground dark:text-stone-400">
          {`Copyright ${currentYear} CHANYUXI. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}

function renderLink(
  item: FooterItem,
  group: FooterGroup,
) {
  const isExternalLink = (link: string) => /^https?:\/\//.test(link)

  const key = `${group.title}-${item.label}`

  if (item.qrcode) {
    const { qrcode } = item

    return (
      <QrCodeDialog
        key={key}
        label={item.label}
        value={EXTERNAL_LINKS.qrCodes[qrcode]}
      />
    )
  }
  else if (!item.link) {
    return (
      <span className="quiet-link" key={key}>
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
        className="quiet-link"
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
        className="quiet-link"
        key={key}
        to={item.link}
      >
        {item.label}
      </Link>
    )
  }
}
