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
        <!-- eslint-disable-next-line no-irregular-whitespace -->
        <span>​</span>
      </section>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
picture {
    display: inline-block;
}

picture img {
    max-width: 600px;
    max-height: 600px;
}

.hero-wrapper {
    max-width: max(640px, 100%);
    position: relative;
}

.intro {
    font-style: italic;
}

.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font: var(--font_1);
    font-size: 72px;
    font-weight: 400;
    color: #FFF;
    text-align: center;
    letter-spacing: 0.1em;
    line-height: 1.2em;
    width: calc(100% - 100px);
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    cursor: default;
    user-select: none;
}

.hero-anim {
    width: 100%;
    height: 680px;
    object-fit: cover;
}
</style>
