<template>
  <div class="listDetail">
    <div class="header">
      <i class="iconfont icon-zuojiantou_huaban" @click="back"></i>
      <span>提交订单</span>
      <i class="iconfont icon-dingdan"></i>
    </div>
    <div class="pay">
      <div class="paying">已支付</div>
      <div class="payed">付款后即可享受美味</div>
    </div>
    <div class="body">
      <div class="paying">待支付￥117</div>
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
          <span class="num">共3份</span>
          小计￥
          <span class="price">117.00</span>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div>订单信息</div>
      <div class="order">订单编号：123456789</div>
      <div class="order">下单时间：2020/08/23 2:32:00</div>
      <div class="order">桌台名称：31</div>
      <div class="tip">
        <i class="iconfont icon-zhuyi"></i>
        商家设置了金额零头处理，如有疑问咨询客服。
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.listDetail {
  @mixin pianyi {
    position: relative;
    left: 0;
    top: -53px;
  }
  display: table;
  width: 100%;
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
  .pay {
    background-color: #ff7b41;
    padding: 10px;
    height: 120px;
    .paying {
      font-size: 20px;
      color: #fff;
    }
    .payed {
      font-size: 12px;
      color: #fff;
    }
  }
  .body {
    @include pianyi();
    margin: 10px;
    padding: 10px;
    background-color: #fff;
    .paying {
      color: #ff7b41;
      font-size: 18px;
      height: 40px;
      line-height: 40px;
    }
    .goods {
      .container {
        display: flex;
        padding: 15px;

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
        margin-top: 15px;
        width: 100%;
        height: 60px;
        font-size: 15px;
        line-height: 60px;
        border-top: 1px solid #f4f1f4;
        .num {
          margin-right: 20px;
        }
        .price {
          font-weight: 700;
          font-size: 20px;
        }
      }
    }
  }
  .info-box {
    @include pianyi();
    margin: 10px;
    padding: 10px;
    background-color: #fff;
    .order {
      font-size: 12px;
      margin: 10px 0;
    }
    .tip {
      font-size: 12px;
      color: #ff763e;
    }
  }
}
</style>>
