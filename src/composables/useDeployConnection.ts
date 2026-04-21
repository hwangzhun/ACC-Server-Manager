import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { t } from '../i18n'
import notify from '../components/win11/notify'

export interface ConnectionStatus {
  connected: boolean
  host?: string
  username?: string
}

function buildSshConfig(host: string, port: number, username: string, password: string) {
  return {
    host,
    port,
    username,
    auth_type: 'password',
    password: password || undefined,
  }
}

export type LogCallback = (message: string, type: 'info' | 'success' | 'error' | 'warning') => void

export function useDeployConnection(onLog?: LogCallback) {
  const isConnected = ref(false)
  const connecting = ref(false)
  const connectionStatus = ref<ConnectionStatus>({ connected: false })
  const validationErrors = ref<Record<string, string>>({})

  function validateForm(host: string, port: number, username: string): boolean {
    const errors: Record<string, string> = {}
    if (!host.trim()) {
      errors.host = t('deploy.pleaseInputServerAddress')
    }
    if (!port || port < 1 || port > 65535) {
      errors.port = t('deploy.pleaseInputValidPort')
    }
    if (!username.trim()) {
      errors.username = t('deploy.pleaseInputUsername')
    }
    validationErrors.value = errors
    return Object.keys(errors).length === 0
  }

  async function testConnection(config: {
    host: string
    port: number
    username: string
    password: string
  }): Promise<{ success: boolean; error?: string }> {
    if (!validateForm(config.host, config.port, config.username)) {
      return { success: false, error: t('deploy.validationFailed') }
    }
    onLog?.(t('deploy.testingConnection'), 'info')
    try {
      const sshConfig = buildSshConfig(config.host, config.port, config.username, config.password)
      const result = await invoke<{ success: boolean; error?: string }>('test_connection', { config: sshConfig })
      if (result.success) {
        onLog?.(t('deploy.sshTestSuccess'), 'success')
      } else {
        onLog?.(result.error || t('deploy.sshTestFailed'), 'error')
      }
      return result
    } catch (err) {
      const msg = String(err)
      onLog?.(msg, 'error')
      return { success: false, error: msg }
    }
  }

  async function connect(config: {
    host: string
    port: number
    username: string
    password: string
  }): Promise<boolean> {
    if (!validateForm(config.host, config.port, config.username)) {
      return false
    }
    connecting.value = true
    onLog?.(t('deploy.connecting'), 'info')
    try {
      const sshConfig = buildSshConfig(config.host, config.port, config.username, config.password)
      const result = await invoke<{ success: boolean; error?: string }>('connect', { config: sshConfig })
      if (result.success) {
        isConnected.value = true
        connectionStatus.value = { connected: true, host: config.host, username: config.username }
        notify.success(t('deploy.sshConnected'))
        onLog?.(t('deploy.sshConnected'), 'success')
        return true
      } else {
        notify.error(result.error || t('deploy.connectionError'))
        onLog?.(result.error || t('deploy.connectionError'), 'error')
        return false
      }
    } catch (err) {
      notify.error(t('deploy.connectionError'))
      onLog?.(String(err), 'error')
      return false
    } finally {
      connecting.value = false
    }
  }

  async function disconnect(): Promise<void> {
    onLog?.(t('deploy.disconnecting'), 'info')
    try {
      await invoke('disconnect')
      isConnected.value = false
      connectionStatus.value = { connected: false }
      notify.info(t('deploy.sshDisconnected'))
      onLog?.(t('deploy.sshDisconnected'), 'info')
    } catch (err) {
      notify.error(t('deploy.disconnectFailed'))
      onLog?.(String(err), 'error')
    }
  }

  async function refreshStatus(): Promise<void> {
    try {
      const status = await invoke<ConnectionStatus>('get_connection_status')
      isConnected.value = status.connected
      connectionStatus.value = status
    } catch {
      // ignore
    }
  }

  const isFormValid = computed(() => {
    return connectionStatus.value.host && connectionStatus.value.username
  })

  return {
    isConnected,
    connecting,
    connectionStatus,
    validationErrors,
    validateForm,
    connect,
    disconnect,
    refreshStatus,
    testConnection,
    isFormValid,
  }
}