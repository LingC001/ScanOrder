import Vue from 'vue'
import VueRouter from 'vue-router'
import OrderIndex from '@/views/orderIndex/OrderIndex.vue'
import ChooseView from '@/views/choose/ChooseView.vue'
import ShopDetail from '@/views/shopDetail/ShopDetail.vue'
import SubmitOrder from '@/views/submitOrder/SubmitOrder.vue'
import OrderList from '@/views/orderList/OrderList.vue'
import ListDetail from '@/views/listDetail/ListDetail.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: OrderIndex },
  { path: '/choose', component: ChooseView },
  { path: '/shopDetail', component: ShopDetail },
  { path: '/submitOrder', component: SubmitOrder },
  { path: '/orderList', component: OrderList },
  { path: '/listDetail', component: ListDetail },
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router