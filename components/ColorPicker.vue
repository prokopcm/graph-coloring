<script setup lang="ts">
import type { ColorInfo } from '~/data/colors'

const props = defineProps<{
  colors: readonly ColorInfo[]
}>()

const emit = defineEmits<{
  (event: 'colorSelected', hexColor: string): void
}>()

function onColorClick(hexColor: string) {
  emit('colorSelected', hexColor)
}
</script>

<template>
  <div class="color-picker-container">
    <div class="color-picker">
      <div
        v-for="color in props.colors"
        :key="color.hex"
        :style="{ backgroundColor: color.hex }"
        class="color"
        @click.prevent="onColorClick(color.hex)"
      />
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  gap: 14px;
  padding: 16px;
}

.color-picker-container {
  border: 1px solid #000;
  background-color: #FFF;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.color {
  border-radius: 4px;
  border: 1px solid #999;
  width: 35px;
  height: 35px;
  cursor: pointer;
}
</style>
