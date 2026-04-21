import type { AllConfigs, EntryList } from '../types/configuration'
import { normalizeEntryList } from './normalizeEntryList'

export const CONFIG_FILE_NAMES = [
  'configuration.json',
  'settings.json',
  'event.json',
  'eventRules.json',
  'assistRules.json',
  'entrylist.json',
  'bop.json'
] as const

/**
 * 下载单个配置文件
 */
export async function downloadSingleConfig(
  filename: string,
  content: unknown
): Promise<void> {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * 验证配置文件格式
 */
export function validateConfig(content: unknown): boolean {
  try {
    if (typeof content !== 'object' || content === null) {
      return false
    }

    JSON.stringify(content)
    return true
  } catch {
    return false
  }
}

/**
 * 从公共配置文件夹加载所有配置
 */
export async function loadConfigsFromPublic(): Promise<AllConfigs | null> {
  const configUrls = [
    '/cfg/configuration.json',
    '/cfg/settings.json',
    '/cfg/event.json',
    '/cfg/eventRules.json',
    '/cfg/assistRules.json',
    '/cfg/entrylist.json',
    '/cfg/bop.json'
  ]

  const results = await Promise.allSettled(
    configUrls.map(url => 
      fetch(url)
        .then(async response => {
          if (!response.ok) {
            throw new Error(`${CONFIG_FILE_NAMES[configUrls.indexOf(url)]} 加载失败 (${response.status})`)
          }
          return response.json()
        })
    )
  )

  const errors: string[] = []
  const values: unknown[] = []

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errors.push(`加载 ${CONFIG_FILE_NAMES[index]} 失败: ${result.reason?.message || result.reason}`)
    } else {
      values.push(result.value)
    }
  })

  if (errors.length > 0) {
    console.error('配置文件加载错误:', errors)
  }

  if (values.length !== configUrls.length) {
    console.error(`只有 ${values.length}/${configUrls.length} 个配置文件加载成功`)
    return null
  }

  return {
    configuration: values[0] as AllConfigs['configuration'],
    settings: values[1] as AllConfigs['settings'],
    event: values[2] as AllConfigs['event'],
    eventRules: values[3] as AllConfigs['eventRules'],
    assistRules: values[4] as AllConfigs['assistRules'],
    entryList: normalizeEntryList(values[5] as Partial<EntryList>),
    bop: values[6] as AllConfigs['bop'],
  }
}
