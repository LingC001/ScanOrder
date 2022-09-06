import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cartData: [],
    comment: "",
  },
  getters: {
    orderData(state, getters) {
      return {
        location: "小明大排档(软件园店)",
        tableNumber: 32,
        cartData: state.cartData,
        totalFoodsPrice: getters.totalFoodsPrice,
        allFoodsNumber: getters.allFoodsNumber,
        comment: state.comment,
      };
    },
    totalFoodsPrice(state) {
      let allPrice = 0;
      state.cartData.forEach((i) => {
        allPrice = allPrice + i.totalPrice;
      });
      return allPrice;
    },
    allFoodsNumber(state) {
      let allNumber = 0;
      state.cartData.forEach((i) => {
        allNumber = allNumber + i.number;
      });
      return allNumber;
    },
  },
  mutations: {
    confirmComment(state, comment) {
      state.comment = comment;
    },
    addCart(state, item) {
      let exist = state.cartData.find((i) => i.name === item.name);
      if (!exist) {
        state.cartData.push({
          name: item.name,
          totalPrice: 1 * item.price,
          number: 1,
          price: item.price,
          image: item.image,
        });
      } else {
        exist.number += 1;
        exist.totalPrice = exist.number * item.price;
      }
    },
    clearCart(state) {
      state.cartData = [];
      // this.ifProductDetail = false;
    },
    minusNum(state, item) {
      // console.log("item", item);
      let res = state.cartData.find((i) => {
        return i.name === item.name;
      });
      res.number = res.number - 1;
      res.totalPrice = res.number * item.price;
      state.cartData = state.cartData.filter((i) => i.number > 0);
      // console.log("this.cartData", state.cartData);
      // if (this.cartData.length === 0) {
      //   console.log("33332");
      //   this.ifProductDetail = false;
      // }
    },
    addNum(state, item) {
      // console.log("item", item);
      let res = state.cartData.find((i) => {
        return i.name === item.name;
      });
      res.number = res.number + 1;
      res.totalPrice = res.number * item.price;
    },
  },
});

export default store;
