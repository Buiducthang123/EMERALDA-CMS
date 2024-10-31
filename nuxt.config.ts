// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/icon',
    "nuxt-lodash",
    'dayjs-nuxt'
  ],
  plugins: [
    '~/plugins/vue-chartjs.js'
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['ant-design-vue/es'],
    },
  },
  // Các cấu hình khác...
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },

  compatibilityDate: '2024-09-10'
});