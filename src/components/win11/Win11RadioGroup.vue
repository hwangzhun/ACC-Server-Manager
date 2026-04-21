<template>
  <div class="win11-radio-group" :class="{ 'win11-radio-group--button': buttonStyle }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string | number | boolean
  buttonStyle?: boolean
}>(), {
  buttonStyle: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'change': [value: string | number | boolean]
}>()

function select(value: string | number | boolean) {
  emit('update:modelValue', value)
  emit('change', value)
}

defineExpose({ select })
</script>

<style scoped>
.win11-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.win11-radio-group--button {
  gap: 0;
}
</style>
