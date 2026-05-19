import packageJsonRaw from '../../package.json?raw'

const packageMeta = JSON.parse(packageJsonRaw) as {
  version?: string
}

export const APP_VERSION = packageMeta.version ?? '0.0.0'

export const GITHUB_LINK = 'https://github.com/chanyuxi'
