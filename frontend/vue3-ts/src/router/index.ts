import { createRouter, createWebHistory } from 'vue-router'
import EntryView from '@/views/EntryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'entry',
      component: EntryView
    },
    {
      path: '/choose',
      name: 'choose',
      component: () => import('@/views/ChooseView.vue')
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: () => import('@/views/OrderList.vue')
    },
    {
      path: '/submitOrder',
      name: 'submitOrder',
      component: () => import('@/views/SubmitOrder.vue')
    },
    {
      path: '/upload',
      component: () => import('@/views/UploadView.vue')
    }
  ]
})

export default router
