const path = require('path')
const webpack = require('webpack')
const pkg = require('./package')
const result = require('dotenv').config({ path: path.join(__dirname, '.env') })
module.exports = {
  mode: 'universal',
  dev: (process.env.NODE_ENV != 'production'),
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: "Curiosum Tech Portal",  
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: pkg.description
    },
    {
      name: 'theme-color',
      content: '#FF3C00'
    },
    {
      name: 'msapplication-navbutton-color',
      content: '#FF3C00'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: '#FF3C00'
    },
    // More Meta pls
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [

  ],
  env: {...result},
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/register-components', '@/plugins/argon-design', { src: '@/plugins/webFontLoader.js', ssr: false }],
  router: {
    // extendRoutes(routes, resolve) {
    // },
    middleware: ['ssr-cookie']
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    ['@nuxtjs/dotenv', { path: './.env' }]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'http://localhost:3000',
    browserBaseURL: '/',
    defaults: {
      headers: {
        post: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    watch: ['.env'],
    vendor: ['bootstrap-vue', 'vue-flatpickr-component', 'vue2-transition', 'vue-lazyload',],
    plugins: [
    ],
    uglify: {
      uglifyOptions: {
        compress: false
      },
      cache: '/etc/tmp/cache'
    },
  }
}
