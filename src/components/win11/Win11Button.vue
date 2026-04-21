<template>
  <button
    :type="type"
    class="win11-button"
    :class="[
      variant,
      `win11-button--${size}`,
      {
        'is-circle': circle,
        'is-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <svg v-if="loading" class="win11-button__loading" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-else-if="icon" class="win11-button__icon">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <span v-if="!circle || $slots.default" class="win11-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
  circle?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'default',
  disabled: false,
  loading: false,
  circle: false
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.win11-button {
  @apply h-9 px-4 rounded-md font-medium text-sm;
  @apply inline-flex items-center justify-center gap-2;
  @apply transition-all duration-150;
  @apply border-none cursor-pointer;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-win11-bg;
}

.win11-button--small {
  @apply h-7 px-3 text-xs;
}

.win11-button--default {
  @apply h-9 px-4 text-sm;
}

.win11-button--large {
  @apply h-11 px-6 text-base;
}

.win11-button.is-circle {
  @apply p-0 rounded-full;
  width: 36px;
  height: 36px;
  padding: 0;
}

.win11-button--small.is-circle {
  width: 28px;
  height: 28px;
}

.win11-button--large.is-circle {
  width: 44px;
  height: 44px;
}

.win11-button__loading {
  @apply w-4 h-4;
  animation: spin 1s linear infinite;
}

.win11-button__icon {
  @apply flex items-center justify-center;
}

.win11-button__icon svg,
.win11-button__icon img {
  @apply w-4 h-4;
}

.win11-button--small .win11-button__icon svg,
.win11-button--small .win11-button__icon img {
  @apply w-3 h-3;
}

.win11-button--large .win11-button__icon svg,
.win11-button--large .win11-button__icon img {
  @apply w-5 h-5;
}

.win11-button__text {
  @apply flex items-center;
}

/* Primary variant */
.win11-button.primary {
  @apply bg-win11-accent text-white;
}

.win11-button.primary:hover:not(:disabled) {
  @apply bg-win11-accent-hover;
}

.win11-button.primary:focus {
  @apply ring-win11-accent;
}

/* Secondary variant */
.win11-button.secondary {
  @apply bg-win11-control-bg text-win11-text;
}

.win11-button.secondary:hover:not(:disabled) {
  @apply bg-win11-control-hover-bg;
}

/* Ghost variant */
.win11-button.ghost {
  @apply bg-transparent text-win11-text;
}

.win11-button.ghost:hover:not(:disabled) {
  @apply bg-win11-control-hover-bg;
}

/* Danger variant */
.win11-button.danger {
  @apply bg-red-500 text-white;
}

.win11-button.danger:hover:not(:disabled) {
  @apply bg-red-600;
}

.win11-button.danger:focus {
  @apply ring-red-500;
}

/* Disabled state */
.win11-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.win11-button.is-loading {
  @apply cursor-wait;
}
</style>
