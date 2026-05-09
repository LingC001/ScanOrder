<template>
  <div class="shopDetail">
    <div class="information">
      <h3>小民大排档（软件园店）</h3>
      <div class="billboard">商家公告</div>
      <div class="des">欢迎光临，很高兴为您服务</div>
      <div class="bill">商家信息</div>
      <div class="img">
        <img :src="require('@/assets/images/shop/shop.png')" alt="" />
      </div>
      <div class="address">
        <div class="left">
          <i class="iconfont icon-31dingwei"></i>
          <span>洪山区关山大道590号</span>
        </div>
        <div class="right">
          <span>|</span>
          <i class="iconfont icon-31dianhua"></i>
        </div>
      </div>
      <div class="des">营业时间：午市9:00-13:00；夜市：14:00-01:00</div>
      <div class="des">特色服务：免费WIFI</div>
      <div class="des">停车位：暂无数据</div>
      <div class="arrow-up" @click="back"><van-icon name="arrow-up" /></div>
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

<style lang="scss">
.information {
  padding: 30px 20px 0 20px;

  .billboard {
    padding-top: 10px;
    font-weight: 700;
  }
  .des {
    padding-top: 10px;
    font-size: 12px;
    color: #656565;
  }
  .bill {
    padding-top: 35px;
    font-weight: 700;
  }
  .img {
    margin-top: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 150px;
    }
  }
  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      i {
        color: #656565;
        margin-right: 10px;
      }
    }
    .right {
      i {
        color: #656565;
        margin-left: 20px;
        font-size: 20px;
      }
      span {
        color: #656565;
      }
    }
  }
  .arrow-up {
    position: fixed;
    bottom: 10px;
    left: 50%;
    font-size: 50px;
    color: #656565;
    display: flex;
    transform: translateX(-50%);
  }
}
</style>
