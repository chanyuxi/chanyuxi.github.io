// The inline script in index.html mirrors the storage key and the accepted
// values to apply the theme before the bundle loads (preventing a flash of
// the wrong theme). Keep both sides in sync when changing anything here.
export const THEME_STORAGE_KEY = 'theme'

export type Theme = 'dark' | 'light'

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}
