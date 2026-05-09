<script setup lang="ts">
import { ref } from 'vue'
import { addFood } from '@/api/foods'
import { showFailToast, showSuccessToast } from 'vant'
import type { foodUpload } from '@/types/api'

const form = ref<foodUpload>({
  id: 0,
  category: '',
  name: '',
  pic: [],
  price: 0,
  description: '',
  recommended: false
})
function onSubmit(values: any) {
  // console.log('values', values)
  // values.pic = values.pic[0]['file']
  let formData = new FormData()
  for (let key in values) {
    if (key === 'pic') {
      formData.append(key, values[key][0]['file'])
      continue
    }
    formData.append(key, values[key])
  }
  // console.log('formData', formData)
  addFood(formData)
    .then(() => {
      showSuccessToast('添加成功')
      form.value = {
        category: '',
        description: '',
        id: 0,
        name: '',
        pic: [],
        price: 0,
        recommended: false
      }
    })
    .catch(() => {
      showFailToast('添加失败')
    })
}
</script>

<template>
  <div class="upload">
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.category"
        name="category"
        label="种类"
        placeholder="种类"
        :rules="[{ required: true, message: '请填写种类' }]"
      ></van-field>
      <van-field
        v-model="form.name"
        name="name"
        label="名称"
        placeholder="名称"
        :rules="[{ required: true, message: '请填写名称' }]"
      ></van-field>
      <van-field name="pic" label="图片">
        <template #input>
          <van-uploader v-model="form.pic" :max-count="1" />
        </template>
      </van-field>
      <van-field
        v-model="form.price"
        type="number"
        name="price"
        label="价格"
        placeholder="价格"
        :rules="[{ required: true, message: '请填写价格' }]"
      ></van-field>
      <van-field
        v-model="form.description"
        name="description"
        label="描述"
        placeholder="描述"
        :rules="[{ required: true, message: '请填写描述' }]"
      ></van-field>
      <van-field name="recommended" label="是否推荐">
        <template #input>
          <van-switch v-model="form.recommended" size="20" />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<style scoped lang="scss"></style>
