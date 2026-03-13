<script setup>
/**
 * A button component that lets the user navigate to a different page when tapped.
 */
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
