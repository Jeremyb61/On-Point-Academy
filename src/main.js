import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './routes'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(VueRouter);

axios.defaults.withCredentials = true  // enable axios post cookie, default false

const router = new VueRouter({
    routes: Routes
})

new Vue({
  render: h => h(App),
  router:router,
}).$mount('#app')
