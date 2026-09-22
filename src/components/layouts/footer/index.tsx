import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Link } from 'react-router'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { APP_VERSION, GITHUB_LINK, QRCODE_RAW, TELEGRAM_LINK } from '@/constants'

interface FooterGroup {
  items: FooterItem[]
  title: string
}

interface FooterItem {
  label: string
  link?: { account: string } | string
  qrcode?: QrCodeKey
}

type QrCodeKey = keyof typeof QRCODE_RAW

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
        qrcode: 'qq',
      },
      {
        label: 'Wechat',
        qrcode: 'wechat',
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
  const [activeQrCode, setActiveQrCode] = useState<null | QrCodeKey>(null)
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="border-t border-hairline bg-canvas-soft transition-colors duration-300 dark:border-white/10 dark:bg-dark-elevated">
        <div className="base-container py-14 sm:py-18 lg:py-20">
          <div className="grid gap-10 border-b border-hairline pb-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
            {footerGroups.map(group => (
              <section key={group.title}>
                <p className="mb-6 text-xs font-medium tracking-label text-muted-soft uppercase dark:text-stone-500">
                  {group.title}
                </p>

                <div className="flex flex-col items-start gap-4">
                  {group.items.map(item =>
                    renderLink(item, group, setActiveQrCode),
                  )}
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

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setActiveQrCode(null)
          }
        }}
        open={activeQrCode !== null}
      >
        <DialogContent className="w-76 max-w-[calc(100%-2rem)] justify-items-center gap-0 border border-hairline bg-card p-4 py-12 shadow-soft ring-0 dark:border-white/15 dark:bg-dark-elevated dark:shadow-[0_16px_40px_rgb(0_0_0/35%)]">
          <DialogTitle className="sr-only">
            {activeQrCode === 'qq' ? 'QQ QR code' : 'Wechat QR code'}
          </DialogTitle>
          {activeQrCode && (
            <div className="rounded-xl bg-white p-3 shadow-soft">
              <QRCodeSVG
                bgColor="#ffffff"
                className="block"
                fgColor="#000000"
                size={192}
                value={QRCODE_RAW[activeQrCode]}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function renderLink(
  item: FooterItem,
  group: FooterGroup,
  onQrCodeClick: (qrcode: QrCodeKey) => void,
) {
  const isExternalLink = (link: string) => /^https?:\/\//.test(link)

  const key = `${group.title}-${item.label}`

  if (item.qrcode) {
    const { qrcode } = item

    return (
      <button
        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-ink dark:text-stone-400 dark:hover:text-stone-100"
        key={key}
        onClick={() => onQrCodeClick(qrcode)}
        type="button"
      >
        {item.label}
      </button>
    )
  }
  else if (!item.link) {
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
