<template>
  <div class="page">
    <a-space direction="vertical" size="medium" fill>
      <img class="img" src="@/assets/image/404.svg" />
      <div>访问的页面不存在...</div>
      <a-button type="primary" @click="$router.push({ name: 'dashboard' })">
        返回首页
      </a-button>
    </a-space>
  </div>
</template>

<style scoped>
.page {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -180px;
  text-align: center;
}

.img {
  width: 360px;
}
</style>