<script setup lang="ts">
const props = defineProps({ selected: String })

function getLinkStyle (link: string) {
  return link === props.selected ? 'text-link' : 'unselected'
}
</script>

<template>
  <div class="flex justify-between site-header" tabindex="-1">
    <p class="font_0 header-hero">
      <NuxtLink to="/">
        <span class="color_15 md:m-4 sm:m-4">
          Coloring, Creative Math, and Computers
        </span>
      </NuxtLink>
    </p>
    <nav class="" aria-label="Site">
      <ul class="order-last">
        <li class="pr-4">
          <NuxtLink :class="getLinkStyle('home')" to="/">
            <span class="p-1 text-right">
              Home
            </span>
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink :class="getLinkStyle('about')" to="/about">
            <span class="p-1 text-right">
              About
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.site-header {
    height: 60px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
    align-items: center;
}

.header-hero {
    line-height: 1.41em;
    font-size: 22px;
    font-weight: 400;
}

ul {
    list-style: none;
    text-align: right;
}

li {
    display: inline-block;
    height: 30px;
    position: relative;
    box-sizing: border-box;
    overflow: visible;
    visibility: inherit;
}

li span {
    font-size: 18px;
    font-weight: 400;
}

.menu-links {
    color: rgb(var(--txts, var(--color_14)));
}

.insta-link {
    position: relative;
    top: 13px;
}

.instagram {
    width: 20px;
    height: 20px;
    object-fit: cover;
}

.selected {
    text-decoration: underline 0.3rem;
}

.unselected:hover {
    color: #333;
}
</style>
