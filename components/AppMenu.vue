<script setup lang="ts">
/**
 * A header component that displays the project's title and navigation links.
 */

const props = defineProps<{ selected: string }>()

/**
 * Get the selection style CSS class for a link
 * @param link the link name to get the selection style CSS class for
 * @returns the CSS class for the link
 */
function getLinkSelectionStyle(link: string) {
  return link === props.selected ? 'text-link' : 'unselected'
}
</script>

<template>
  <div class="flex justify-between site-header" tabindex="-1">
    <p class="header-hero">
      <NuxtLink to="/">
        <span class="color_1 md:m-4 sm:m-4">
          Coloring, Creative Math, and Computers
        </span>
      </NuxtLink>
    </p>
    <nav class="" aria-label="Site">
      <ul class="order-last">
        <li class="pr-4">
          <NuxtLink :class="getLinkSelectionStyle('home')" to="/">
            <span class="p-1 text-right">
              Home
            </span>
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink :class="getLinkSelectionStyle('about')" to="/about">
            <span class="p-1 text-right">
              About
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.header-hero {
  font: var(--font_0);
}

li {
  display: inline-block;
  height: 30px;
  position: relative;
  box-sizing: border-box;
  overflow: visible;
  visibility: inherit;

  span {
    font-size: 18px;
    font-weight: 400;
  }
}

.selected {
  text-decoration: underline 0.3rem;
}

.site-header {
  height: 60px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  align-items: center;
}

ul {
  list-style: none;
  text-align: right;
}

.unselected {
  &:hover {
    color: #333;
  }
}
</style>
