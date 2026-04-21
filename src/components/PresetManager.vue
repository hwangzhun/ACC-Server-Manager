<template>
  <div>
    <Win11Button variant="primary" @click="dialogVisible = true">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      {{ t('preset.title') }}
    </Win11Button>

    <Win11Dialog
      v-model="dialogVisible"
      :title="t('preset.title')"
      width="820px"
      @open="loadPresets"
    >
      <div class="preset-manager">
        <div class="preset-list">
          <div class="preset-list-header">
            <Win11Input
              v-model="searchQuery"
              :placeholder="t('preset.searchPlaceholder')"
              prefix-icon="search"
              clearable
              size="small"
            />
          </div>
          <div class="preset-list-content">
            <div
              v-for="preset in filteredPresets"
              :key="preset.name"
              class="preset-item"
              :class="{
                active: selectedPreset?.name === preset.name,
                'in-use': activePresetName && preset.name === activePresetName
              }"
              @click="selectPreset(preset)"
            >
              <div class="preset-item-name-row">
                <span class="preset-item-name">{{ preset.name }}</span>
                <Win11Tag v-if="activePresetName === preset.name" size="small" type="success">
                  {{ t('preset.inUse') }}
                </Win11Tag>
              </div>
              <div class="preset-item-tags">
                <Win11Tag size="small" type="primary">
                  {{ trackLabel(preset.track) }}
                </Win11Tag>
                <Win11Tag size="small" type="success">
                  {{ carGroupLabel(preset.carGroup) }}
                </Win11Tag>
              </div>
              <div class="preset-item-date">
                {{ formatDate(preset.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <div class="preset-detail">
          <div v-if="selectedPreset" class="preset-info">
            <h4>{{ selectedPreset.name }}</h4>
            <div class="preset-info-highlight">
              <span class="preset-highlight-label">{{ t('form.track') }}</span>
              <Win11Tag type="primary">{{ trackLabel(selectedPreset.track) }}</Win11Tag>
              <span class="preset-highlight-label">{{ t('form.carGroup') }}</span>
              <Win11Tag type="success">{{ carGroupLabel(selectedPreset.carGroup) }}</Win11Tag>
            </div>
            <p v-if="selectedPreset.description" class="preset-description">
              {{ selectedPreset.description }}
            </p>
            <div class="preset-meta">
              <div>{{ t('preset.createdAt') }}: {{ formatDateTime(selectedPreset.createdAt) }}</div>
              <div>{{ t('preset.updatedAt') }}: {{ formatDateTime(selectedPreset.updatedAt) }}</div>
            </div>
          </div>
          <Win11Empty v-else :description="t('preset.emptySelect')" />

          <div class="preset-actions preset-actions-primary">
            <Win11Button variant="primary" size="large" @click="showSaveDialog">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('preset.saveCurrent') }}
            </Win11Button>
            <Win11Button
              variant="success"
              size="large"
              :disabled="!selectedPreset"
              @click="handleLoad"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {{ t('preset.loadSelected') }}
            </Win11Button>
          </div>
          <div class="preset-actions preset-actions-update">
            <Win11Button
              variant="warning"
              :disabled="!selectedPreset"
              @click="handleUpdatePreset"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('preset.updateSelected') }}
            </Win11Button>
            <span class="update-hint">{{ t('preset.updateHint') }}</span>
          </div>

          <div class="preset-actions preset-actions-secondary">
            <Win11Button :disabled="!selectedPreset" @click="showRenameDialog">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ t('preset.renameAction') }}
            </Win11Button>
            <Win11Button variant="danger" :disabled="!selectedPreset" @click="handleDelete">
              {{ t('common.delete') }}
            </Win11Button>
          </div>
        </div>
      </div>
    </Win11Dialog>

    <Win11Dialog v-model="saveDialogVisible" :title="t('preset.saveDialogTitle')" width="520px">
      <div class="save-context">
        <div class="save-context-title">{{ t('preset.saveContextTitle') }}</div>
        <div class="save-context-row">
          <span class="save-context-label">{{ t('form.track') }}</span>
          <Win11Tag type="primary">{{ currentTrackDisplay }}</Win11Tag>
        </div>
        <div class="save-context-row">
          <span class="save-context-label">{{ t('form.carGroup') }}</span>
          <Win11Tag type="success">{{ currentCarGroupDisplay }}</Win11Tag>
        </div>
      </div>
      <div class="save-form">
        <div class="win11-form-field">
          <label class="win11-form-label required">{{ t('preset.presetName') }}</label>
          <Win11Input v-model="saveForm.name" :placeholder="t('preset.placeholderName')" />
        </div>
        <div class="win11-form-field">
          <label class="win11-form-label">{{ t('preset.description') }}</label>
          <textarea
            v-model="saveForm.description"
            class="win11-textarea"
            :rows="3"
            :placeholder="t('preset.placeholderDescription')"
          ></textarea>
        </div>
      </div>
      <template #footer>
        <Win11Button variant="secondary" @click="saveDialogVisible = false">{{ t('common.cancel') }}</Win11Button>
        <Win11Button variant="primary" @click="handleSave">{{ t('common.save') }}</Win11Button>
      </template>
    </Win11Dialog>

    <Win11Dialog v-model="renameDialogVisible" :title="t('preset.renameDialogTitle')" width="500px">
      <div class="save-form">
        <div class="win11-form-field">
          <label class="win11-form-label required">{{ t('preset.newName') }}</label>
          <Win11Input v-model="renameForm.name" :placeholder="t('preset.placeholderNewName')" />
        </div>
        <div class="win11-form-field">
          <label class="win11-form-label">{{ t('preset.description') }}</label>
          <textarea
            v-model="renameForm.description"
            class="win11-textarea"
            :rows="3"
            :placeholder="t('preset.placeholderDescriptionEdit')"
          ></textarea>
        </div>
      </div>
      <template #footer>
        <Win11Button variant="secondary" @click="renameDialogVisible = false">{{ t('common.cancel') }}</Win11Button>
        <Win11Button variant="primary" @click="handleRename">{{ t('common.confirm') }}</Win11Button>
      </template>
    </Win11Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, withDefaults } from 'vue'
import type { AllConfigs } from '../types/configuration'
import { formatTrackName } from '../types/defaults'
import { getCurrentLanguage, t, currentLanguage } from '../i18n'
import {
  getPresets,
  savePreset,
  loadPreset,
  updatePreset,
  renamePreset,
  deletePreset,
  type Preset
} from '../utils/presetManager'
import {
  Win11Button,
  Win11Dialog,
  Win11Input,
  Win11Tag,
  Win11Empty,
  notify
} from './win11'

const props = withDefaults(
  defineProps<{
    configs: AllConfigs
    activePresetName?: string | null
  }>(),
  { activePresetName: null }
)

const emit = defineEmits<{
  load: [payload: { configs: AllConfigs; presetName: string }]
  activePresetChange: [name: string | null]
}>()

function trackLabel(track?: string): string {
  const id = (track || '').trim()
  if (!id) return t('preset.unset')
  return formatTrackName(id, getCurrentLanguage())
}

function trackSearchBlob(track?: string): string {
  const id = (track || '').trim()
  if (!id) return ''
  return `${id} ${formatTrackName(id, 'zh')} ${formatTrackName(id, 'en')}`.toLowerCase()
}

function carGroupLabel(group?: string): string {
  const g = (group || '').trim()
  return g || t('preset.unset')
}

const dialogVisible = ref(false)
const saveDialogVisible = ref(false)
const renameDialogVisible = ref(false)

const presets = ref<Preset[]>([])
const selectedPreset = ref<Preset | null>(null)
const searchQuery = ref('')

const saveForm = ref({
  name: '',
  description: ''
})

const renameForm = ref({
  name: '',
  description: ''
})

const currentTrackDisplay = computed(() => {
  void currentLanguage.value
  const track = (props.configs?.event?.track || '').trim()
  return track ? formatTrackName(track, getCurrentLanguage()) : t('preset.unset')
})

const currentCarGroupDisplay = computed(() => {
  void currentLanguage.value
  const g = (props.configs?.settings?.carGroup || '').trim()
  return g || t('preset.unset')
})

const filteredPresets = computed(() => {
  void currentLanguage.value
  const list = presets.value
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(p => {
    const group = carGroupLabel(p.carGroup).toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      trackSearchBlob(p.track).includes(q) ||
      group.includes(q)
    )
  })
})

function dateLocale(): string {
  return getCurrentLanguage() === 'zh' ? 'zh-CN' : 'en-US'
}

function formatDate(dateStr: string): string {
  void currentLanguage.value
  const date = new Date(dateStr)
  return date.toLocaleDateString(dateLocale())
}

function formatDateTime(dateStr: string): string {
  void currentLanguage.value
  const date = new Date(dateStr)
  return date.toLocaleString(dateLocale())
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error.trim()) {
    return error
  }
  if (typeof error === 'object' && error !== null) {
    const maybeMessage = (error as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage
    }
  }
  return t('common.error')
}

async function loadPresets() {
  try {
    presets.value = await getPresets()
  } catch (error) {
    notify.error(`${t('preset.errLoadList')}: ${getErrorMessage(error)}`)
  }
}

function selectPreset(preset: Preset) {
  selectedPreset.value = preset
}

function showSaveDialog() {
  saveForm.value.name = ''
  saveForm.value.description = ''
  saveDialogVisible.value = true
}

async function handleSave() {
  if (!saveForm.value.name.trim()) {
    notify.warning(t('preset.warnNameRequired'))
    return
  }

  try {
    await savePreset(saveForm.value.name.trim(), saveForm.value.description, props.configs)
    notify.success(t('preset.successSaved'))
    saveDialogVisible.value = false
    await loadPresets()
  } catch (error) {
    notify.error(`${t('preset.errSave')}: ${getErrorMessage(error)}`)
  }
}

async function handleLoad() {
  if (!selectedPreset.value) return

  try {
    const data = await loadPreset(selectedPreset.value.name)
    const presetName = selectedPreset.value.name
    emit('load', { configs: data.configs, presetName })
    notify.success(t('preset.successLoaded'))
    dialogVisible.value = false
  } catch (error) {
    notify.error(`${t('preset.errLoad')}: ${getErrorMessage(error)}`)
  }
}

function showRenameDialog() {
  if (!selectedPreset.value) return

  renameForm.value.name = selectedPreset.value.name
  renameForm.value.description = selectedPreset.value.description || ''
  renameDialogVisible.value = true
}

async function handleRename() {
  if (!renameForm.value.name.trim()) {
    notify.warning(t('preset.warnNewNameRequired'))
    return
  }

  const oldName = selectedPreset.value!.name
  const newName = renameForm.value.name.trim()

  try {
    await renamePreset(oldName, newName, renameForm.value.description)
    notify.success(t('preset.successRenamed'))
    renameDialogVisible.value = false
    if (props.activePresetName === oldName) {
      emit('activePresetChange', newName)
    }
    selectedPreset.value = null
    await loadPresets()
  } catch (error) {
    notify.error(`${t('preset.errRename')}: ${getErrorMessage(error)}`)
  }
}

async function handleUpdatePreset() {
  if (!selectedPreset.value) return

  const name = selectedPreset.value.name

  const confirmed = await notify.confirm({
    title: t('preset.updateDialogTitle'),
    message: t('preset.confirmUpdate').replace('{name}', name),
    confirmText: t('common.update'),
    cancelText: t('common.cancel'),
    type: 'warning'
  })

  if (!confirmed) return

  try {
    await updatePreset(name, props.configs)
    notify.success(t('preset.successUpdated'))
    await loadPresets()
    const found = presets.value.find(p => p.name === name)
    selectedPreset.value = found ?? null
  } catch (error) {
    notify.error(`${t('preset.errUpdate')}: ${getErrorMessage(error)}`)
  }
}

async function handleDelete() {
  if (!selectedPreset.value) return

  const name = selectedPreset.value.name

  const confirmed = await notify.confirm({
    title: t('preset.deleteDialogTitle'),
    message: t('preset.confirmDelete').replace('{name}', name),
    confirmText: t('common.delete'),
    cancelText: t('common.cancel'),
    type: 'warning'
  })

  if (!confirmed) return

  try {
    await deletePreset(name)
    notify.success(t('preset.successDeleted'))
    if (props.activePresetName === name) {
      emit('activePresetChange', null)
    }
    selectedPreset.value = null
    await loadPresets()
  } catch (error) {
    notify.error(`${t('preset.errDelete')}: ${getErrorMessage(error)}`)
  }
}

onMounted(() => {
  loadPresets()
})
</script>

<style scoped>
.preset-manager {
  display: flex;
  height: 500px;
  gap: 20px;
}

.preset-list {
  width: 300px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--win11-border);
  padding-right: 15px;
}

.preset-list-header {
  padding-bottom: 15px;
  border-bottom: 1px solid var(--win11-border);
  margin-bottom: 10px;
}

.preset-list-content {
  flex: 1;
  overflow-y: auto;
}

.preset-item {
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  margin-bottom: 4px;
  border: 1px solid transparent;
}

.preset-item:hover {
  background: var(--win11-control-hover-bg);
}

.preset-item.active {
  background: var(--win11-control-bg);
  border-color: var(--win11-accent);
}

.preset-item.in-use:not(.active) {
  border-left: 3px solid #67c23a;
}

.preset-item-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.preset-item-name {
  font-weight: 500;
  color: var(--win11-text);
}

.preset-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.preset-item-date {
  font-size: 12px;
  color: var(--win11-text-secondary);
}

.preset-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  min-width: 0;
}

.preset-info {
  flex: 1;
  padding: 15px;
  background: var(--win11-control-bg);
  border-radius: 8px;
  margin-bottom: 16px;
}

.preset-info h4 {
  margin: 0 0 12px 0;
  color: var(--win11-text);
  font-size: 18px;
}

.preset-info-highlight {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 12px;
}

.preset-highlight-label {
  font-size: 12px;
  color: var(--win11-text-secondary);
}

.preset-description {
  color: var(--win11-text-secondary);
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.preset-meta {
  font-size: 12px;
  color: var(--win11-text-secondary);
  line-height: 1.8;
}

.preset-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preset-actions-primary {
  margin-bottom: 12px;
}

.preset-actions-primary :deep(.win11-button) {
  flex: 1;
  min-width: 140px;
}

.preset-actions-update {
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.update-hint {
  font-size: 12px;
  color: var(--win11-text-secondary);
  line-height: 1.4;
  flex: 1;
  min-width: 160px;
}

.preset-actions-secondary {
  padding-top: 4px;
  border-top: 1px solid var(--win11-border);
}

.save-context {
  padding: 12px 14px;
  margin-bottom: 16px;
  background: var(--win11-control-bg);
  border-radius: 8px;
  border: 1px solid var(--win11-border);
}

.save-context-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--win11-text);
  margin-bottom: 10px;
}

.save-context-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.save-context-row:last-child {
  margin-bottom: 0;
}

.save-context-label {
  width: 72px;
  font-size: 13px;
  color: var(--win11-text-secondary);
  flex-shrink: 0;
}

.save-form {
  margin-top: 4px;
}

.win11-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.win11-form-field:last-child {
  margin-bottom: 0;
}

.win11-form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--win11-text);
}

.win11-form-label.required::after {
  content: ' *';
  color: #d13438;
}

.win11-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--win11-text);
  background: var(--win11-control-bg);
  border: 1px solid var(--win11-border);
  border-radius: 6px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

.win11-textarea:focus {
  border-color: var(--win11-accent);
}

.win11-textarea::placeholder {
  color: var(--win11-text-secondary);
}
</style>
