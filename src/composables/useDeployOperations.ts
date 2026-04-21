import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import type { AllConfigs } from '../types/configuration'
import notify from '../components/win11/notify'
import { t } from '../i18n'

export interface LogEntry {
  time: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export interface DeployOptions {
  server_path?: string
  download_server?: boolean
  server_download_url?: string
  start_server?: boolean
  download_results?: boolean
}

function buildSshConfig(config: { host: string; port: number; username: string; password?: string }) {
  return {
    host: config.host,
    port: config.port,
    username: config.username,
    auth_type: 'password',
    password: config.password || undefined,
  }
}

export function useDeployOperations() {
  const uploadingConfig = ref(false)
  const configUploadStatus = ref('')
  const startingServer = ref(false)
  const stoppingServer = ref(false)
  const downloadingResults = ref(false)
  const serverRunning = ref(false)
  const serverLogs = ref<LogEntry[]>([])
  const loading = ref(false)

  function addLog(message: string, type: LogEntry['type'] = 'info') {
    const now = new Date()
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    serverLogs.value.push({ time, message, type })
  }

  function clearLogs() {
    serverLogs.value = []
  }

  async function deploy(
    sshConfig: { host: string; port: number; username: string; password?: string },
    serverPath: string,
    configs: AllConfigs
  ): Promise<boolean> {
    uploadingConfig.value = true
    configUploadStatus.value = t('deploy.uploadingConfig')
    addLog(t('deploy.startUploadConfig'), 'info')
    try {
      const rustConfig = buildSshConfig(sshConfig)
      const options: DeployOptions = {
        server_path: serverPath,
        download_server: false,
        start_server: false,
        download_results: false,
      }
      const configsJson = configs as unknown as Record<string, unknown>
      const result = await invoke<{ success: boolean; error?: string }>('deploy', {
        sshConfig: rustConfig,
        options,
        configs: configsJson,
      })
      if (result.success) {
        addLog(t('deploy.configUploadSuccess'), 'success')
        notify.success(t('deploy.configUploadSuccess'))
        return true
      } else {
        addLog(result.error || t('deploy.configUploadFailedMsg'), 'error')
        notify.error(t('deploy.configUploadFailedMsg'))
        return false
      }
    } catch (err) {
      addLog(String(err), 'error')
      notify.error(t('deploy.configUploadFailedMsg'))
      return false
    } finally {
      uploadingConfig.value = false
      configUploadStatus.value = ''
    }
  }

  async function startServer(
    sshConfig: { host: string; port: number; username: string; password?: string },
    serverPath: string
  ): Promise<boolean> {
    startingServer.value = true
    addLog(t('deploy.startingServer'), 'info')
    try {
      const rustConfig = buildSshConfig(sshConfig)
      const result = await invoke<{ success: boolean; message?: string; error?: string }>('start_acc_server_cmd', {
        sshConfig: rustConfig,
        serverPath: serverPath,
      })
      if (result.success) {
        addLog(result.message || t('deploy.serverStartSuccess'), 'success')
        notify.success(t('deploy.serverStartSuccess'))
        serverRunning.value = true
        return true
      } else {
        addLog(result.error || t('deploy.serverStartFailedMsg'), 'error')
        notify.error(t('deploy.serverStartFailedMsg'))
        return false
      }
    } catch (err) {
      addLog(String(err), 'error')
      notify.error(t('deploy.serverStartFailedMsg'))
      return false
    } finally {
      startingServer.value = false
    }
  }

  async function stopServer(
    sshConfig: { host: string; port: number; username: string; password?: string },
    serverPath: string
  ): Promise<boolean> {
    stoppingServer.value = true
    addLog(t('deploy.stoppingServer'), 'info')
    try {
      const rustConfig = buildSshConfig(sshConfig)
      const result = await invoke<{ success: boolean; message?: string; error?: string }>('stop_acc_server_cmd', {
        sshConfig: rustConfig,
        serverPath,
      })
      if (result.success) {
        addLog(result.message || t('deploy.serverStopSuccess'), 'success')
        notify.success(t('deploy.serverStopSuccess'))
        serverRunning.value = false
        return true
      } else {
        addLog(result.error || t('deploy.serverStopFailedMsg'), 'error')
        notify.error(t('deploy.serverStopFailedMsg'))
        return false
      }
    } catch (err) {
      addLog(String(err), 'error')
      notify.error(t('deploy.serverStopFailedMsg'))
      return false
    } finally {
      stoppingServer.value = false
    }
  }

  async function checkServerStatus(
    sshConfig: { host: string; port: number; username: string; password?: string }
  ): Promise<boolean> {
    try {
      const rustConfig = buildSshConfig(sshConfig)
      const result = await invoke<{ success: boolean; running: boolean; error?: string }>('check_acc_server_status_cmd', {
        sshConfig: rustConfig,
      })
      if (result.success) {
        serverRunning.value = result.running
        return result.running
      }
      return false
    } catch {
      return false
    }
  }

  async function downloadResults(
    sshConfig: { host: string; port: number; username: string; password?: string },
    serverPath: string
  ): Promise<boolean> {
    downloadingResults.value = true
    addLog(t('deploy.downloading'), 'info')
    try {
      const rustConfig = buildSshConfig(sshConfig)
      const appDataDir = await invoke<string>('get_app_data_dir')
      const selectedPath = await open({
        directory: true,
        multiple: false,
        defaultPath: `${appDataDir}\\ACC-Pit-Wall\\results`,
        title: t('deploy.downloadResults'),
      })

      if (!selectedPath || Array.isArray(selectedPath)) {
        addLog('已取消下载：未选择保存路径', 'warning')
        return false
      }

      const result = await invoke<{ success: boolean; files?: string[]; error?: string }>('download_results_filtered_cmd', {
        sshConfig: rustConfig,
        serverPath,
        localPath: selectedPath,
      })

      if (result.success) {
        const count = result.files?.length ?? 0
        addLog(`${t('deploy.downloadSuccess').replace('{count}', String(count))} -> ${selectedPath}`, 'success')
        notify.success(t('deploy.downloadResults'))
        return true
      }

      addLog(result.error || t('deploy.downloadResultsFailed'), 'error')
      notify.error(t('deploy.downloadResultsFailed'))
      return false
    } catch (err) {
      addLog(`${t('deploy.downloadResultsError')}: ${String(err)}`, 'error')
      notify.error(t('deploy.downloadResultsFailed'))
      return false
    } finally {
      downloadingResults.value = false
    }
  }

  return {
    uploadingConfig,
    configUploadStatus,
    startingServer,
    stoppingServer,
    downloadingResults,
    serverRunning,
    serverLogs,
    loading,
    addLog,
    clearLogs,
    deploy,
    startServer,
    stopServer,
    checkServerStatus,
    downloadResults,
  }
}