<template>
  <div id="app">
    <order-index />
  </div>
</template>

<script>
import orderIndex from '@/views/orderIndex/orderIndex'

export default {
  name: 'App',
  components: {
    orderIndex
  }
}
</script>

<style lang='scss'>
@import url('@/style/base.css');
#app{
  height: 100vh;
}
</style>
