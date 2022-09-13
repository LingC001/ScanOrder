<template>
  <div class="upload2">
    <van-form @submit="onSubmit">
      <van-field
        v-model="category"
        name="category"
        label="分类"
        placeholder="分类"
        :rules="[{ required: true, message: '请填写分类' }]"
      />
      <van-field
        v-model="name"
        type="text"
        name="name"
        label="名称"
        placeholder="名称"
        :rules="[{ required: true, message: '请填写名称' }]"
      />
      <van-field name="pic" label="文件上传">
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
      />
      <van-field
        v-model="description"
        type="text"
        name="description"
        label="描述"
        placeholder="描述"
        :rules="[{ required: true, message: '请填写描述' }]"
      />
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
  data() {
    return {
      category: "",
      name: "",
      pic: [],
      price: "",
      description: "",
      recommended: false,
    };
  },
  methods: {
    onSubmit(values) {
      console.log("values", values);
      let formData = new FormData();
      // formData.append("category", this.category);
      // formData.append("name", this.name);
      // formData.append("pic", this.pic[0].file);
      // formData.append("price", this.price);
      // formData.append("description", this.description);
      // formData.append("recommended", this.recommended);

      values.pic = values.pic[0]["file"];
      for (let i in values) {
        formData.append(i, values[i]);
      }
      console.log("formData", formData);
      addFood(formData)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  },
};
</script>

<style></style>
