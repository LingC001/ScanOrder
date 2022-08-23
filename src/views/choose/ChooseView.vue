<template>
  <div class="choose">
    <div class="header">
      <div class="h-left">
        <div class="iconfont icon-food-cover"></div>
        <div class="table">桌台<span>31•2</span>位</div>
      </div>
      <div class="h-right">
        <van-icon name="search" />
        <div class="iconfont icon-dingdan"></div>
      </div>
    </div>
    <div class="shop-Name">
      <span>小民大排档（软件园店）</span>
      <div class="wel-words">
        <div>欢迎光临，很高兴为您服务</div>
        <div @click="toShopDetail">展开全部 ∨</div>
      </div>
      <p>老板推荐</p>
    </div>
    <div class="recommends">
      <div class="all-box">
        <div class="food-box">
          <div class="pic">
            <img
              :src="require('@/assets/images/foods/chicken feet.png')"
              alt=""
            />
          </div>
          <div class="title">
            <div>招牌凤爪</div>
            <div class="price"><span>￥</span>58</div>
            <div class="add">＋</div>
          </div>
        </div>
        <div class="food-box">
          <div class="pic">
            <img
              :src="require('@/assets/images/foods/chicken feet.png')"
              alt=""
            />
          </div>
          <div class="title">
            <div>招牌凤爪</div>
            <div class="price"><span>￥</span>58</div>
            <div class="add">＋</div>
          </div>
        </div>
        <div class="food-box">
          <div class="pic">
            <img
              :src="require('@/assets/images/foods/chicken feet.png')"
              alt=""
            />
          </div>
          <div class="title">
            <div>招牌凤爪</div>
            <div class="price"><span>￥</span>58</div>
            <div class="add">＋</div>
          </div>
        </div>
        <div class="food-box">
          <div class="pic">
            <img
              :src="require('@/assets/images/foods/chicken feet.png')"
              alt=""
            />
          </div>
          <div class="title">
            <div>招牌凤爪</div>
            <div class="price"><span>￥</span>58</div>
            <div class="add">＋</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods">
      <div class="g-left">
        <div>纸巾</div>
        <div class="active">推荐菜</div>
        <div>烧烤</div>
        <div>特色菜</div>
        <div>特色菜</div>
        <div>特色菜</div>
        <div>特色菜</div>
        <div>特色菜</div>
        <div>特色菜</div>
        <div>特色菜</div>
      </div>
      <div class="g-right">
        <div class="green">
          <img
            :src="require('@/assets/images/foods/chicken feet.png')"
            alt=""
          />
          <div class="discribe">
            <div class="d-1">纸巾</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>1</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add">＋</div>
            </div>
          </div>
        </div>
        <div class="green">
          <img
            :src="require('@/assets/images/foods/chicken feet.png')"
            alt=""
          />
          <div class="discribe">
            <div class="d-1">纸巾</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>1</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add">＋</div>
            </div>
          </div>
        </div>
        <div class="green">
          <img
            :src="require('@/assets/images/foods/chicken feet.png')"
            alt=""
          />
          <div class="discribe">
            <div class="d-1">纸巾</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>1</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add">＋</div>
            </div>
          </div>
        </div>
        <div class="green">
          <img
            :src="require('@/assets/images/foods/chicken feet.png')"
            alt=""
          />
          <div class="discribe">
            <div class="d-1">纸巾</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>1</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add">＋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="buyBox"><i class="iconfont icon-gouwuche"></i></div>
      <div class="product">未选购商品</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toShopDetail() {
      this.$router.push("/shopDetail");
    },
  },
};
</script>

// 样式
<style lang="scss">
.choose {
  height: 100%;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  .header {
    width: 100%;
    padding: 20px 10px 0 10px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .icon {
      width: 20px;
      height: 20px;
      background-color: bisque;
    }
    .h-left {
      display: flex;
      align-items: center;
      .table {
        padding-left: 8px;
        span {
          font-weight: 700;
        }
      }
    }
    .h-right {
      display: flex;
      align-items: center;
      .icon-dingdan {
        font-size: 20px;
        margin-left: 10px;
      }
    }
  }
  .shop-Name {
    padding: 10px 0 10px 10px;
    background-color: #fff;
    p {
      font-size: 5px;
      color: gray;
      margin-top: 7px;
    }
    span {
      font-weight: 700;
    }
    .wel-words {
      display: flex;
      justify-content: space-between;
      margin: 10px 10px 0 0;
      font-size: 5px;
      color: gray;
    }
  }
  .recommends {
    height: 30%;
    padding: 10px;
    display: flex;
    overflow: auto;
    background: #f9f9f9;
    .all-box {
      display: flex;
      .food-box {
        background: #fff;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        margin-right: 5px;
        .pic {
          img {
            width: 110px;
            height: 110px;
          }
        }
        .title {
          width: 100px;
          height: 50px;
          font-size: 10px;
          padding: 10px 0 10px 10px;
          .price {
            float: left;
          }
          .add {
            float: right;
            width: 20px;
            height: 20px;
            color: #fff;
            text-align: center;
            line-height: 20px;
            background-color: orange;
            border-radius: 50px;
          }
        }
      }
    }
  }
  .goods {
    background-color: #fff;
    flex: 1;
    display: flex;
    overflow: auto;
    position: relative;
    .g-left {
      font-size: 5px;
      background-color: #f8f6ff;
      overflow: auto;
      .active {
        background: #fff;
      }
      div {
        width: 60px;
        padding: 10px 0 10px 10px;
      }
    }
    .g-right {
      padding: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .green {
        width: 100%;
        // border: 1px solid green;
        display: flex;
        margin-bottom: 10px;
        img {
          float: left;
          width: 100px;
          height: 100px;
          border-radius: 10px;
        }
        .discribe {
          display: flex;
          flex-direction: column;
          font-size: 5px;
          flex: 1;
          justify-content: space-between;
          padding: 0 10px;
          .d-bot {
            display: flex;
            justify-content: space-between;
            .d-2 {
              .des-1 {
                font-size: 3px;
                color: gray;
              }
            }
            .add {
              float: right;
              width: 20px;
              height: 20px;
              color: #fff;
              text-align: center;
              line-height: 20px;
              background-color: orange;
              border-radius: 50px;
            }
          }
          .d-1 {
            font-size: 13px;
          }
        }
      }
    }
  }
  .footer {
    $h: 45px;
    position: fixed;
    left: 40px;
    bottom: 15px;
    width: 80%;
    height: $h;
    background-color: #3b363a;
    overflow: hidden;
    border-radius: 50px;
    display: flex;
    align-items: center;
    .buyBox {
      width: $h;
      height: $h;
      border-radius: 50px;
      background-color: #332e30;
      line-height: $h;
      text-align: center;
      i {
        color: #fff;
        font-size: 25px;
        font-weight: 700;
      }
    }
    .product {
      color: #9b9599;
      font-size: 15px;
      margin-left: 20px;
    }
  }
}
</style>