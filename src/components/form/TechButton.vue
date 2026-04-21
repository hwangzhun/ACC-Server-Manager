<template>
  <button
    :type="type"
    class="tech-button"
    :class="[
      `tech-button--${variant}`,
      `tech-button--${size}`,
      { 'is-disabled': disabled, 'is-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="tech-button-spinner"></span>
    <span class="tech-button-content" :class="{ 'is-hidden': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.tech-button {
  @apply relative inline-flex items-center justify-center;
  @apply font-medium rounded-lg;
  @apply transition-all duration-200;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply overflow-hidden;
}

.tech-button--sm {
  @apply px-3 py-1.5 text-sm;
}

.tech-button--md {
  @apply px-5 py-2.5 text-base;
}

.tech-button--lg {
  @apply px-6 py-3 text-lg;
}

.tech-button--primary {
  @apply bg-gradient-to-r from-neon-blue to-tech-600 text-white;
  @apply hover:shadow-glow-blue hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue;
  @apply active:scale-95;
}

.tech-button--primary::before {
  content: '';
  @apply absolute inset-0;
  @apply bg-gradient-to-r from-transparent via-white/20 to-transparent;
  @apply transform -translate-x-full;
  @apply transition-transform duration-500;
}

.tech-button--primary:hover::before {
  @apply translate-x-full;
}

.tech-button--secondary {
  background: var(--win11-surface);
  border: 2px solid var(--win11-accent);
  color: var(--win11-accent);
  @apply hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue;
}

.tech-button--secondary:hover {
  background: var(--win11-accent);
  color: #ffffff;
}

.tech-button--danger {
  @apply bg-gradient-to-r from-neon-red to-red-700 text-white;
  @apply hover:shadow-lg hover:scale-105;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-red;
  @apply active:scale-95;
}

.tech-button--ghost {
  @apply bg-transparent;
  color: var(--win11-text-secondary);
  @apply hover:bg-win11-control-hover-bg hover:text-win11-text;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-win11-border;
}

.tech-button.is-disabled {
  @apply transform-none;
}

.tech-button.is-loading {
  @apply cursor-wait;
}

.tech-button-spinner {
  @apply absolute w-5 h-5 border-2 border-current border-t-transparent rounded-full;
  @apply animate-spin;
}

.tech-button-content.is-hidden {
  @apply invisible;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
