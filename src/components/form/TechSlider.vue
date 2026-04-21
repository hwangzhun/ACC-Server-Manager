<template>
  <div class="tech-form-field">
    <div class="tech-slider-header" v-if="label || showValue">
      <label v-if="label" class="tech-label">{{ label }}</label>
      <span v-if="showValue" class="tech-slider-value">{{ displayValue }}</span>
    </div>
    <div class="tech-slider-wrapper">
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        class="tech-slider"
        :class="{ 'has-error': error }"
        :disabled="disabled"
        @input="handleInput"
      />
      <div v-if="showTicks" class="tech-slider-ticks">
        <span v-for="tick in ticks" :key="tick" class="tech-slider-tick">{{ tick }}</span>
      </div>
    </div>
    <p v-if="description" class="tech-hint">{{ description }}</p>
    <p v-if="error" class="tech-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
  error?: string
  description?: string
  showValue?: boolean
  showTicks?: boolean
  valueFormatter?: (value: number) => string
}>(), {
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
  showTicks: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const ticks = computed(() => {
  const result = []
  for (let i = props.min; i <= props.max; i += (props.max - props.min) / 4) {
    result.push(Math.round(i))
  }
  return result
})

const displayValue = computed(() => {
  if (props.valueFormatter) {
    return props.valueFormatter(props.modelValue)
  }
  return props.modelValue
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<style scoped>
.tech-form-field {
  @apply space-y-2;
}

.tech-slider-header {
  @apply flex items-center justify-between;
}

.tech-label {
  @apply block text-sm font-medium;
  color: var(--win11-text-secondary);
  @apply select-none;
}

.tech-slider-value {
  @apply text-sm font-medium;
  color: var(--win11-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  @apply px-2 py-0.5 rounded;
  background: var(--win11-accent);
  color: #ffffff;
  opacity: 0.1;
}

.tech-slider-wrapper {
  @apply space-y-2;
}

.tech-slider {
  @apply w-full h-2 rounded-lg appearance-none cursor-pointer;
  background: var(--win11-control-bg);
  @apply transition-all duration-200;
}

.tech-slider::-webkit-slider-thumb {
  @apply w-5 h-5 rounded-full appearance-none cursor-pointer;
  @apply bg-gradient-to-br from-neon-blue to-tech-600;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
  @apply transition-transform duration-150;
}

.tech-slider::-webkit-slider-thumb:hover {
  @apply scale-110;
}

.tech-slider::-webkit-slider-thumb:active {
  @apply scale-95;
}

.tech-slider::-moz-range-thumb {
  @apply w-5 h-5 rounded-full cursor-pointer border-0;
  @apply bg-gradient-to-br from-neon-blue to-tech-600;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.tech-slider::-webkit-slider-runnable-track {
  @apply h-2 rounded-lg;
  background: linear-gradient(to right,
    rgba(0, 212, 255, 0.3) 0%,
    rgba(0, 212, 255, 0.5) var(--value-percent, 50%),
    rgba(0, 212, 255, 0.1) var(--value-percent, 50%)
  );
}

.tech-slider::-moz-range-track {
  @apply h-2 rounded-lg;
  background: var(--win11-border);
}

.tech-slider::-moz-range-progress {
  @apply h-2 rounded-lg;
  background: rgba(0, 212, 255, 0.3);
}

.tech-slider.has-error {
  border-color: #f56c6c;
}

.tech-slider-ticks {
  @apply flex justify-between px-1;
}

.tech-slider-tick {
  @apply text-xs font-mono;
  color: var(--win11-text-secondary);
  opacity: 0.5;
}

.tech-hint {
  @apply text-xs;
  color: var(--win11-text-secondary);
  opacity: 0.7;
}

.tech-error {
  @apply text-xs;
  color: #f56c6c;
}
</style>
