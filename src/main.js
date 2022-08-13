import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import OrderIndex from '@/views/orderIndex/orderIndex.vue'
import ChooseView from '@/views/choose/ChooseView.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', component: OrderIndex },
  { path: '/choose', component: ChooseView },
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
