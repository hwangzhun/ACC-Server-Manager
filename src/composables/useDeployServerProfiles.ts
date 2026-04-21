import { ref } from 'vue'
import { getServers, saveServer, loadServer, deleteServer, renameServer, createServerProfile } from '../utils/serverManager'
import type { ServerListItem, ServerProfile, SshConfig } from '../types/server'
import notify from '../components/win11/notify'
import { t } from '../i18n'

export function useDeployServerProfiles() {
  const serverList = ref<ServerListItem[]>([])
  const selectedServerName = ref('')
  const loading = ref(false)

  async function loadServerList(): Promise<void> {
    try {
      loading.value = true
      serverList.value = await getServers()
    } catch (err) {
      notify.error(t('deploy.loadServerListFailed'))
    } finally {
      loading.value = false
    }
  }

  async function selectServer(name: string): Promise<ServerProfile | null> {
    selectedServerName.value = name
    if (!name) return null
    try {
      return await loadServer(name)
    } catch {
      notify.error(t('deploy.loadServerFailed'))
      return null
    }
  }

  async function saveCurrentServer(
    name: string,
    config: SshConfig,
    serverPath?: string,
    description?: string
  ): Promise<boolean> {
    try {
      const profile = createServerProfile(name, config, serverPath, description)
      await saveServer(profile)
      await loadServerList()
      notify.success(t('deploy.serverSaved'))
      return true
    } catch {
      notify.error(t('deploy.saveServerFailed'))
      return false
    }
  }

  async function updateServer(
    name: string,
    config: SshConfig,
    serverPath?: string,
    description?: string
  ): Promise<boolean> {
    try {
      const profile = createServerProfile(name, config, serverPath, description)
      await saveServer(profile)
      notify.success(t('deploy.serverUpdated'))
      return true
    } catch {
      notify.error(t('deploy.updateServerFailed'))
      return false
    }
  }

  async function deleteCurrentServer(name: string): Promise<boolean> {
    const confirmed = await notify.confirm({
      title: t('common.delete'),
      message: `${name}: ${t('deploy.confirmDeleteServer')}`,
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      type: 'warning'
    })
    if (!confirmed) return false
    try {
      await deleteServer(name)
      if (selectedServerName.value === name) {
        selectedServerName.value = ''
      }
      await loadServerList()
      notify.success(t('deploy.serverDeleted'))
      return true
    } catch {
      notify.error(t('deploy.deleteServerFailed'))
      return false
    }
  }

  async function renameCurrentServer(oldName: string, newName: string): Promise<boolean> {
    try {
      await renameServer(oldName, newName)
      selectedServerName.value = newName
      await loadServerList()
      notify.success(t('deploy.serverRenamed'))
      return true
    } catch {
      notify.error(t('deploy.renameServerFailed'))
      return false
    }
  }

  return {
    serverList,
    selectedServerName,
    loading,
    loadServerList,
    selectServer,
    saveCurrentServer,
    updateServer,
    deleteCurrentServer,
    renameCurrentServer,
  }
}