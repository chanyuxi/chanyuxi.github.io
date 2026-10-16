type ExternalLink = `http://${string}` | `https://${string}`
type ExternalLinkGroup = Record<string, ExternalLink>

export const EXTERNAL_LINKS = {
  projects: {
    'chanyuxi.github.io': 'https://github.com/chanyuxi/chanyuxi.github.io',
    'eslintWaltz': 'https://www.npmjs.com/package/@chanyuxi/eslint-waltz',
    'form': 'https://github.com/chanyuxi/form',
    'postsop': 'https://github.com/chanyuxi/postsop',
  },
  qrCodes: {
    qq: 'https://qm.qq.com/q/2xC4peRuYY',
    wechat: 'https://u.wechat.com/MMhEWk02CEglYeOi4-Ym4Y4?s=4',
    whatsapp: 'https://wa.me/qr/I6A7BHPKQHWBN1',
  },
  social: {
    github: 'https://github.com/chanyuxi',
    telegram: 'https://t.me/chanyuxi',
  },
} as const satisfies Record<string, ExternalLinkGroup>
