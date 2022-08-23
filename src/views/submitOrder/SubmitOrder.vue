<template>
  <div class="submitOrder">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>提交订单</span>
      <i class="iconfont icon-dingdan"></i>
    </div>
    <div class="body">
      <div class="goods">
        <div class="container">
          <img src="@/assets/images/foods/tissue.png" alt="" />
          <div class="wrap">
            <div class="info">
              <span>纸巾</span>
              <span>￥1.00</span>
            </div>
            <div class="num">数量：1</div>
          </div>
        </div>
        <div class="container">
          <img src="@/assets/images/foods/tissue.png" alt="" />
          <div class="wrap">
            <div class="info">
              <span>纸巾</span>
              <span>￥1.00</span>
            </div>
            <div class="num">数量：1</div>
          </div>
        </div>
        <div class="container">
          <img src="@/assets/images/foods/tissue.png" alt="" />
          <div class="wrap">
            <div class="info">
              <span>纸巾</span>
              <span>￥1.00</span>
            </div>
            <div class="num">数量：1</div>
          </div>
        </div>
        <div class="count">
          小计：￥
          <span>117.00</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>备注</div>
      <i class="iconfont icon-web__jiantou_you"></i>
    </div>
    <div class="bottom">
      <span class="price">￥<span class="pri">117.00</span></span>
      <div class="pay" @click="toPay">支付并下单</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toPay() {
      this.$router.push("/orderList");
    },
    back() {
      this.$router.back();
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
</style>>

