import { defineNuxtConfig } from 'nuxt/config'
import { BASE_URL } from './config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
  ],
  ssr: true,
  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    baseURL: BASE_URL,
  },

  compatibilityDate: '2025-03-07',
})
