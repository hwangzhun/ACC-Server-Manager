<template>
  <div class="win11-form-section">
    <div class="win11-status-bar">
      <span class="text-sm text-win11-text">{{ t('deploy.connectionStatus') }}</span>
      <div class="flex items-center gap-2">
        <div
          class="w-2 h-2 rounded-full"
          :class="isConnected ? 'is-connected-indicator' : 'bg-win11-text-secondary'"
        ></div>
        <span class="text-sm" :class="isConnected ? 'is-connected-text' : 'text-win11-text-secondary'">
          {{ isConnected ? `${t('deploy.connected')}: ${connectionStatus.host}` : t('deploy.notConnected') }}
        </span>
      </div>
    </div>

    <div class="win11-form-grid cols-2">
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.selectServer') }}</label>
        <Win11Select
          v-model="selectedServerName"
          :options="serverSelectOptions"
          :placeholder="t('deploy.selectSavedServer')"
          :disabled="loading"
          @change="handleServerSelect"
        />
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverAddress') }}</label>
        <div class="win11-readonly-field">
          {{ sshConfig.host || '-' }}
        </div>
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.port') }}</label>
        <div class="win11-readonly-field">
          {{ sshConfig.port || '-' }}
        </div>
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.username') }}</label>
        <div class="win11-readonly-field">
          {{ sshConfig.username || '-' }}
        </div>
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.password') }}</label>
        <div class="win11-readonly-field">
          {{ sshConfig.password ? '••••••••' : '-' }}
        </div>
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverPath') }}</label>
        <div class="win11-readonly-field">
          {{ sshConfig.serverPath || '-' }}
        </div>
      </div>
    </div>

    <div class="flex gap-2 flex-wrap">
      <Win11Button
        :variant="isConnected ? 'danger' : 'primary'"
        :loading="connecting"
        :disabled="!isConnected && !isFormValid"
        @click="handleConnect"
      >
        {{ isConnected ? t('deploy.disconnect') : t('deploy.connect') }}
      </Win11Button>

      <Win11Button
        variant="secondary"
        @click="handleCreateServer"
      >
        {{ t('deploy.newServer') }}
      </Win11Button>

      <Win11Button
        v-if="selectedServerName"
        variant="secondary"
        @click="handleEditServer"
      >
        {{ t('deploy.editServer') }}
      </Win11Button>

      <Win11Button
        v-if="selectedServerName"
        variant="danger"
        @click="handleDeleteServer"
      >
        {{ t('common.delete') }}
      </Win11Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { t } from '../../i18n'
import { Win11Select, Win11Button } from '../win11'
import type { SshConfig } from '../../types/server'
import type { ServerListItem } from '../../types/server'

interface SshFormConfig extends SshConfig {
  serverPath: string
}

const props = defineProps<{
  isConnected: boolean
  connecting: boolean
  connectionStatus: { connected: boolean; host?: string; username?: string }
  validationErrors: Record<string, string>
  serverList: ServerListItem[]
  selectedServerName: string
  loading: boolean
  sshConfig: SshFormConfig
}>()

const emit = defineEmits<{
  'update:selectedServerName': [value: string]
  'connect': [config: { host: string; port: number; username: string; password: string }]
  'disconnect': []
  'create-server': []
  'edit-server': []
  'delete': []
}>()

const selectedServerName = ref(props.selectedServerName)

watch(() => props.selectedServerName, (val) => {
  selectedServerName.value = val
})

const serverSelectOptions = computed(() =>
  props.serverList.map(s => ({ value: s.name, label: `${s.name} (${s.host})` }))
)

const isFormValid = computed(() => {
  return props.sshConfig.host && props.sshConfig.port && props.sshConfig.username
})

function handleServerSelect(name: string | number) {
  emit('update:selectedServerName', String(name))
}

function handleConnect() {
  if (props.isConnected) {
    emit('disconnect')
  } else {
    emit('connect', {
      host: props.sshConfig.host,
      port: props.sshConfig.port,
      username: props.sshConfig.username,
      password: props.sshConfig.password || '',
    })
  }
}

function handleCreateServer() {
  emit('create-server')
}

function handleEditServer() {
  emit('edit-server')
}

function handleDeleteServer() {
  emit('delete')
}
</script>

<style scoped>
.win11-form-section {
  @apply space-y-4;
}

.win11-form-grid {
  @apply grid gap-4;
}

.win11-form-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.win11-form-field {
  @apply flex flex-col gap-2;
}

.win11-form-label {
  @apply text-sm font-medium text-win11-text;
}

.win11-readonly-field {
  @apply h-10 px-3 py-2 rounded-md;
  @apply bg-win11-control-bg text-win11-text text-sm;
  @apply border border-transparent;
  @apply flex items-center;
}

.win11-status-bar {
  @apply flex items-center justify-between p-4 rounded-lg;
  @apply bg-win11-control-bg border border-win11-border;
}

.is-connected-indicator {
  background-color: rgb(var(--win11-connected-rgb));
}

.is-connected-text {
  color: rgb(var(--win11-connected-rgb));
}
</style>
