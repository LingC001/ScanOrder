<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFoods } from '@/api/foods'
import type { food, response } from '@/types/api'
import { showImagePreview } from 'vant'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

let recommendList = ref<food[]>([])
let foodsList = ref<food[]>([])
let currentCategoryList = ref<food[]>([])
let allData = ref<food[]>([])
let current = ref('纸巾')

const getFoodsData = () => {
  getFoods().then((res: response) => {
    let data = res.data
    allData.value = data
    // console.log("data", data);
    // 获取大类数据
    let ca: food[] = data.map((i: food) => {
      return i.category
    })
    currentCategoryList.value = [...new Set(ca)]
    // 获取纸巾大类下面所有商品
    foodsList.value = data.filter((i: food) => {
      return i.category === '纸巾'
    })
    // 获取推荐商品
    recommendList.value = data.filter((i: food) => {
      return i.recommended
    })
  })
}
onMounted(() => {
  getFoodsData()
})

const viewImage = (url: string) => {
  showImagePreview({
    images: [url],
    closeable: true
  })
}

const changCategory = (itemName: string) => {
  current.value = itemName
  foodsList.value = allData.value.filter((i: food) => {
    return i.category === itemName
  })
}

// 购物车
const ifProductDetail = ref(false)
const cartStore = useCartStore()
const { addCart, clearCart, minusNum, addNum } = cartStore
const { allFoodsNumber, cartData, totalFoodsPrice } = storeToRefs(cartStore)
const showProducts = function () {
  if (allFoodsNumber.value > 0) {
    ifProductDetail.value = !ifProductDetail.value
  }
}

function handleClearCart() {
  clearCart()
  ifProductDetail.value = false
}

const router = useRouter()
function toPay() {
  router.push('/submitOrder')
}

const toOrderList = () => {
  router.push('/orderList')
}

const toShopDetail = () => {
  // $router.push('/shopDetail')
}
</script>

<template>
  <div class="choose">
    <div class="header">
      <div class="h-left">
        <div class="iconfont icon-food-cover"></div>
        <div class="table">桌台<span>31•2</span>位</div>
      </div>
      <div class="h-right">
        <van-icon name="search" />
        <div class="iconfont icon-dingdan" @click="toOrderList"></div>
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
        <div v-for="(item, index) in recommendList" :key="index" class="food-box">
          <div class="pic">
            <img :src="item.image" @click="viewImage(item.image)" />
          </div>
          <div class="title">
            <div>{{ item.name }}</div>
            <div class="price"><span>￥</span>{{ item.price }}</div>
            <div class="add" @click="addCart(item)">＋</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods">
      <!--左侧分类-->
      <div class="g-left">
        <div
          v-for="(item, index) in currentCategoryList"
          :key="index"
          :class="{ active: current === item.category }"
          @click="changCategory(item.category)"
        >
          {{ item }}
        </div>
      </div>
      <!--右侧商品-->
      <div class="g-right">
        <div v-for="(item, index) in foodsList" :key="index" class="green">
          <img :src="item.image" @click="viewImage(item.image)" />
          <div class="discribe">
            <div class="d-1">{{ item.name }}</div>
            <div class="d-bot">
              <div class="d-2">
                <span>￥</span>
                <span>{{ item.price }}</span>
                <span class="des-1">/包</span>
              </div>
              <div class="add" @click="addCart(item)">＋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--购物车-->
    <div class="footer">
      <div class="buyBox" @click="showProducts">
        <i class="iconfont icon-gouwuche"></i>
        <div class="round">{{ allFoodsNumber }}</div>
      </div>
      <div v-show="allFoodsNumber === 0" class="product">未选购商品</div>
      <div v-show="allFoodsNumber > 0" style="color: #fff; margin-left: 20px">
        ￥{{ totalFoodsPrice }}
      </div>
      <div v-show="allFoodsNumber > 0" class="finish" @click="toPay">选好了</div>
    </div>
    <!--购物清单-->
    <div v-show="ifProductDetail" class="b-frame">
      <div class="top">
        <span>已选{{ allFoodsNumber }}份</span>
        <i class="iconfont icon-shanchu" @click="handleClearCart"></i>
      </div>
      <div class="body">
        <div v-for="(item, index) in cartData" :key="index" class="order">
          <span>{{ item.name }}</span>
          <span class="price">￥{{ item.totalPrice }}</span>
          <span class="num">
            <span class="minus" @click="minusNum(item)">－</span>
            <span>{{ item.number }}</span>
            <span class="add" @click="addNum(item)">＋</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

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
    border-radius: 50px;
    display: flex;
    align-items: center;
    .finish {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 120px;
      line-height: $h;
      text-align: center;
      color: #fff;
      background-color: #fa6e49;
      border-radius: 0 100px 100px 0;
    }
    .buyBox {
      position: relative;
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
      .round {
        position: absolute;
        top: -4px;
        right: -6px;
        width: 17px;
        height: 17px;
        text-align: center;
        line-height: 17px;
        color: #fff;
        border-radius: 50%;
        border: 1px solid #fff;
        background-color: #fa6e49;
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
