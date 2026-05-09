import { createRouter, createWebHistory } from 'vue-router'
import Entry from "@/views/EntryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'entry',
      component: Entry
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
    }
  ]
})

export default router
