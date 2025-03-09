// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,

  app: {
    baseURL: '/projects/coloringmaps',
  },

  compatibilityDate: '2025-03-07'
})