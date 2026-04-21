<template>
  <Win11Dialog
    v-model="visible"
    :title="dialogTitle"
    width="520px"
    @close="handleClose"
  >
    <div class="space-y-4">
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverName') }} *</label>
        <Win11Input
          v-model="form.name"
          :placeholder="t('deploy.inputServerName')"
          :error="errors.name"
          :disabled="mode === 'edit'"
        />
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverAddress') }} *</label>
        <Win11Input
          v-model="form.host"
          :placeholder="t('deploy.inputServerAddress')"
          :error="errors.host"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="win11-form-field">
          <label class="win11-form-label">{{ t('deploy.port') }} *</label>
          <Win11Input
            v-model.number="form.port"
            type="number"
            :placeholder="t('deploy.portPlaceholder')"
            :error="errors.port"
          />
        </div>

        <div class="win11-form-field">
          <label class="win11-form-label">{{ t('deploy.username') }} *</label>
          <Win11Input
            v-model="form.username"
            :placeholder="t('deploy.inputUsername')"
            :error="errors.username"
          />
        </div>
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.password') }}</label>
        <Win11Input
          v-model="form.password"
          type="password"
          :placeholder="t('deploy.passwordOptional')"
        />
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.serverPath') }}</label>
        <Win11Input
          v-model="form.serverPath"
          :placeholder="t('deploy.serverPathPlaceholder')"
        />
      </div>

      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.description') }}</label>
        <Win11Input
          v-model="form.description"
          :placeholder="t('deploy.inputDescription')"
        />
      </div>

      <div v-if="sshTestError" class="win11-alert win11-alert--error">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ sshTestError }}</span>
      </div>

      <div v-if="mode === 'create' && !sshTested" class="win11-hint">
        {{ t('deploy.sshTestHint') }}
      </div>

      <div v-if="mode === 'create' && sshTested && !sshTestError" class="win11-alert win11-alert--success">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ t('deploy.sshTestSuccess') }}</span>
      </div>
    </div>

    <template #footer>
      <Win11Button variant="secondary" :disabled="saving" @click="handleClose">
        {{ t('common.cancel') }}
      </Win11Button>

      <template v-if="mode === 'create'">
        <Win11Button
          variant="secondary"
          :loading="testing"
          :disabled="saving || !canTest"
          @click="handleTestSsh"
        >
          {{ t('deploy.testConnection') }}
        </Win11Button>
        <Win11Button
          variant="primary"
          :loading="saving"
          :disabled="!saveReady"
          @click="handleSave"
        >
          {{ t('common.save') }}
        </Win11Button>
      </template>

      <template v-else>
        <Win11Button variant="primary" :loading="saving" @click="handleSave">
          {{ t('common.save') }}
        </Win11Button>
      </template>
    </template>
  </Win11Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { t } from '../../i18n'
import { Win11Dialog, Win11Input, Win11Button } from '../win11'

export interface ServerFormData {
  name: string
  host: string
  port: number
  username: string
  password: string
  serverPath: string
  description: string
}

interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  initialData?: ServerFormData
  testConnection: (config: { host: string; port: number; username: string; password: string }) => Promise<{ success: boolean; error?: string }>
  onSave: (data: ServerFormData) => Promise<void>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = ref(props.modelValue)
const saving = ref(false)
const testing = ref(false)
const sshTested = ref(false)
const sshTestError = ref('')
const saveReady = ref(false)

const form = reactive<ServerFormData>({
  name: '',
  host: '',
  port: 22,
  username: '',
  password: '',
  serverPath: 'C:\\ACC_Server',
  description: '',
})

const errors = reactive<Partial<Record<keyof ServerFormData, string>>>({})

const dialogTitle = computed(() =>
  props.mode === 'create' ? t('deploy.createServer') : t('deploy.editServer')
)

const canTest = computed(() => {
  return !!form.host.trim() && form.port > 0 && form.port <= 65535 && !!form.username.trim()
})

const canSave = computed(() => {
  if (props.mode === 'create') {
    return canTest.value && sshTested.value && !sshTestError.value && !!form.name.trim()
  }
  return !!form.name.trim()
})

watch([() => props.mode, canTest, sshTested, sshTestError, () => form.name], () => {
  saveReady.value = canSave.value
}, { immediate: true })

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    resetForm()
    if (props.initialData) {
      Object.assign(form, props.initialData)
    }
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function resetForm() {
  form.name = ''
  form.host = ''
  form.port = 22
  form.username = ''
  form.password = ''
  form.serverPath = 'C:\\ACC_Server'
  form.description = ''
  Object.keys(errors).forEach(k => delete errors[k as keyof ServerFormData])
  sshTested.value = false
  sshTestError.value = ''
  saveReady.value = false
}

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k as keyof ServerFormData])
  let valid = true
  if (!form.name.trim()) {
    errors.name = t('deploy.pleaseInputServerName')
    valid = false
  }
  if (form.name.length > 50) {
    errors.name = t('deploy.serverNameTooLong')
    valid = false
  }
  if (!form.host.trim()) {
    errors.host = t('deploy.pleaseInputServerAddress')
    valid = false
  }
  if (!form.port || form.port < 1 || form.port > 65535) {
    errors.port = t('deploy.pleaseInputValidPort')
    valid = false
  }
  if (!form.username.trim()) {
    errors.username = t('deploy.pleaseInputUsername')
    valid = false
  }
  return valid
}

async function handleTestSsh() {
  if (!canTest.value) return
  testing.value = true
  sshTestError.value = ''
  try {
    const result = await props.testConnection({
      host: form.host,
      port: form.port,
      username: form.username,
      password: form.password,
    })
    if (result.success) {
      sshTested.value = true
      sshTestError.value = ''
    } else {
      sshTestError.value = result.error || t('deploy.sshTestFailed')
      sshTested.value = false
    }
  } finally {
    testing.value = false
  }
}

async function handleSave() {
  if (!validate()) return
  if (props.mode === 'create' && !sshTested.value) return
  saving.value = true
  try {
    await props.onSave({ ...form })
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

.win11-alert {
  @apply flex items-center gap-2 px-3 py-2 rounded-md text-sm;
}

.win11-alert--error {
  @apply bg-red-500/10 text-red-500 border border-red-500/20;
}

.win11-alert--success {
  @apply bg-green-500/10 text-green-500 border border-green-500/20;
}

.win11-hint {
  @apply text-xs text-win11-text-secondary;
}
</style>
