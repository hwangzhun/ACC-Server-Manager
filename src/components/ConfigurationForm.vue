<template>
  <div class="configuration-form">
    <Win11Card>
      <template #title>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-win11-accent/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-win11-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0Z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-win11-text m-0">{{ t('nav.configuration') }}</h3>
            <p class="text-xs text-win11-text-secondary m-0">Network & Connection Settings</p>
          </div>
        </div>
      </template>

      <div class="win11-form-grid cols-2">
        <div class="space-y-4">
          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.udpPort') }}</label>
            <Win11Input
              v-model.number="configuration.udpPort"
              type="number"
              hint="UDP port for game data"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.tcpPort') }}</label>
            <Win11Input
              v-model.number="configuration.tcpPort"
              type="number"
              hint="TCP port for control data"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.maxConnections') }}</label>
            <Win11Input
              v-model.number="configuration.maxConnections"
              type="number"
              hint="Maximum concurrent connections"
            />
          </div>

          <div class="space-y-3">
            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.lanDiscovery') }}</span>
                <span class="win11-toggle-desc">Enable LAN server discovery</span>
              </div>
              <Win11Toggle
                :model-value="configuration.lanDiscovery === 1"
                @update:model-value="configuration.lanDiscovery = $event ? 1 : 0"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.registerToLobby') }}</span>
                <span class="win11-toggle-desc">Register server in public lobby</span>
              </div>
              <Win11Toggle
                :model-value="configuration.registerToLobby === 1"
                @update:model-value="configuration.registerToLobby = $event ? 1 : 0"
              />
            </div>
          </div>
        </div>
      </div>
    </Win11Card>
  </div>
</template>

<script setup lang="ts">
import type { Configuration } from '../types/configuration'
import { t } from '../i18n'
import { Win11Card, Win11Input, Win11Toggle } from './win11'

defineProps<{
  configuration: Configuration
}>()
</script>

<style scoped>
.win11-form-field {
  @apply flex flex-col gap-2;
}

.win11-toggle-row {
  @apply flex items-center justify-between py-3;
  @apply border-b border-win11-border;
}

.win11-toggle-row:last-child {
  @apply border-b-0;
}

.win11-toggle-info {
  @apply flex flex-col gap-1;
}

.win11-toggle-label {
  @apply text-sm text-win11-text;
}

.win11-toggle-desc {
  @apply text-xs text-win11-text-secondary;
}
</style>
