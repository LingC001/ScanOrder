export interface response {
  data: any
}

export interface food {
  id: number
  name: string
  price: number
  image: string
  desc: string
  category: string
  recommended: boolean
}

export interface cartItem {
  name: string
  totalPrice: number
  number: number
  price: number
  image: string
}

export interface foodUpload {
  id: number
  name: string
  price: number
  pic: any[]
  description: string
  category: string
  recommended: boolean
}
