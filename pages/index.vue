<script setup lang="ts">
import InteractiveMapColorer from '~/components/InteractiveMapColorer.vue'
import { mapData } from '~/data/usMapData'

const isiOS = window && /iPad|iPhone|iPod/.test(window.navigator.userAgent)
</script>

<template>
  <div>
    <Header
      v-if="!isiOS"
      selected="home"
    />
    <div class="content">
      <section class="darker-bg introduction section-pb">
        <div class="intro">
          Click/tap on a state to color it! States that touch must be different colors.
        </div>
        <InteractiveMapColorer
          :map-data="mapData"
        />
        <div class="button-wrapper" />
      </section>
      <section class="spacer">
        <span>&nbsp;</span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.intro {
  font-style: italic;
}
</style>
