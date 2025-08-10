<template>
  <a-layout class="container">
    <ai-table :appApi="Api" :rowKey="state.key" :data="state.list" :columns="state.config?.columns"
      :form-append="formAppend" :buttons="state.config?.buttons" :pagination="state.pagination"
      :mode="state.config?.mode" :rowSelection="{}" @search="initData" @refresh="initData" @operate="handleOperate" />

    <a-modal width="90%" v-model:visible="modalVisible" unmountOnClose :footer="false" :body-style="{
      padding: '0', height: 'calc(100vh - 200px)',
      overflow: 'hidden auto',
      backgroundColor: 'var(--color-neutral-2)',
      borderRadius: '0 0 6px 6px'
    }">
      <template #title>类别管理</template>
      <ai-group :controller="controller.replace('go/', '')" />
    </a-modal>

    <a-col v-if="loading" class="loading">
      <a-skeleton animation>
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <div style="display: flex;justify-content: space-between;">
            <a-space>
              <a-skeleton-shape size="small" style="width: 72px;height: 32px;" />
              <a-skeleton-shape size="small" style="width: 72px;height: 32px;" />
            </a-space>
            <a-space>
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-shape shape="circle" size="small" />
              <a-skeleton-shape shape="circle" size="small" />
            </a-space>
          </div>
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
    </a-col>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useUserStore  from '@/store/modules/user'
import aiGroup from '@/views/system/category/extend.vue'
import { appApi } from '@/api/system'

const route = useRoute()
const userStore = useUserStore()

const formAppend = ref({
  user_id: userStore.info?.user_id ?? null,
})

const config = {
  key: 'id',
  list: [],
  config: {},
  pagination: {},
}

const Api = ref(null)
const state = ref(config)
const controller = ref(null)
const modalVisible = ref(false)
const loading = ref(true)

// 路由变化
watch(() => route.meta, (val) => {
  loading.value = true
  state.value = config
  initApi(val.controller)
}, { deep: true })

// 初始化接口
const initApi = (val) => {
  controller.value = val
  Api.value = appApi(val)
  initData()
}

// 初始化数据
onMounted(() => initApi(route.meta.controller))

// 获取数据
const initData = async (params = {}) => {
  await Api.value.list(params).then(res => {
    res.config.columns.forEach(r => r.key === 'PRI' && (res.rowKey = r.dataIndex));
    state.value = { ...config, ...res }
  }).catch(err => {
    state.value = config
  })
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 操作处理
const handleOperate = ({ key }) => {
  if (key === 'join') {
    modalVisible.value = true
  }
}

</script>

<style scoped>
.container {
  position: relative;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  padding: 16px;
  background-color: var(--color-bg-2);
}
</style>