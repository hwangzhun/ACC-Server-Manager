<template>
  <div class="win11-input-wrapper" :class="{ 'has-prefix': $slots.prefix || prefixIcon }">
    <div class="relative flex items-center">
      <span v-if="$slots.prefix || prefixIcon" class="win11-input-prefix">
        <slot name="prefix">
          <svg v-if="prefixIcon === 'search'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </slot>
      </span>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        class="win11-input"
        :class="[
          `win11-input--${size}`,
          { 'has-clear': clearable && modelValue, 'error': error, 'has-prefix': $slots.prefix || prefixIcon }
        ]"
        @input="handleInput"
        @change="emit('change', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="clearable && modelValue"
        type="button"
        class="win11-input-clear"
        @click="handleClear"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <span v-if="maxlength && showWordLimit" class="win11-input-count">
        {{ String(modelValue || '').length }}/{{ maxlength }}
      </span>
    </div>
    <p v-if="error" class="win11-error">{{ error }}</p>
    <p v-else-if="hint" class="win11-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  id?: string
  size?: 'small' | 'default' | 'large'
  clearable?: boolean
  prefixIcon?: 'search' | string
  maxlength?: number | string
  showWordLimit?: boolean
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  size: 'default',
  clearable: false,
  showWordLimit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'clear': []
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.win11-input-wrapper {
  @apply w-full relative;
}

.win11-input {
  @apply w-full rounded-md;
  @apply bg-win11-control-bg text-win11-text text-sm;
  @apply border border-transparent;
  @apply transition-colors duration-200;
  @apply outline-none;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.win11-input--small {
  @apply h-8 px-2 py-1 text-xs;
}

.win11-input--default {
  @apply h-10 px-3 py-2;
}

.win11-input--large {
  @apply h-12 px-4 py-3 text-base;
}

.win11-input::placeholder {
  @apply text-win11-text-secondary;
}

.win11-input:focus {
  @apply border-win11-accent;
  box-shadow: 0 0 0 1px var(--win11-accent);
}

.win11-input.has-prefix {
  padding-left: 36px;
}

.win11-input.has-clear {
  padding-right: 32px;
}


.win11-input-prefix {
  @apply absolute left-3 top-1/2 -translate-y-1/2;
  @apply text-win11-text-secondary;
  @apply pointer-events-none;
}

.win11-input-clear {
  @apply absolute right-2 top-1/2 -translate-y-1/2;
  @apply w-6 h-6 p-0 rounded;
  @apply flex items-center justify-center;
  @apply bg-transparent border-none;
  @apply text-win11-text-secondary;
  @apply cursor-pointer;
  @apply transition-colors duration-150;
}

.win11-input-clear:hover {
  @apply text-win11-text;
  background: var(--win11-control-hover-bg);
}

.win11-input-count {
  @apply absolute right-3 top-1/2 -translate-y-1/2;
  @apply text-xs text-win11-text-secondary;
  pointer-events: none;
}

.win11-hint {
  @apply text-xs text-win11-text-secondary mt-1;
}
</style>
