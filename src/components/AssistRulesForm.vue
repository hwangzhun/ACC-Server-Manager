<template>
  <div class="assist-rules-form">
    <Win11Card>
      <template #title>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-win11-accent/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-win11-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-win11-text m-0">{{ t('nav.assistRules') }}</h3>
            <p class="text-xs text-win11-text-secondary m-0">Driving Assists Configuration</p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <div class="win11-form-field">
          <Win11Slider
            v-model="assistRules.stabilityControlLevelMax"
            :label="t('form.stabilityControlLevelMax')"
            :min="0"
            :max="100"
            :step="1"
          />
        </div>

        <Win11Divider />

        <div>
          <h4 class="text-sm font-semibold text-win11-text mb-4">Disabled Assists</h4>
          <div class="space-y-3">
            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableIdealLine') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableIdealLine"
                @update:model-value="assistRules.disableIdealLine = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutosteer') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutosteer"
                @update:model-value="assistRules.disableAutosteer = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoPitLimiter') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoPitLimiter"
                @update:model-value="assistRules.disableAutoPitLimiter = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoGear') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoGear"
                @update:model-value="assistRules.disableAutoGear = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoClutch') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoClutch"
                @update:model-value="assistRules.disableAutoClutch = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoEngineStart') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoEngineStart"
                @update:model-value="assistRules.disableAutoEngineStart = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoWiper') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoWiper"
                @update:model-value="assistRules.disableAutoWiper = $event"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.disableAutoLights') }}</span>
              </div>
              <Win11Toggle
                :model-value="assistRules.disableAutoLights"
                @update:model-value="assistRules.disableAutoLights = $event"
              />
            </div>
          </div>
        </div>
      </div>
    </Win11Card>
  </div>
</template>

<script setup lang="ts">
import type { AssistRules } from '../types/configuration'
import { t } from '../i18n'
import { Win11Card, Win11Slider, Win11Toggle, Win11Divider } from './win11'

defineProps<{
  assistRules: AssistRules
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
</style>
