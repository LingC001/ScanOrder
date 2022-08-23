<template>
  <div class="orderList">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>提交订单</span>
    </div>
    <div class="body" @click="payed">
      <div class="name">
        <span>小民大排档（软件园店）</span>
        <span class="finish">订单已完成</span>
      </div>
      <div class="num">
        <span class="dish">菜品数量：共两件菜品</span>
        <span>￥24</span>
      </div>
      <div class="time">下单时间：2020/08/23 01:22:00</div>
    </div>
    <div class="body">
      <div class="name">
        <span>小民大排档（软件园店）</span>
        <span class="finish">订单已完成</span>
      </div>
      <div class="num">
        <span class="dish">菜品数量：共两件菜品</span>
        <span>￥100</span>
      </div>
      <div class="time">下单时间：2020/08/23 01:22:00</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    payed() {
      this.$router.push("/listDetail");
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.orderList {
  height: 100%;
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
</style>>

