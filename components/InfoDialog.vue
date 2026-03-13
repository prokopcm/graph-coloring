<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
  <div class="bg-white max-w-[600px] relative rounded-lg shadow-lg w-full z-10">
    <div class="p-6">
      <h2 class="font-bold mb-4 text-2xl text-left">
        How This Works
      </h2>
      <div class="mb-6 text-left">
        <p class="mb-4">
          This interactive app demonstrates a math theorem about how many colors are needed to color any map so that no states that touch each other share the same color.
        </p>
        <p class="mb-2">
          To color this map:
        </p>
        <ol class="list-disc mb-4 pl-6">
          <li class="mb-1">
            Tap on any state to select it
          </li>
          <li class="mb-1">
            Choose a color from the color picker
          </li>
        </ol>
        <p class="mb-1">
          Try to color the entire map using as few colors as possible without having any states next to each other that share the same color.
        </p>
        <p class="font-bold mt-2">
          Get creative and have fun! 🎨
        </p>
      </div>
      <div class="flex justify-end">
        <button
          class="link-button ml-4"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
