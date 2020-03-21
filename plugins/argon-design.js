import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueClazyload from 'vue-clazy-load'
import VueLazyload from 'vue-lazyload'
import clickOutside from '@/directives/click-outside.js';
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/scss/main.scss';

Vue.directive("click-outside", clickOutside)
Vue.use(VueClazyload)
Vue.use(VueLazyload)
Vue.use(BootstrapVue)