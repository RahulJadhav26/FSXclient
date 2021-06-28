import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AWS from 'aws-sdk'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  AWS,
  vuetify,
  render: h => h(App)
}).$mount('#app')
