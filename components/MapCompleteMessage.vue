<script setup lang="ts">
/**
 * A component that displays a message to the user when they have successfully colored the map.
 * Lets them know how many colors they used and provides a shortcut to reset the map.
 */

const props = defineProps<{
  colorsUsed: number
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()

function onResetClick() {
  emit('reset')
}
</script>

<template>
  <div class="absolute ml-2.5 success-message">
    <h2 style="margin-top: 0; font-size: 24px;">
      Congratulations! 🎉
    </h2>
    <p class="mb-2">
      You successfully colored the map!
    </p>
    <p>You used {{ props.colorsUsed }} colors.</p>
    <br>
    <div
      class="inline mr-1 small-reset-button"
      style="background-color: #FFFFFF; color: black; padding: 4px 8px 4px 13px; border-radius: 12px; border: 1px solid #000; cursor: pointer; font-size: 14px;"
      @click.prevent="onResetClick"
    >
      Reset
    </div>
    <i>the map to try coloring again!</i>
  </div>
</template>

<style scoped>
.success-message {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  z-index: 1000;
  text-align: center;
  max-width: 215px;
}
</style>
