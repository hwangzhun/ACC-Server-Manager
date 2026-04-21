<template>
  <div class="event-rules-form">
    <Win11Card>
      <template #title>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-win11-accent/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-win11-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-win11-text m-0">{{ t('nav.eventRules') }}</h3>
            <p class="text-xs text-win11-text-secondary m-0">Pit Stop & Driver Rules</p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <div class="win11-form-grid cols-3">
          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.pitWindowLengthSec') }}</label>
            <Win11Input
              v-model.number="eventRules.pitWindowLengthSec"
              type="number"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.driverStintTimeSec') }}</label>
            <Win11Input
              v-model.number="eventRules.driverStintTimeSec"
              type="number"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.mandatoryPitstopCount') }}</label>
            <Win11Input
              v-model.number="eventRules.mandatoryPitstopCount"
              type="number"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.maxTotalDrivingTime') }}</label>
            <Win11Input
              v-model.number="eventRules.maxTotalDrivingTime"
              type="number"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.maxDriversCount') }}</label>
            <Win11Input
              v-model.number="eventRules.maxDriversCount"
              type="number"
            />
          </div>

          <div class="win11-form-field">
            <label class="win11-form-label">{{ t('form.tyreSetCount') }}</label>
            <Win11Input
              v-model.number="eventRules.tyreSetCount"
              type="number"
            />
          </div>
        </div>

        <Win11Divider />

        <div>
          <h4 class="text-sm font-semibold text-win11-text mb-4">Pit Stop Requirements</h4>
          <div class="space-y-3">
            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.isRefuellingAllowedInRace') }}</span>
              </div>
              <Win11Toggle
                :model-value="eventRules.isRefuellingAllowedInRace"
                @update:model-value="eventRules.isRefuellingAllowedInRace = Boolean($event)"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.isRefuellingTimeFixed') }}</span>
              </div>
              <Win11Toggle
                :model-value="eventRules.isRefuellingTimeFixed"
                @update:model-value="eventRules.isRefuellingTimeFixed = Boolean($event)"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.isMandatoryPitstopRefuellingRequired') }}</span>
              </div>
              <Win11Toggle
                :model-value="eventRules.isMandatoryPitstopRefuellingRequired"
                @update:model-value="eventRules.isMandatoryPitstopRefuellingRequired = Boolean($event)"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.isMandatoryPitstopTyreChangeRequired') }}</span>
              </div>
              <Win11Toggle
                :model-value="eventRules.isMandatoryPitstopTyreChangeRequired"
                @update:model-value="eventRules.isMandatoryPitstopTyreChangeRequired = Boolean($event)"
              />
            </div>

            <div class="win11-toggle-row">
              <div class="win11-toggle-info">
                <span class="win11-toggle-label">{{ t('form.isMandatoryPitstopSwapDriverRequired') }}</span>
              </div>
              <Win11Toggle
                :model-value="eventRules.isMandatoryPitstopSwapDriverRequired"
                @update:model-value="eventRules.isMandatoryPitstopSwapDriverRequired = Boolean($event)"
              />
            </div>
          </div>
        </div>
      </div>
    </Win11Card>
  </div>
</template>

<script setup lang="ts">
import type { EventRules } from '../types/configuration'
import { t } from '../i18n'
import { Win11Card, Win11Input, Win11Toggle, Win11Divider } from './win11'

defineProps<{
  eventRules: EventRules
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
