<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";


let numList = ref([
  {
    num: 1,
    isActive: true,
  },
  {
    num: 2,
    isActive: false,
  },
  {
    num: 3,
    isActive: false,
  },
  {
    num: 4,
    isActive: false,
  },
  {
    num: 5,
    isActive: false,
  },
])

const selectChange = (current) =>{
  numList.value = numList.value.map((i) => {
    i.isActive = i.num === current;
    return i;
  });
}

const router = useRouter();
const choose = () => {
  router.push("/choose");
}
</script>

<template>
  <div class="orderIndex">
    <div class="logo">
      <div class="mTuan">美团</div>
      <h5>美团</h5>
    </div>
    <div class="w-Xm">欢迎来到小民大排档（软件园店）</div>
    <div class="c-Num">
      <h5>客官，您几位？</h5>
      <p>桌号：3111</p>
      <ul>
        <li
            v-for="(item, index) in numList"
            :key="index"
            :class="{ active: item.isActive }"
            @click="selectChange(item.num)"
        >
          {{ item.num }}人
        </li>
      </ul>
      <div class="order" @click="choose">开始点餐</div>
    </div>

    <div class="footer">美团餐饮系统提供技术支持</div>
  </div>
</template>

<style lang="scss" scoped>
$m-color1: #fd6836;
$m-color2: #fc9904;
@mixin test {
  border: 1px solid green;
}
.orderIndex {
  height: 100%;
  overflow: hidden;
  background-image: url("../assets/images/background.png");
  h5{
    font-weight: bold;
  }
  .logo {
    height: 10vw;
    display: flex;
    margin-left: 38%;
    margin-top: 30%;
    margin-bottom: 4%;
    .mTuan {
      width: 10vw;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
      background-color: #ffd001;
      border-radius: 20%;
      font-weight: 700;
    }
    h5 {
      color: #fff;
      margin-left: 2%;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
      font-size: 7vw;
    }
  }

  .w-Xm {
    font-weight: 700;
    text-align: center;
    color: #fff;
  }

  .c-Num {
    width: 90%;
    height: 40%;
    margin-left: 5%;
    margin-top: 45%;
    background-color: #fff;
    border-radius: 2%;
    h5 {
      padding-left: 5%;
      padding-top: 3%;
    }

    p {
      padding-left: 5%;
      padding-top: 2%;
      font-size: 5px;
    }

    ul {
      display: flex;
      justify-content: space-around;
      font-size: 5px;
      height: 30px;
      margin-top: 18%;
      .active {
        background-color: $m-color2;
        width: 50px;
        line-height: 30px;
        text-align: center;
        border-radius: 50px;
      }

      li {
        width: 50px;
        line-height: 30px;
        text-align: center;
      }
    }
    .order {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5%;
      margin-top: 18%;
      width: 90%;
      height: 15%;
      font-size: 5px;
      color: #fff;
      border-radius: 50px;
      background-color: $m-color1;
    }
  }

  .footer {
    margin-top: 3%;
    text-align: center;
    font-size: 5px;
    color: #fff;
  }
}
</style>
