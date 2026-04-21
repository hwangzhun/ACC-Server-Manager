<template>
  <Win11Dialog
    v-model="dialogVisible"
    :title="t('deploy.uploadConfirmTitle')"
    width="640px"
    :z-index="2100"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @close="handleCancel"
  >
    <div class="confirm-body">
      <p class="confirm-hint">
        <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('deploy.eventConfigSecondConfirm') }}
      </p>

      <!-- Overview Section -->
      <section class="confirm-section">
        <h4 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ t('deploy.confirmSectionOverview') }}
        </h4>
        <div class="kv-grid">
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmServerName') }}</span>
            <span class="kv-value">{{ configs.settings.serverName || '-' }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmTrack') }}</span>
            <span class="kv-value highlight">{{ configs.event.track || '-' }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmCarGroup') }}</span>
            <span class="kv-value">{{ configs.settings.carGroup || '-' }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmMaxSlots') }}</span>
            <span class="kv-value">{{ configs.settings.maxCarSlots }}</span>
          </div>
        </div>
      </section>

      <!-- Weather Section -->
      <section class="confirm-section">
        <h4 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          {{ t('deploy.confirmSectionWeather') }}
        </h4>
        <div class="kv-grid">
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmAmbientTemp') }}</span>
            <span class="kv-value">{{ configs.event.ambientTemp }}°C</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmCloudLevel') }}</span>
            <span class="kv-value">{{ configs.event.cloudLevel }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmRain') }}</span>
            <span class="kv-value">{{ configs.event.rain }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmWeatherRandomness') }}</span>
            <span class="kv-value">{{ configs.event.weatherRandomness }}</span>
          </div>
        </div>
      </section>

      <!-- Sessions Section -->
      <section class="confirm-section">
        <h4 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('deploy.confirmSectionSessions') }}
        </h4>
        <div class="sessions-table">
          <div class="sessions-header">
            <span>#</span>
            <span>{{ t('deploy.confirmSession') }}</span>
            <span>{{ t('deploy.confirmDay') }}</span>
            <span>{{ t('deploy.confirmStartHour') }}</span>
            <span>{{ t('deploy.confirmDuration') }}</span>
            <span>{{ t('deploy.confirmTimeMultiplier') }}</span>
          </div>
          <div
            v-for="(session, index) in configs.event.sessions"
            :key="index"
            class="sessions-row"
          >
            <span class="session-index">{{ index + 1 }}</span>
            <span class="session-type">{{ session.sessionType }}</span>
            <span>{{ session.dayOfWeekend }}</span>
            <span>{{ session.hourOfDay }}:00</span>
            <span>{{ session.sessionDurationMinutes }}m</span>
            <span>x{{ session.timeMultiplier }}</span>
          </div>
        </div>
      </section>

      <!-- Rules Section -->
      <section class="confirm-section">
        <h4 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {{ t('deploy.confirmSectionRules') }}
        </h4>
        <div class="kv-grid">
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmMandatoryPitstopCount') }}</span>
            <span class="kv-value">{{ configs.eventRules.mandatoryPitstopCount }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmPitWindowLengthSec') }}</span>
            <span class="kv-value">{{ configs.eventRules.pitWindowLengthSec }}s</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmDriverStintTimeSec') }}</span>
            <span class="kv-value">{{ formatDuration(configs.eventRules.driverStintTimeSec) }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmTyreSetCount') }}</span>
            <span class="kv-value">{{ configs.eventRules.tyreSetCount }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmRefuellingAllowedInRace') }}</span>
            <span class="kv-value" :class="boolClass(configs.eventRules.isRefuellingAllowedInRace)">{{ formatBool(configs.eventRules.isRefuellingAllowedInRace) }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmRefuellingTimeFixed') }}</span>
            <span class="kv-value" :class="boolClass(configs.eventRules.isRefuellingTimeFixed)">{{ formatBool(configs.eventRules.isRefuellingTimeFixed) }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmMandatoryPitstopRefuellingRequired') }}</span>
            <span class="kv-value" :class="boolClass(configs.eventRules.isMandatoryPitstopRefuellingRequired)">{{ formatBool(configs.eventRules.isMandatoryPitstopRefuellingRequired) }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmMandatoryPitstopTyreChangeRequired') }}</span>
            <span class="kv-value" :class="boolClass(configs.eventRules.isMandatoryPitstopTyreChangeRequired)">{{ formatBool(configs.eventRules.isMandatoryPitstopTyreChangeRequired) }}</span>
          </div>
          <div class="kv-row">
            <span class="kv-label">{{ t('deploy.confirmMandatoryPitstopSwapDriverRequired') }}</span>
            <span class="kv-value" :class="boolClass(configs.eventRules.isMandatoryPitstopSwapDriverRequired)">{{ formatBool(configs.eventRules.isMandatoryPitstopSwapDriverRequired) }}</span>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <Win11Button variant="secondary" @click="handleCancel">
        {{ t('common.cancel') }}
      </Win11Button>
      <Win11Button variant="primary" :loading="loading" @click="handleConfirm">
        {{ t('deploy.confirmUpload') }}
      </Win11Button>
    </template>
  </Win11Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../../i18n'
import { Win11Dialog, Win11Button } from '../win11'
import type { AllConfigs } from '../../types/configuration'

const props = defineProps<{
  modelValue: boolean
  configs: AllConfigs
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function formatBool(value: boolean): string {
  return value ? t('deploy.confirmYes') : t('deploy.confirmNo')
}

function boolClass(value: boolean): string {
  return value ? 'bool-yes' : 'bool-no'
}

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }
  return `${seconds}s`
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  dialogVisible.value = false
}
</script>

<style scoped>
.confirm-body {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.confirm-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 16px 0;
  padding: 10px 12px;
  background: rgba(255, 140, 0, 0.08);
  border: 1px solid rgba(255, 140, 0, 0.2);
  border-radius: 8px;
  font-size: 13px;
  color: var(--win11-text-secondary);
  line-height: 1.5;
}

.hint-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  color: #ff8c00;
}

.confirm-section {
  margin-bottom: 16px;
}

.confirm-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--win11-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.kv-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--win11-control-bg);
  border-radius: 8px;
  padding: 8px 12px;
}

.kv-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px;
  align-items: center;
  min-height: 26px;
}

.kv-row:not(:last-child) {
  border-bottom: 1px solid var(--win11-border);
  padding-bottom: 4px;
  margin-bottom: 0;
}

.kv-label {
  font-size: 12px;
  color: var(--win11-text-secondary);
}

.kv-value {
  font-size: 13px;
  color: var(--win11-text);
  font-weight: 500;
  text-align: right;
}

.kv-value.highlight {
  color: var(--win11-accent);
  font-weight: 600;
}

.kv-value.bool-yes {
  color: #107c10;
}

.kv-value.bool-no {
  color: var(--win11-text-secondary);
}

/* Sessions Table */
.sessions-table {
  background: var(--win11-control-bg);
  border-radius: 8px;
  overflow: hidden;
  font-size: 12px;
}

.sessions-header {
  display: grid;
  grid-template-columns: 32px 56px 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 8px 12px;
  background: var(--win11-control-hover-bg);
  font-weight: 600;
  color: var(--win11-text-secondary);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
}

.sessions-header span {
  text-align: center;
}

.sessions-row {
  display: grid;
  grid-template-columns: 32px 56px 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 7px 12px;
  align-items: center;
  border-top: 1px solid var(--win11-border);
  color: var(--win11-text);
}

.sessions-row span {
  text-align: center;
}

.session-index {
  font-weight: 600;
  color: var(--win11-text-secondary);
  font-size: 11px;
}

.session-type {
  font-weight: 700;
  color: var(--win11-accent);
  font-size: 12px;
}
</style>
