<script setup lang="ts">
/**
 * A component that displays buttons for the user to control the map coloring.
 * Allows them to auto-color the map, reset the map, and open the info dialog.
 */

const emit = defineEmits<{
  (event: 'autoColor'): void
  (event: 'reset'): void
  (event: 'openInstructions'): void
}>()
</script>

<template>
  <div class="button-wrapper mb-4">
    <button
      class="link-button mr-4"
      @click.prevent="emit('autoColor')"
    >
      Auto-Color
    </button>
    <button
      class="link-button"
      @click.prevent="emit('reset')"
    >
      Reset
    </button>
    <button
      class="link-button ml-4"
      @click.prevent="emit('openInstructions')"
    >
      <span class="inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 mr-1 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Instructions
      </span>
    </button>
  </div>
</template>
