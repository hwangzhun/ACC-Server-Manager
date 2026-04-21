export type DocumentTheme = 'dark' | 'light'

const THEME_COLOR_META = {
  dark: '#141414',
  light: '#f8f9fa'
} as const

/** 同步 meta、根节点 color-scheme，与 CSS 变量主题一致 */
export function syncThemeDocument(theme: DocumentTheme): void {
  if (typeof document === 'undefined') return

  const scheme = theme === 'light' ? 'light' : 'dark'
  document.documentElement.style.colorScheme = scheme

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', THEME_COLOR_META[theme])
  }

  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]')
  if (colorSchemeMeta) {
    colorSchemeMeta.setAttribute('content', scheme)
  }
}
