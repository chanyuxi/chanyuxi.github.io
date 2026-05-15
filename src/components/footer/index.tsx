import packageJsonRaw from '../../../package.json?raw'

interface FooterItem {
  label: string
}

interface FooterGroup {
  title: string
  items: FooterItem[]
}

const packageMeta = JSON.parse(packageJsonRaw) as {
  version?: string
}

const appVersion = packageMeta.version ?? '0.0.0'

const footerGroups: FooterGroup[] = [
  {
    title: 'LABORATORY',
    items: [
      { label: 'Postsop' },
      { label: 'Nausea' },
      { label: 'eslint-waltz' },
      { label: 'Architecture' },
    ],
  },
  {
    title: 'CREATION',
    items: [
      { label: 'Poetries' },
      { label: 'Articles' },
      { label: 'Blog' },
      { label: 'Showcase' },
    ],
  },
  {
    title: 'FIND US',
    items: [
      { label: 'GitHub' },
      { label: 'QQ' },
      { label: 'Wechat' },
      { label: 'Telegram' },
    ],
  },
  {
    title: 'EXPLORE MORE',
    items: [
      { label: 'Home' },
      { label: 'Skills' },
      { label: 'Posts' },
      { label: 'Cooperative development' },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-zinc-900 text-zinc-200 dark:bg-zinc-950">
      <div className="base-container py-14 sm:py-18 lg:py-20">
        <div className="grid gap-x-10 gap-y-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map(group => (
            <section key={group.title}>
              <p className="mb-5 text-sm tracking-[0.18em] text-zinc-400 uppercase">
                {group.title}
              </p>

              <div className="flex flex-col gap-4">
                {group.items.map(item => (
                  <span
                    key={`${group.title}-${item.label}`}
                    className="text-sm text-zinc-100"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-2xl font-semibold tracking-tight text-zinc-100">
            CHANYUXI
          </p>
          <p className="text-sm text-zinc-400">Version {appVersion}</p>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Copyright {currentYear} CHANYUXI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
