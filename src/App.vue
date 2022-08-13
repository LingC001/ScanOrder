<template>
  <div id="app">
    <order-index />
  </div>
</template>

<script>
import OrderIndex from "@/views/orderIndex/orderIndex.vue";
export default {
  name: "App",
  components: {
    OrderIndex,
  },
};
</script>

<style lang='scss'>
@import url("@/style/base.css");
#app {
  height: 100vh;
}
</style>
