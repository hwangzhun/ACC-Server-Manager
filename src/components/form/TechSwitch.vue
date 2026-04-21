<template>
  <div class="tech-form-field">
    <label v-if="label" class="tech-label">
      {{ label }}
    </label>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue === activeValue"
      class="tech-switch"
      :class="[
        modelValue === activeValue ? 'is-active' : 'is-inactive',
        { 'is-disabled': disabled }
      ]"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="tech-switch-track">
        <span class="tech-switch-thumb"></span>
      </span>
      <span v-if="description" class="tech-switch-description">{{ description }}</span>
    </button>
    <p v-if="error" class="tech-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number | boolean
  activeValue?: number | boolean
  inactiveValue?: number | boolean
  disabled?: boolean
  error?: string
  description?: string
  label?: string
}>(), {
  activeValue: 1,
  inactiveValue: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: number | boolean]
}>()

const toggle = () => {
  if (props.disabled) return
  const newValue = props.modelValue === props.activeValue
    ? props.inactiveValue
    : props.activeValue
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.tech-form-field {
  @apply space-y-2;
}

.tech-label {
  @apply block text-sm font-medium;
  color: var(--win11-text-secondary);
  @apply select-none;
}

.tech-switch {
  @apply inline-flex items-center gap-3;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.tech-switch-track {
  @apply relative w-11 h-6 rounded-full;
  @apply transition-colors duration-200 ease-in-out;
}

.tech-switch.is-active .tech-switch-track {
  @apply bg-gradient-to-r from-neon-blue to-tech-600;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.tech-switch.is-inactive .tech-switch-track {
  background: var(--win11-border);
}

.tech-switch-thumb {
  @apply absolute top-0.5 left-0.5;
  @apply w-5 h-5 rounded-full bg-white;
  @apply shadow-md;
  @apply transition-all duration-200 ease-in-out;
}

.tech-switch.is-active .tech-switch-thumb {
  @apply transform translate-x-5;
}

.tech-switch-description {
  @apply text-sm;
  color: var(--win11-text);
}

.tech-error {
  @apply text-xs;
  color: #f56c6c;
}
</style>
