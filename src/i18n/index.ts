import { ref, computed } from 'vue'
import { syncThemeDocument } from '../utils/themeDom'
import type { FieldDescription } from './fieldDescriptions'
import { fieldDescriptions } from './fieldDescriptions'
import { t as translate } from './locales'

export type Language = 'zh' | 'en'
export type Theme = 'dark' | 'light'

const LANGUAGE_STORAGE_KEY = 'acc-server-manager.language'
const THEME_STORAGE_KEY = 'acc-server-manager.theme'

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredLanguage(): Language {
  if (!canUseLocalStorage()) return 'zh'
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (raw === 'zh' || raw === 'en') return raw
  } catch {
    /* ignore */
  }
  return 'zh'
}

function persistLanguage(lang: Language): void {
  if (!canUseLocalStorage()) return
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
}

function readStoredTheme(): Theme {
  if (!canUseLocalStorage()) return 'dark'
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    /* ignore */
  }
  return 'dark'
}

function persistTheme(theme: Theme): void {
  if (!canUseLocalStorage()) return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

// 当前语言状态（启动时从 localStorage 恢复）
export const currentLanguage = ref<Language>(readStoredLanguage())

// 当前主题状态（启动时从 localStorage 恢复）
export const currentTheme = ref<Theme>(readStoredTheme())

// 获取当前语言
export const getCurrentLanguage = () => currentLanguage.value

// 获取当前主题
export const getCurrentTheme = () => currentTheme.value

// 设置语言
export const setLanguage = (lang: Language) => {
  currentLanguage.value = lang
  persistLanguage(lang)
}

// 设置主题
export const setTheme = (theme: Theme) => {
  currentTheme.value = theme
  persistTheme(theme)
  applyTheme(theme)
}

// 切换主题
export const toggleTheme = () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
}

// 应用主题到 DOM
function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    syncThemeDocument(theme)
  }
}

// 初始化时应用主题
if (typeof window !== 'undefined') {
  applyTheme(currentTheme.value)
}

// 切换语言
export const toggleLanguage = () => {
  setLanguage(currentLanguage.value === 'zh' ? 'en' : 'zh')
}

// 获取字段注释
export const getFieldDescription = (
  configName: keyof typeof fieldDescriptions,
  fieldName: string
): string => {
  const descriptions = fieldDescriptions[configName]
  if (!descriptions) {
    return ''
  }

  const fieldDesc = descriptions[fieldName] as FieldDescription
  if (!fieldDesc) {
    return ''
  }

  return fieldDesc[currentLanguage.value]
}

// 获取字段注释的响应式版本
export const useFieldDescription = (
  configName: keyof typeof fieldDescriptions,
  fieldName: string
) => {
  return computed(() => getFieldDescription(configName, fieldName))
}

// 导出语言状态和设置函数
export const useLanguage = () => {
  return {
    currentLanguage: computed(() => currentLanguage.value),
    setLanguage,
    toggleLanguage,
    currentTheme: computed(() => currentTheme.value),
    getCurrentTheme,
    setTheme,
    toggleTheme
  }
}

// 导出主题状态和设置函数
export const useTheme = () => {
  return {
    currentTheme: computed(() => currentTheme.value),
    getCurrentTheme,
    setTheme,
    toggleTheme
  }
}

// 翻译函数
export const t = (key: string): string => {
  return translate(key, currentLanguage.value)
}

// 响应式翻译函数
export const useTranslation = () => {
  return {
    t: (key: string) => computed(() => translate(key, currentLanguage.value)),
    currentLanguage: computed(() => currentLanguage.value)
  }
}
