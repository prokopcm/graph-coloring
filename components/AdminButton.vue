<script setup lang="ts">
/**
 * An invisible button that toggles the admin mode when tapped 5 times within a 5 second timeframe.
 */
import { onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  (event: 'toggleAdmin'): void
}>()

const ADMIN_CLICK_TIMEFRAME = 5000

const adminClickCount = ref(0)
const adminClickTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function resetClickState() {
  adminClickCount.value = 0

  if (adminClickTimer.value) {
    clearTimeout(adminClickTimer.value)
    adminClickTimer.value = null
  }
}

function onAdminButtonClick() {
  adminClickCount.value++

  if (adminClickCount.value === 1) {
    adminClickTimer.value = setTimeout(() => {
      resetClickState()
    }, ADMIN_CLICK_TIMEFRAME)
  }

  if (adminClickCount.value >= 5) {
    emit('toggleAdmin')
    resetClickState()
  }
}

onUnmounted(() => {
  if (adminClickTimer.value) {
    clearTimeout(adminClickTimer.value)
  }
})
</script>

<template>
  <div
    class="admin-button"
    @click="onAdminButtonClick"
  />
</template>
