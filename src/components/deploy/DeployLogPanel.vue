<template>
  <div class="win11-logs-section">
    <h4 class="text-sm font-semibold text-win11-text mb-3">{{ t('deploy.serverLogs') }}</h4>
    <div class="win11-logs-window">
      <div class="win11-logs-titlebar">
        <span class="win11-logs-titlebar-label">{{ t('deploy.operationLogs') }}</span>
        <Win11Button
          variant="ghost"
          size="small"
          :disabled="logs.length === 0"
          @click="emit('clear')"
        >
          {{ t('deploy.clear') }}
        </Win11Button>
      </div>
      <div class="win11-logs-container">
        <template v-if="logs.length > 0">
          <div
            v-for="(log, index) in logs"
            :key="index"
            :class="['win11-log-line', `log-${log.type}`]"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </template>
        <p v-else class="win11-logs-empty">{{ t('deploy.logEmptyHint') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '../../i18n'
import { Win11Button } from '../win11'
import type { LogEntry } from '../../composables/useDeployOperations'

defineProps<{
  logs: LogEntry[]
}>()

const emit = defineEmits<{
  'clear': []
}>()
</script>

<style scoped>
.win11-logs-section {
  @apply mt-6;
}

/* 外框：类似独立日志窗口 */
.win11-logs-window {
  @apply rounded-lg overflow-hidden;
  @apply border border-win11-border;
  @apply bg-win11-surface;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.win11-logs-titlebar {
  @apply flex items-center justify-between gap-2 px-3 py-2;
  @apply border-b border-win11-border;
  @apply bg-win11-control-bg;
}

.win11-logs-titlebar-label {
  @apply text-xs font-medium text-win11-text-secondary uppercase tracking-wide;
}

.win11-logs-container {
  @apply p-4 min-h-[12rem] max-h-64 overflow-y-auto;
  font-family: 'Consolas', 'Monaco', 'Cascadia Mono', monospace;
}

.win11-logs-empty {
  @apply m-0 py-8 px-2 text-sm text-win11-text-secondary text-center;
  @apply leading-relaxed;
}

.win11-log-line {
  @apply flex gap-3 py-1 text-sm;
}

.win11-log-line.log-info {
  @apply text-win11-text;
}

.win11-log-line.log-success {
  color: rgb(var(--win11-log-success-rgb));
}

.win11-log-line.log-error {
  color: rgb(var(--win11-error-text-rgb));
}

.win11-log-line.log-warning {
  color: rgb(var(--win11-log-warning-rgb));
}

.log-time {
  @apply text-win11-text-secondary font-mono shrink-0;
}

.log-message {
  @apply flex-1 break-words;
}
</style>
