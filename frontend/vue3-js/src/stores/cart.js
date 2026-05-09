import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('counter', () => {
  const cartData = ref([])
  const comment = ref('')
  function addCart(item) {
    let exist = cartData.value.find((i) => i.name === item.name)
    if (!exist) {
      cartData.value.push({
        name: item.name,
        totalPrice: 1 * item.price,
        number: 1,
        price: item.price,
        image: item.image
      })
    } else {
      exist.number += 1
      exist.totalPrice = exist.number * item.price
    }
  }

  return { cartData, comment, addCart }
})
