<template>
  <div class="orderList">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>订单列表</span>
    </div>
    <div
      class="body"
      @click="payed(item._id)"
      v-for="(item, index) in orderList"
      :key="index"
    >
      <div class="name">
        <span>小民大排档（软件园店）</span>
        <span class="finish">{{ item.finished | orderStatus }}</span>
      </div>
      <div class="num">
        <span class="dish">菜品数量：共{{ item.allFoodsNumber }}件菜品</span>
        <span>￥{{ item.totalFoodsPrice }}</span>
      </div>
      <div class="time">下单时间：{{ item.createdAt | orderTime }}</div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { getOrderList } from "@/api/orders";
export default {
  filters: {
    orderStatus(val) {
      if (val === true) {
        return "订单已完成";
      } else {
        return "订单未完成";
      }
    },
    orderTime(val) {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  data() {
    return {
      orderList: [],
    };
  },
  created() {
    getOrderList()
      .then((res) => {
        // console.log("res", res);
        this.orderList = res.data.reverse();
        // this.orderList.forEach((i) => {
        //   console.log("i", i);
        //   if (i.finished === true) {
        //     i.finished = "订单已完成";
        //   } else {
        //     i.finished = "订单未完成";
        //   }
        // });
        // console.log("orderlist", this.orderList);
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log("err", err);
      });
  },
  methods: {
    payed(id) {
      // console.log("id", id);
      this.$router.push({
        path: "/listDetail",
        query: {
          id,
        },
      });
    },
    back() {
      this.$router.push("/choose");
    },
  },
};
</script>

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
