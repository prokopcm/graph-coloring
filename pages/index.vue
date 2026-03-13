<script setup lang="ts">
const isiOS = window && /iPad|iPhone|iPod/.test(window.navigator.userAgent)
</script>

<template>
  <div>
    <AppMenu
      v-if="!isiOS"
      selected="home"
    />
    <div class="content">
      <section class="darker-bg introduction section-pb">
        <div class="intro">
          Click/tap on a state to color it! States that touch must be different colors.
        </div>
        <InteractiveUSMap />
        <div class="button-wrapper" />
      </section>
      <section class="spacer">
        <span>&nbsp;</span>
      </section>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.intro {
  font-style: italic;
}
</style>
