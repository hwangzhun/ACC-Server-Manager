<template>
  <div class="win11-progress" :style="{ height: `${strokeWidth}px` }">
    <div class="win11-progress__bar">
      <div
        class="win11-progress__fill"
        :style="{ width: `${percentage}%`, backgroundColor: color }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  percentage?: number
  strokeWidth?: number
  color?: string
  showText?: boolean
}>(), {
  percentage: 0,
  strokeWidth: 6,
  showText: false
})

const color = computed(() => {
  if (props.color) return props.color
  const pct = props.percentage ?? 0
  if (pct <= 30) return '#67c23a'
  if (pct <= 60) return '#e6a23c'
  return '#f56c6c'
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.win11-progress {
  width: 100%;
}

.win11-progress__bar {
  width: 100%;
  height: 100%;
  background: var(--win11-control-bg);
  border-radius: 4px;
  overflow: hidden;
}

.win11-progress__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
}
</style>
