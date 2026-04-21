<template>
  <div class="win11-toggle-wrapper">
    <button
      type="button"
      role="switch"
      class="win11-toggle"
      :data-checked="checked"
      :aria-checked="checked"
      @click="toggle"
    >
      <span class="win11-toggle-track"></span>
      <span class="win11-toggle-thumb"></span>
    </button>
    <span v-if="label" class="win11-toggle-label">{{ label }}</span>
    <p v-if="error" class="win11-error">{{ error }}</p>
    <p v-else-if="hint" class="win11-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: number | boolean
  disabled?: boolean
  label?: string
  error?: string
  hint?: string
}>(), {
  modelValue: 0,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const checked = computed(() => {
  if (typeof props.modelValue === 'boolean') {
    return props.modelValue
  }
  return props.modelValue === 1
})

function toggle() {
  if (!props.disabled) {
    const newValue = checked.value ? 0 : 1
    emit('update:modelValue', newValue)
  }
}

import { computed } from 'vue'
</script>

<style scoped>
.win11-toggle-wrapper {
  @apply flex items-center gap-3;
}

.win11-toggle-label {
  @apply text-sm text-win11-text;
}

.win11-hint {
  @apply text-xs text-win11-text-secondary mt-1;
}
</style>
