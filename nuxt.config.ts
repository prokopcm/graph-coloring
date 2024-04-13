// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,
  app: {
    baseURL: '/projects/msu24',
    // buildAssetsDir: '/projects/msu24/_nuxt/',
  }
})
