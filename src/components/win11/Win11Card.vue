<template>
  <div class="win11-card">
    <h3 v-if="title" class="win11-card-title">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
