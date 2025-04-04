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

<style>
.link-button {
    display: inline-block;
    border: 1px solid #000;
    background: #FFF;
    color: #000;
    border-radius: 100px;
    transition: color 0.1s ease, background 0.1s ease;
    padding: 12px 24px;
}

.link-button:hover {
    background: #333;
    color: #FFF;
    transition: color .4s ease, background .7s ease;
}
</style>
