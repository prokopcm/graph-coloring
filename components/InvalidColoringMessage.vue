<script setup lang="ts">
/**
 * A message that displays when two neighboring nodes are the same color and
 * prompts the user to fix it. Emits an event when tapped.
 */

defineProps<{
  nodeId1: string
  nodeId2: string
  hexColor: string
}>()

const emit = defineEmits<{
  (e: 'fix'): void
}>()

function onClick() {
  emit('fix')
}
</script>

<template>
  <div
    class="invalid-coloring toast-alert"
    @click="onClick"
  >
    {{ nodeId1 }} and {{ nodeId2 }} are both {{ hexColor }}.
    <br>
    Tap on me to fix!
  </div>
</template>

<style scoped>
.invalid-coloring {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #ff6b6b;
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 89;
  max-width: 400px;
  cursor: pointer;
}
</style>
