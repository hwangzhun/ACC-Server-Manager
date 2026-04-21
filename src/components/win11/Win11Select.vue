<template>
  <div class="win11-select" ref="selectRef">
    <button
      type="button"
      class="win11-select-trigger"
      :class="{ 'error': error, 'is-open': isOpen }"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span :class="{ 'text-win11-text-secondary': !selectedOption }">
        {{ selectedOption?.label || placeholder || '请选择...' }}
      </span>
      <svg class="w-4 h-4 opacity-50" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="isOpen" class="win11-select-dropdown">
      <div v-if="filterable" class="win11-select-search">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('common.search')"
          class="win11-select-search-input"
          @input="handleSearch"
          ref="searchInputRef"
        />
      </div>
      <div class="win11-select-options">
        <template v-for="group in filteredGroups" :key="group.label">
          <div v-if="group.label" class="win11-select-group-label">{{ group.label }}</div>
          <div
            v-for="option in group.options"
            :key="option.value"
            class="win11-select-option"
            :class="{ 'selected': option.value === modelValue }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </div>
        </template>
        <div v-if="filteredOptions.length === 0" class="win11-select-empty">
          {{ t('common.noData') }}
        </div>
      </div>
    </div>

    <p v-if="error" class="win11-error">{{ error }}</p>
    <p v-else-if="hint" class="win11-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { t } from '../../i18n'

interface Option {
  value: string | number
  label: string
}

interface OptionGroup {
  label?: string
  options: Option[]
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options: Option[] | OptionGroup[]
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  filterable?: boolean
  clearable?: boolean
}>(), {
  modelValue: '',
  disabled: false,
  filterable: false,
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const isGrouped = computed(() => {
  return props.options.length > 0 && 'options' in props.options[0]
})

const groups = computed((): OptionGroup[] => {
  if (isGrouped.value) {
    return props.options as OptionGroup[]
  }
  return [{ options: props.options as Option[] }]
})

const flatOptions = computed(() => {
  return groups.value.flatMap(g => g.options)
})

const selectedOption = computed(() => {
  return flatOptions.value.find(opt => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return flatOptions.value
  const query = searchQuery.value.toLowerCase()
  return flatOptions.value.filter(opt => 
    opt.label.toLowerCase().includes(query)
  )
})

const filteredGroups = computed((): OptionGroup[] => {
  if (!searchQuery.value) return groups.value
  const query = searchQuery.value.toLowerCase()
  return groups.value
    .map(group => ({
      ...group,
      options: group.options.filter(opt => opt.label.toLowerCase().includes(query))
    }))
    .filter(group => group.options.length > 0)
})

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value && props.filterable) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  }
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

function handleSearch() {
  
}

function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
    searchQuery.value = ''
  }
})
</script>

<style scoped>
.win11-select {
  @apply relative w-full;
}

.win11-select-trigger {
  @apply w-full h-10 px-3 rounded-md;
  @apply bg-win11-control-bg text-win11-text text-sm;
  @apply border border-transparent;
  @apply flex items-center justify-between;
  @apply cursor-pointer transition-all duration-150;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.win11-select-trigger:hover {
  @apply bg-win11-control-hover-bg;
}

.win11-select-trigger:focus,
.win11-select-trigger.is-open {
  @apply border-win11-accent;
  box-shadow: 0 0 0 1px var(--win11-accent);
}

.win11-select-dropdown {
  @apply absolute z-50 mt-1 w-full rounded-lg overflow-hidden;
  @apply bg-win11-surface border border-win11-border;
  @apply shadow-xl;
}

.win11-select-search {
  @apply p-2 border-b border-win11-border;
}

.win11-select-search-input {
  @apply w-full h-8 px-3 rounded-md;
  @apply bg-win11-control-bg text-win11-text text-sm;
  @apply border border-transparent;
  @apply outline-none focus:border-win11-accent;
}

.win11-select-options {
  @apply max-h-60 overflow-y-auto;
}

.win11-select-group-label {
  @apply px-3 py-1.5 text-xs font-semibold text-win11-text-secondary;
  @apply bg-win11-control-bg;
}

.win11-select-option {
  @apply px-3 py-2 text-sm text-win11-text cursor-pointer;
  @apply transition-colors duration-100;
}

.win11-select-option:hover {
  @apply bg-win11-control-hover-bg;
}

.win11-select-option.selected {
  @apply bg-win11-control-bg text-win11-accent font-semibold;
}

.win11-select-empty {
  @apply px-3 py-4 text-sm text-win11-text-secondary text-center;
}

.win11-hint {
  @apply text-xs text-win11-text-secondary mt-1;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
