<template>
  <div class="upload">
    <van-form @submit="onSubmit">
      <van-field
        v-model="category"
        name="category"
        label="种类"
        placeholder="种类"
        :rules="[{ required: true, message: '请填写种类' }]"
      ></van-field>
      <van-field
        v-model="name"
        name="name"
        label="名称"
        placeholder="名称"
        :rules="[{ required: true, message: '请填写名称' }]"
      ></van-field>
      <van-field name="pic" label="图片">
        <template #input>
          <van-uploader v-model="pic" :max-count="1" />
        </template>
      </van-field>
      <van-field
        v-model="price"
        type="number"
        name="price"
        label="价格"
        placeholder="价格"
        :rules="[{ required: true, message: '请填写价格' }]"
      ></van-field>
      <van-field
        v-model="description"
        name="description"
        label="描述"
        placeholder="描述"
        :rules="[{ required: true, message: '请填写描述' }]"
      ></van-field>
      <van-field name="recommended" label="是否推荐">
        <template #input>
          <van-switch v-model="recommended" size="20" />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { addFood } from "@/api/foods";

export default {
  name: "upload",
  data() {
    return {
      category: "",
      name: "",
      pic: [],
      price: "",
      description: "",
      recommended: "",
    };
  },
  methods: {
    onSubmit(values) {
      // console.log("values", values);
      values.pic = values.pic[0]["file"];
      let formData = new FormData();
      for (let i in values) {
        formData.append(i, values[i]);
      }
      addFood(formData);
    },
  },
};
</script>

<style scoped></style>
