<template>
  <div class="login-container">
    <h3 class="login-logo">
      <img src="../../public/vite.svg" alt="logo" />
      <span>LAdmin</span>
    </h3>

    <div class="login-width">
      <div class="left-panel">
        <div class="version"><span>LAdmin v1.0.0</span></div>
      </div>

      <div class="login-form">
        <h2 class="login-title">登录</h2>
        <a-form :model="formModel" @submit="login">
          <a-form-item field="username" :hide-label="true" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model="formModel.username" class="w-full" size="large" placeholder="账号" allow-clear>
              <template #prefix><icon-user /></template>
            </a-input>
          </a-form-item>

          <a-form-item field="password" :hide-label="true" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model="formModel.password" placeholder="密码" size="large" allow-clear>
              <template #prefix><icon-lock /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item field="code" :hide-label="true"
            :rules="[{ required: true, match: /^[a-zA-Z0-9]{5}$/, message: '请输入验证码' }]">
            <a-input v-model="formModel.code" placeholder="验证码" size="large" allow-clear>
              <template #prefix><icon-safe /></template>
              <template #append>
                <img :src="codeImgUrl" style="height: 120px; height: 36px; cursor: pointer" @click="refreshCode" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :hide-label="true">
            <a-button html-type="submit" type="primary" long size="large" :loading="loading">
              登录
            </a-button>
          </a-form-item>

          <a-divider orientation="center">其他登录方式</a-divider>
          <div class="login-authorize">
            <a-avatar class="other-login wechat"><icon-wechat /></a-avatar>
          </div>
        </a-form>
      </div>
    </div>

    <div class="login-bg">
      <div class="fly bg-fly-circle1"></div>
      <div class="fly bg-fly-circle2"></div>
      <div class="fly bg-fly-circle3"></div>
      <div class="fly bg-fly-circle4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store'
import { appApi } from '@/api/system'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const Api = appApi('system.login')

const codeImgUrl = ref(null);
const loading = ref(false)
const formModel = reactive({
  username: 'admin',
  password: '123456',
  code: null,
  key: ''
})

onMounted(() => {
  if (route.query.logout) {
    Api.post('logout')
  }
  refreshCode()
})

const refreshCode = () => {
  Api.post('verify').then(res => {
    codeImgUrl.value = res.img
    formModel.key = res.key
    formModel.code = null
  })
}



const login = async ({ errors, values }) => {
  if (errors) { return; }
  loading.value = true
  const res = await Api.post('login', values)
  if (res) {
    userStore.setInfo(res)
    userStore.setToken(res.token)
    router.push({ name: 'layout' })
  } else {
    refreshCode()
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  color: var(--color-text-2);
  background: rgb(145 185 233 / 50%);

  .login-logo {
    width: 100%;
    height: 80px;
    font-weight: 700;
    font-size: 20px;
    line-height: 32px;
    display: flex;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
      margin-left: 30px;
    }

    span {
      font-weight: 600;
      font-size: 20px;
      margin-left: 10px;
    }
  }

  .login-width {
    max-width: 900px;
    background-color: var(--color-bg-3);
    padding: 10px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    top: 40%;
    margin-top: -255px;
    border-radius: 10px;
    z-index: 999;
    box-shadow: 0 2px 4px 2px #00000014;
  }

  .left-panel {
    width: 50%;
    height: 491px;
    background-image: url(@/assets/image/login_picture.svg);
    background-repeat: no-repeat;
    background-position: center 60px;
    background-size: contain;
  }

  .version {
    display: flex;
    margin: 20px 0 0 20px;
    color: #333;

    span {
      font-size: 26px;
      margin-left: 15px;
      color: rgb(var(--primary-6));
    }
  }

  .login-form {
    padding: 0 20px;
  }

  .login-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-bottom: 2.5rem;
    color: var(--color-text-1);
  }

  .login-authorize {
    margin: auto;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  :deep(.arco-input-append) {
    padding: 0 !important;
  }

  .other-login {
    cursor: pointer;
  }

  .qq:hover,
  .alipay:hover {
    background: #165dff;
  }

  .wechat:hover {
    background: #0f9c02;
  }

}

.login-bg {
  width: 100%;
  overflow: hidden;
  z-index: 1;
}

.fly {
  pointer-events: none;
  position: fixed;
  z-index: 9999;
}

.bg-fly-circle1 {
  left: 40px;
  top: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(var(--primary-6), 0.07), rgba(var(--primary-6), 0.04));
  animation: move-circle 2.5s linear infinite;
}

.bg-fly-circle2 {
  left: 15%;
  bottom: 5%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(var(--primary-6), 0.08), rgba(var(--primary-6), 0.04));
  animation: move-circle 3s linear infinite;
}

.bg-fly-circle3 {
  right: 12%;
  top: 90px;
  width: 145px;
  height: 145px;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(var(--primary-6), 0.1), rgba(var(--primary-6), 0.04));
  animation: move-circle 2.5s linear infinite;
}

.bg-fly-circle4 {
  right: 5%;
  top: 60%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(to right, rgba(var(--primary-6), 0.02), rgba(var(--primary-6), 0.04));
  animation: move-circle 3.5s linear infinite;
}

@keyframes move-circle {
  0% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(25px) scale(1.1);
  }

  to {
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .left-panel {
    display: none;
  }

  .login-width {
    margin-left: 15px;
    margin-right: 15px;
  }

  .login-form {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .login-width {
    margin-left: auto;
    margin-right: auto;
  }

  .login-form {
    width: 50%;
  }
}
</style>
