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
        <div
          class="food-box"
          v-for="(item, index) in recommendList"
          :key="index"
        >
          <div class="pic">
            <img :src="item.image" @click="viewImage(item.image)" />
          </div>
          <div class="title">
            <div>{{ item.name }}</div>
            <div class="price"><span>￥</span>{{ item.price }}</div>
            <div class="add">＋</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods">
      <div class="g-left">
        <div v-for="(item, index) in category" :key="index">{{ item }}</div>
      </div>
      <div class="g-right">
        <div class="green" v-for="(item, index) in foodlist" :key="index">
          <img :src="item.image" />
          <div class="discribe">
            <div class="d-1">{{ item.name }}</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>{{ item.price }}</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add">＋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="buyBox" @click="showProducts">
        <i class="iconfont icon-gouwuche"></i>
      </div>
      <div class="product">未选购商品</div>
      <div class="finish" @click="toPay">选好了</div>
    </div>
    <div class="b-frame" v-show="ifProductDetail">
      <div class="top">
        <span>已选三份</span>
        <i class="iconfont icon-shanchu"></i>
      </div>
      <div class="body">
        <div class="order">
          <span>纸巾</span>
          <span class="price">￥1</span>
          <span class="num">
            <span class="minus">－</span>
            <span>1</span>
            <span class="add">＋</span>
          </span>
        </div>
        <div class="order">
          <span>周黑鸭</span>
          <span class="price">￥45</span>
          <span class="num">
            <span class="minus">－</span>
            <span>1</span>
            <span class="add">＋</span>
          </span>
        </div>
        <div class="order">
          <span>招牌凤爪</span>
          <span class="price">￥55</span>
          <span class="num">
            <span class="minus">－</span>
            <span>1</span>
            <span class="add">＋</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import request from "@/utils/axios.js";

export default {
  data() {
    return {
      ifProductDetail: false,
      category: null,
      foodlist: [],
      recommendList: [],
    };
  },
  created() {
    request.get("http://150.158.166.35/api/foods/").then((res) => {
      // console.log(res);
      let data = res.data;
      console.log("data", data);
      // 获取大类数据
      let ca = data.map((i) => {
        return i.category;
      });
      console.log("ca", ca);
      let allCa = [...new Set(ca)];
      console.log("allCa", allCa);
      this.category = allCa;
      // 获取纸巾大类下面所以商品
      this.foodlist = data.filter((i) => {
        return i.category === "纸巾";
      });
      console.log("this.foodlist", this.foodlist);
      // 获取推荐商品
      this.recommendList = data.filter((i) => {
        return i.recommended === "true";
      });
      console.log("this.recommendList", this.recommendList);
    });
  },
  methods: {
    toShopDetail() {
      this.$router.push("/shopDetail");
    },
    viewImage(url) {
      ImagePreview({
        images: [url],
        closeable: true,
      });
    },
    showProducts() {
      this.ifProductDetail = !this.ifProductDetail;
    },
    toPay() {
      this.$router.push("/submitOrder");
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
    left: 50%;
    bottom: 15px;
    transform: translateX(-50%);
    width: 90%;
    height: $h;
    background-color: #3b363a;
    overflow: hidden;
    border-radius: 50px;
    display: flex;
    align-items: center;
    .finish {
      color: #fff;
    }
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
  .b-frame {
    width: 90%;
    padding: 10px;
    background-color: #fff;
    position: fixed;
    left: 50%;
    bottom: 70px;
    transform: translateX(-50%);
    box-shadow: 0px 0px 10px 1px #0707073d;
    .top {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      font-size: 13px;
      border-bottom: 1px solid #9b9599;
    }
    .body {
      padding-top: 15px;
      width: 100%;
      .order {
        width: 100%;
        font-size: 12px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        &:last-child {
          margin-bottom: 0;
        }
        .price {
          color: orange;
        }
        .num {
          width: 70px;
          display: flex;
          justify-content: space-between;
          .add {
            width: 20px;
            height: 20px;
            color: #fff;
            text-align: center;
            line-height: 20px;
            background-color: orange;
            border-radius: 50px;
          }
          .minus {
            width: 20px;
            height: 20px;
            color: black;
            text-align: center;
            line-height: 20px;
            border: 1px solid #9b9599;
            border-radius: 50px;
          }
        }
      }
    }
  }
}
</style>