import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
  ],
  ssr: true,
  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    baseURL: '/projects/coloringmaps',
  },

  compatibilityDate: '2025-03-07',
})
