<template>
  <div class="win11-titlebar">
    <div class="win11-titlebar-left" data-tauri-drag-region>
      <img :src="logoImg" alt="Logo" class="win11-titlebar-logo" />
      <span class="win11-titlebar-title">ACC Pitwall</span>
    </div>

    <div class="win11-titlebar-center" data-tauri-drag-region>
    </div>

    <div class="win11-titlebar-right">
      <button
        class="win11-titlebar-btn"
        @click="minimize"
        title="最小化"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>

      <button
        class="win11-titlebar-btn"
        @click="toggleMaximize"
        :title="isMaximized ? '还原' : '全屏'"
      >
        <svg v-if="isMaximized" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v2m0 8v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

      <button
        class="win11-titlebar-btn close"
        @click="close"
        title="关闭"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logoImg from '../assets/logo.png'

const isMaximized = ref(false)
const isTauri = ref(false)

async function getAppWindow() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  return getCurrentWindow()
}

async function minimize() {
  try {
    const appWindow = await getAppWindow()
    await appWindow.minimize()
  } catch (err) {
    console.error('Failed to minimize in Tauri:', err)
  }
}

async function toggleMaximize() {
  try {
    const appWindow = await getAppWindow()
    const maximized = await appWindow.isMaximized()
    if (maximized) {
      await appWindow.unmaximize()
    } else {
      await appWindow.maximize()
    }
    isMaximized.value = !maximized
  } catch (err) {
    console.error('Failed to toggle maximize in Tauri:', err)
    // Browser fallback (dev preview without Tauri container)
    if (isMaximized.value) {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
    }
    isMaximized.value = !isMaximized.value
  }
}

async function close() {
  try {
    const appWindow = await getAppWindow()
    await appWindow.close()
  } catch (err) {
    console.error('Failed to close in Tauri:', err)
    window.close?.()
  }
}

onMounted(async () => {
  try {
    const appWindow = await getAppWindow()
    isTauri.value = true
    isMaximized.value = await appWindow.isMaximized()
    appWindow.onResized(async () => {
      isMaximized.value = await appWindow.isMaximized()
    })
  } catch {
    isTauri.value = false
    isMaximized.value = !!(document.fullscreenElement)
    document.addEventListener('fullscreenchange', () => {
      isMaximized.value = !!document.fullscreenElement
    })
  }
})
</script>

<style scoped>
.win11-titlebar {
  @apply flex items-center justify-between h-12 px-4;
  @apply bg-win11-surface/80 backdrop-blur-xl;
  @apply border-b border-win11-border;
  user-select: none;
  -webkit-app-region: drag;
}

.win11-titlebar-left {
  @apply flex items-center gap-3;
  -webkit-app-region: drag;
}

.win11-titlebar-logo {
  @apply w-6 h-6 object-contain;
  -webkit-app-region: drag;
}

.win11-titlebar-title {
  @apply text-sm font-semibold text-win11-text;
  -webkit-app-region: drag;
}

.win11-titlebar-center {
  @apply flex-1;
  -webkit-app-region: drag;
}

.win11-titlebar-right {
  @apply flex items-center gap-1;
  -webkit-app-region: no-drag;
}

.win11-titlebar-btn {
  @apply w-10 h-8 flex items-center justify-center rounded-md;
  @apply text-win11-icon hover:text-win11-text;
  @apply transition-all duration-200;
  -webkit-app-region: no-drag;
}

.win11-titlebar-btn:hover {
  @apply bg-win11-surface-hover;
}

.win11-titlebar-btn.close:hover {
  @apply bg-red-500 text-white;
}

.win11-titlebar-btn:active {
  @apply scale-95;
}
</style>
