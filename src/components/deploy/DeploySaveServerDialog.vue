<template>
  <Win11Dialog
    v-model="visible"
    :title="t('deploy.saveServer')"
    width="460px"
    @close="handleClose"
  >
    <div class="space-y-4">
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverName') }} *</label>
        <Win11Input
          v-model="serverName"
          :placeholder="t('deploy.inputServerName')"
          :error="nameError"
        />
      </div>
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverPath') }}</label>
        <Win11Input
          v-model="serverPath"
          :placeholder="t('deploy.serverPathPlaceholder')"
        />
      </div>
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.description') }}</label>
        <Win11Input
          v-model="description"
          :placeholder="t('deploy.inputDescription')"
        />
      </div>
    </div>
    <template #footer>
      <Win11Button variant="secondary" @click="handleClose">
        {{ t('common.cancel') }}
      </Win11Button>
      <Win11Button variant="primary" :loading="saving" @click="handleSave">
        {{ t('common.save') }}
      </Win11Button>
    </template>
  </Win11Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { t } from '../../i18n'
import { Win11Dialog, Win11Input, Win11Button } from '../win11'
import type { SshConfig } from '../../types/server'

interface SshFormConfig extends SshConfig {
  serverPath?: string
}

const props = defineProps<{
  modelValue: boolean
  config: SshFormConfig
  defaultName?: string
  defaultServerPath?: string
  defaultDescription?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [name: string, serverPath: string | undefined, description: string | undefined]
}>()

const visible = ref(props.modelValue)
const serverName = ref(props.defaultName || '')
const serverPath = ref(props.defaultServerPath || props.config.serverPath || '')
const description = ref(props.defaultDescription || '')
const nameError = ref('')
const saving = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    serverName.value = props.defaultName || ''
    serverPath.value = props.defaultServerPath || props.config.serverPath || ''
    description.value = props.defaultDescription || ''
    nameError.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function validate(): boolean {
  if (!serverName.value.trim()) {
    nameError.value = t('deploy.pleaseInputServerName')
    return false
  }
  if (serverName.value.length > 50) {
    nameError.value = t('deploy.serverNameTooLong')
    return false
  }
  nameError.value = ''
  return true
}

async function handleSave() {
  if (!validate()) return
  saving.value = true
  try {
    emit('save', serverName.value.trim(), serverPath.value.trim() || undefined, description.value.trim() || undefined)
    visible.value = false
  } finally {
    saving.value = false
  }
}

function handleClose() {
  visible.value = false
}
</script>

<style scoped>
.win11-form-field {
  @apply flex flex-col gap-2;
}

.win11-form-label {
  @apply text-sm font-medium text-win11-text;
}
</style>