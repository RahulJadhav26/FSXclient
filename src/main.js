import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AWS from 'aws-sdk'
import vuetify from './plugins/vuetify'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueClipboards from 'vue-clipboards'

Vue.use(VueClipboards)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  AWS,
  vuetify,
  render: h => h(App)
}).$mount('#app')
