<template>
  <div class="choose">
    <div class="header">
      <div class="h-left">
        <div class="icon"></div>
        <div>桌台<span>31•2</span>位</div>
      </div>
      <div class="h-right">
        <div class="icon"></div>
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {},
};
</script>

<style lang="scss">
.choose {
  .header {
    width: 100%;
    padding: 10px 10px 0 10px;
    display: flex;
    justify-content: space-between;
    .icon {
      width: 20px;
      height: 20px;
      background-color: aqua;
    }
    .h-left {
      display: flex;
    }
    .h-right {
      display: flex;
    }
  }
}
</style>