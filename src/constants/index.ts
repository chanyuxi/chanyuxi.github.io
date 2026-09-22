import packageJsonRaw from '../../package.json?raw'

function getAppVersion() {
  try {
    const packageMeta = JSON.parse(packageJsonRaw) as {
      version?: string
    }

    return packageMeta.version ?? 'unreachable'
  }
  catch {
    return 'unreachable'
  }
}

export const APP_VERSION = getAppVersion()

// Shared link
export const GITHUB_LINK = 'https://github.com/chanyuxi'
export const TELEGRAM_LINK = 'https://t.me/chanyuxi'

// Source links for the contact QR codes
export const QRCODE_RAW = {
  qq: 'https://qm.qq.com/q/2xC4peRuYY',
  wechat: 'https://u.wechat.com/MMhEWk02CEglYeOi4-Ym4Y4?s=4',
} as const
