<template>
  <div class="bop-container">
    <Win11Card>
      <template #title>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-win11-accent/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-win11-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-win11-text m-0">{{ t('nav.bop') }}</h3>
            <p class="text-xs text-win11-text-secondary m-0">Balance of Performance</p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <div class="win11-toolbar">
          <div class="win11-toolbar-left">
            <Win11Input
              v-model="searchKeyword"
              :placeholder="t('placeholder.search')"
            />
            <span class="text-sm text-win11-text-secondary">
              {{ filteredEntries.length }} {{ t('common.items') }}
            </span>
          </div>

          <div class="win11-toolbar-right">
            <Win11Button
              v-if="selectedRows.length > 0"
              variant="danger"
              @click="handleBatchDelete"
            >
              {{ t('common.batchDelete') }} ({{ selectedRows.length }})
            </Win11Button>
            <Win11Button variant="secondary" @click="showImportDialog = true">
              从LFM导入
            </Win11Button>
            <Win11Button variant="primary" @click="handleAddEntry">
              添加BOP
            </Win11Button>
          </div>
        </div>

        <div class="bop-content">
          <div class="data-table-section">
            <BopDataTable
              ref="tableRef"
              :entries="filteredEntries"
              :selectedCount="selectedRows.length"
              v-model:searchKeyword="searchKeyword"
              @edit="handleEdit"
              @delete="handleDelete"
              @selectionChange="handleSelectionChange"
            />
          </div>
        </div>
      </div>
    </Win11Card>

    <BopImportDialog
      v-model="showImportDialog"
      @import-entries="handleImportEntries"
    />

    <Win11Dialog
      v-model="editingDialogVisible"
      :title="t('title.editBop')"
      width="760px"
      @close="handleCancelEdit"
    >
      <div class="edit-dialog-body">
        <BopEditPanel
          v-if="editingEntry"
          :entry="editingEntry"
          @save="handleSave"
          @cancel="handleCancelEdit"
        />
      </div>
    </Win11Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Bop, BopEntry } from '../../types/configuration'
import BopDataTable from './BopDataTable.vue'
import BopEditPanel from './BopEditPanel.vue'
import BopImportDialog from './BopImportDialog.vue'
import { t } from '../../i18n'
import { Win11Card, Win11Input, Win11Button, Win11Dialog } from '../win11'

const props = defineProps<{
  bop: Bop
}>()

const emit = defineEmits<{
  (e: 'update:bop', value: Bop): void
}>()

const bopRef = ref<Bop>(props.bop)

watch(() => props.bop, (newVal) => {
  bopRef.value = newVal
}, { deep: true })

watch(bopRef, (newVal) => {
  emit('update:bop', newVal)
}, { deep: true })

const entries = computed({
  get: () => bopRef.value.entries,
  set: (val) => { bopRef.value.entries = val }
})

const searchKeyword = ref('')
const selectedRows = ref<BopEntry[]>([])
const editingEntry = ref<BopEntry | null>(null)
const showImportDialog = ref(false)
const tableRef = ref<InstanceType<typeof BopDataTable> | null>(null)
const editingDialogVisible = computed({
  get: () => editingEntry.value !== null,
  set: (visible: boolean) => {
    if (!visible) editingEntry.value = null
  }
})

const filteredEntries = computed(() => {
  if (!searchKeyword.value) return entries.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return entries.value.filter(e => 
    e.track.toLowerCase().includes(keyword) ||
    e.carModel.toString().includes(keyword)
  )
})

function handleSelectionChange(rows: BopEntry[]) {
  selectedRows.value = rows
}

function handleEdit(entry: BopEntry) {
  editingEntry.value = { ...entry }
}

function isSameEntry(a: BopEntry, b: BopEntry) {
  return a.track === b.track && a.carModel === b.carModel
}

function handleDelete(entry: BopEntry) {
  const index = entries.value.findIndex((it) => isSameEntry(it, entry))
  if (index > -1) entries.value.splice(index, 1)
}

function handleBatchDelete() {
  selectedRows.value.forEach(row => {
    const index = entries.value.findIndex((it) => isSameEntry(it, row))
    if (index > -1) {
      entries.value.splice(index, 1)
    }
  })
  selectedRows.value = []
}

function handleAddEntry() {
  editingEntry.value = {
    track: 'monza',
    carModel: 0,
    ballastKg: 0,
    restrictor: 100
  }
}

function handleSave(entry: BopEntry) {
  const existingIndex = entries.value.findIndex(e => e.track === entry.track && e.carModel === entry.carModel)
  if (existingIndex > -1) {
    entries.value[existingIndex] = entry
  } else {
    entries.value.push(entry)
  }
  editingEntry.value = null
}

function handleCancelEdit() {
  editingEntry.value = null
}

function handleImportEntries(importedEntries: BopEntry[]) {
  importedEntries.forEach(imported => {
    const existingIndex = entries.value.findIndex(e => isSameEntry(e, imported))
    if (existingIndex > -1) {
      entries.value[existingIndex] = imported
    } else {
      entries.value.push(imported)
    }
  })
}
</script>

<style scoped>
.bop-container {
  @apply space-y-6;
}

.win11-toolbar {
  @apply flex items-center justify-between;
  @apply bg-win11-surface rounded-lg p-4;
}

.win11-toolbar-left {
  @apply flex items-center gap-3;
}

.win11-toolbar-right {
  @apply flex items-center gap-3;
}

.bop-content {
  @apply w-full;
}

.data-table-section {
  @apply bg-win11-surface rounded-lg p-4;
}

.edit-dialog-body {
  height: min(72vh, 720px);
}
</style>
