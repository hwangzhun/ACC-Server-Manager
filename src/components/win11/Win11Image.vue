<template>
  <div class="win11-image" :style="containerStyle">
    <img
      v-if="!hasError && src"
      :src="src"
      :alt="alt"
      class="win11-image__img"
      :style="{ objectFit: fit }"
      @error="handleError"
      @load="handleLoad"
    />
    <div v-if="hasError || !src" class="win11-image__placeholder">
      <slot name="error">
        <div class="win11-image__placeholder-icon">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  src?: string | null | undefined
  alt?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none'
  width?: string | number
  height?: string | number
}>(), {
  alt: '',
  fit: 'cover'
})

const hasError = ref(false)

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return style
})

function handleError() {
  hasError.value = true
}

function handleLoad() {
  hasError.value = false
}
</script>

<style scoped>
.win11-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: var(--win11-control-bg);
}

.win11-image__img {
  width: 100%;
  height: 100%;
  display: block;
}

.win11-image__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--win11-control-bg);
  color: var(--win11-text-secondary);
}

.win11-image__placeholder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
