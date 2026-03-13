<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
  <div class="bg-white max-w-[600px] relative rounded-lg shadow-lg w-full z-10">
    <div class="p-6">
      <h2 class="font-bold mb-4 text-2xl text-left">
        Are you still there?
      </h2>
      <div class="mb-6 text-left">
        <p class="mb-4">
          The map will reset automatically in a minute unless you let me know you're there.
        </p>
      </div>
      <div class="flex justify-end">
        <button
          class="link-button ml-4"
          @click="$emit('close')"
        >
          I'm still here!
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
