import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { cartItem, food } from '@/types/api'

export const useCartStore = defineStore('cart', () => {
  const cartData = ref<cartItem[]>([])
  const comment = ref('')

  const orderData = computed(() => {
    return {
      location: '小明大排档(软件园店)',
      tableNumber: 32,
      cartData: cartData.value,
      totalFoodsPrice: totalFoodsPrice.value,
      allFoodsNumber: allFoodsNumber.value,
      comment: comment.value
    }
  })
  const allFoodsNumber = computed(() => {
    let allNumber = 0
    cartData.value.forEach((i) => {
      allNumber = allNumber + i.number
    })
    return allNumber
  })
  const totalFoodsPrice = computed(() => {
    let allPrice = 0
    cartData.value.forEach((i) => {
      allPrice = allPrice + i.totalPrice
    })
    return allPrice
  })

  function addCart(item: food) {
    const exist = cartData.value.find((i) => i.name === item.name)
    if (!exist) {
      cartData.value.push({
        name: item.name,
        totalPrice: item.price,
        number: 1,
        price: item.price,
        image: item.image
      })
    } else {
      exist.number += 1
      exist.totalPrice = exist.number * item.price
    }
  }
  function clearCart() {
    cartData.value = []
  }

  function minusNum(item: cartItem) {
    // console.log("item", item);
    const res: cartItem | undefined = cartData.value.find((i) => {
      return i.name === item.name
    })
    if (res !== undefined) {
      res.number = res.number - 1
      res.totalPrice = res.number * item.price
      cartData.value = cartData.value.filter((i) => i.number > 0)
    }
  }
  function addNum(item: cartItem) {
    // console.log("item", item);
    const res: cartItem | undefined = cartData.value.find((i) => {
      return i.name === item.name
    })
    if (res !== undefined) {
      res.number = res.number + 1
      res.totalPrice = res.number * item.price
    }
  }

  function confirmComment(data: string) {
    comment.value = data
  }

  return {
    cartData,
    comment,
    allFoodsNumber,
    totalFoodsPrice,
    orderData,
    clearCart,
    minusNum,
    addNum,
    addCart,
    confirmComment
  }
})
