<template>
  <div class="submitOrder">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>提交订单</span>
      <i class="iconfont icon-dingdan"></i>
    </div>
    <div class="body">
      <div class="goods">
        <div class="container" v-for="(item, index) in cartData" :key="index">
          <img :src="item.image" alt="" />
          <div class="wrap">
            <div class="info">
              <span>{{ item.name }}</span>
              <span>￥{{ item.totalPrice }}</span>
            </div>
            <div class="num">数量：{{ item.number }}</div>
          </div>
        </div>
        <div class="count">
          小计：￥
          <span>{{ totalFoodsPrice }}</span>
        </div>
      </div>
    </div>
    <div class="footer" @click="showCommentBox">
      <div>备注</div>
      <i class="iconfont icon-web__jiantou_you"></i>
    </div>
    <div class="bottom">
      <span class="price"
        >￥<span class="pri">{{ totalFoodsPrice }}</span></span
      >
      <div class="pay" @click="toPay">支付并下单</div>
    </div>
    <van-dialog
      v-model="dialogShow"
      title="备注"
      show-cancel-button
      @confirm="confirmComment(comment)"
      @cancel="confirmComment('')"
    >
      <van-field
        v-model="comment"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入备注"
        show-word-limit
      />
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { createOrder } from "@/api/orders.js";
export default {
  data() {
    return {
      dialogShow: false,
    };
  },
  computed: {
    ...mapState(["cartData", "comment"]),
    ...mapGetters(["totalFoodsPrice", "orderData"]),
    comment: {
      get() {
        return this.orderData.comment;
      },
      set(val) {
        this.confirmComment(val);
      },
    },
  },
  created() {
    // console.log("cartData", this.cartData);
  },
  methods: {
    ...mapMutations(["confirmComment", "clearCart"]),
    toPay() {
      // 調用支付，將訂單數據傳過去
      // console.log("orderData", this.orderData);
      // let data = this.orderData;
      createOrder(this.orderData)
        .then(() => {
          this.clearCart();
          this.$router.push("/orderList");
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log("err", err);
          this.$toast("出错了");
        });
    },
    back() {
      this.$router.back();
    },
    showCommentBox() {
      this.dialogShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.submitOrder {
  height: 100%;
  background-color: #f4f1f4;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 50px;
    .iconfont {
      font-size: 23px;
    }
  }
  .body {
    margin: 20px;
    background-color: #fff;
    .goods {
      .container {
        display: flex;
        padding: 15px;
        border-bottom: 1px solid #f4f1f4;
        img {
          width: 50px;
          height: 50px;
        }
        .wrap {
          margin-left: 10px;
          width: 100%;
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .info {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 25px;
          }
          .num {
            font-size: 12px;
            color: #adaaad;
          }
        }
      }
      .count {
        display: flex;
        justify-content: flex-end;
        padding-right: 18px;
        width: 100%;
        height: 60px;
        font-size: 15px;
        line-height: 60px;
        span {
          font-weight: 700;
          font-size: 20px;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    margin: 20px;
    padding: 20px 10px;
    background-color: #fff;
    .iconfont {
      color: #adaaad;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 90px;
    padding: 10px;
    background-color: #fff;
    .price {
      font-weight: 700;
      font-size: 15px;
      color: #ff6633;
      .pri {
        font-size: 30px;
      }
    }
    .pay {
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #ff6633;
      color: #fff;
      border-radius: 50px;
    }
  }
}
</style>
>
