<template>
  <Win11Dialog
    v-model="visible"
    :title="t('deploy.renameServer')"
    width="400px"
    @close="handleClose"
  >
    <div class="space-y-4">
      <div class="win11-form-field">
        <label class="win11-form-label">{{ t('deploy.newName') }} *</label>
        <Win11Input
          v-model="newName"
          :placeholder="t('deploy.inputNewName')"
          :error="nameError"
        />
      </div>
    </div>
    <template #footer>
      <Win11Button variant="secondary" @click="handleClose">
        {{ t('common.cancel') }}
      </Win11Button>
      <Win11Button variant="primary" :loading="renaming" @click="handleRename">
        {{ t('common.confirm') }}
      </Win11Button>
    </template>
  </Win11Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { t } from '../../i18n'
import { Win11Dialog, Win11Input, Win11Button } from '../win11'

const props = defineProps<{
  modelValue: boolean
  currentName: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'rename': [newName: string]
}>()

const visible = ref(props.modelValue)
const newName = ref('')
const nameError = ref('')
const renaming = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    newName.value = props.currentName
    nameError.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function validate(): boolean {
  if (!newName.value.trim()) {
    nameError.value = t('deploy.pleaseInputNewName')
    return false
  }
  if (newName.value.length > 50) {
    nameError.value = t('deploy.serverNameTooLong')
    return false
  }
  nameError.value = ''
  return true
}

async function handleRename() {
  if (!validate()) return
  renaming.value = true
  try {
    emit('rename', newName.value.trim())
    visible.value = false
  } finally {
    renaming.value = false
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