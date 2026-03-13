<script setup>
const props = defineProps({
  to: String,
})
</script>

<template>
  <NuxtLink :to="props.to" class="link-button">
    <span class="link-text">
      <slot />
    </span>
  </NuxtLink>
</template>

<style scoped>
</style>
