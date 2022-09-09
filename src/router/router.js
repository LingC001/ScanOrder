import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: () => import("@/views/orderIndex/OrderIndex.vue") },
  { path: "/choose", component: () => import("@/views/choose/ChooseView.vue") },
  {
    path: "/shopDetail",
    component: () => import("@/views/shopDetail/ShopDetail.vue"),
  },
  {
    path: "/submitOrder",
    component: () => import("@/views/submitOrder/SubmitOrder.vue"),
  },
  {
    path: "/orderList",
    component: () => import("@/views/orderList/OrderList.vue"),
  },
  {
    path: "/listDetail",
    component: () => import("@/views/listDetail/ListDetail.vue"),
  },
  {
    path: "/upload",
    component: () => import("@/views/upload"),
  },
];

const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
});

export default router;
