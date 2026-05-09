<script setup lang="ts">
import { useFilters } from '@/utils/filters'
import { onMounted, ref } from 'vue'
import { getOrderList } from '@/api/orders'
import { useRouter } from 'vue-router'
const { orderStatus, orderTime } = useFilters()
const router = useRouter()

let orderList = ref([])
onMounted(() => {
  getOrderList()
    .then((res) => {
      // console.log("res", res);
      orderList.value = res.data.reverse()
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.log('err', err)
    })
})

function back() {
  router.push('/choose')
}

function payed() {
  //订单详情
}
</script>

<template>
  <div class="orderList">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>订单列表</span>
    </div>
    <div v-for="(item, index) in orderList" :key="index" class="body" @click="payed(item._id)">
      <div class="name">
        <span>小民大排档（软件园店）</span>
        <span class="finish">{{ orderStatus(item.finished) }}</span>
      </div>
      <div class="num">
        <span class="dish">菜品数量：共{{ item.allFoodsNumber }}件菜品</span>
        <span>￥{{ item.totalFoodsPrice }}</span>
      </div>
      <div class="time">下单时间：{{ orderTime(item.createdAt) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orderList {
  background-color: #f4f1f4;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    height: 50px;
    .iconfont {
      font-size: 23px;
      position: absolute;
      left: 10px;
    }
  }
  .body {
    margin: 10px;
    padding: 10px;
    background-color: #fff;
    .name {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      .finish {
        font-size: 12px;
      }
    }
    .num {
      display: flex;
      justify-content: space-between;
      .dish {
        color: #a4a4a4;
        font-size: 15px;
      }
    }
    .time {
      color: #a4a4a4;
      margin-top: 10px;
      font-size: 15px;
    }
  }
}
</style>
