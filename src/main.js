import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import OrderIndex from '@/views/orderIndex/orderIndex.vue'
import ChooseView from '@/views/choose/ChooseView.vue'
import ShopDetail from '@/views/shopDetail/ShopDetail.vue'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant)

Vue.use(VueRouter)

const routes = [
  { path: '/', component: OrderIndex },
  { path: '/choose', component: ChooseView },
  { path: '/shopDetail', component: ShopDetail},
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
