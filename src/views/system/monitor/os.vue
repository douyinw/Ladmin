<template>
  <a-layout>
    <a-col v-if="loading" class="loading">
      <a-skeleton animation>
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
    </a-col>
    <a-col v-else>
      <a-descriptions :column="1" size="large" bordered title="CPU信息" class="item">
        <a-descriptions-item label="型号">{{ cpu.model }}</a-descriptions-item>
        <a-descriptions-item label="核心数">物理核心数：{{ cpu.cores }}个，逻辑核心数：{{ cpu.threads }}个</a-descriptions-item>
        <a-descriptions-item label="缓存">{{ cpu.cache }}</a-descriptions-item>
        <a-descriptions-item label="使用率">{{ cpu.usage }}%</a-descriptions-item>
        <a-descriptions-item label="空闲率">{{ cpu.idle }}%</a-descriptions-item>
      </a-descriptions>

      <a-descriptions :column="1" size="large" bordered title="内存信息" class="item">
        <a-descriptions-item label="总内存">{{ memory.total }}G</a-descriptions-item>
        <a-descriptions-item label="已使用">{{ memory.used }}G</a-descriptions-item>
        <a-descriptions-item label="空闲">{{ memory.free }}G</a-descriptions-item>
        <a-descriptions-item label="PHP使用率">{{ memory.php_usage }}%</a-descriptions-item>
        <a-descriptions-item label="使用率">{{ memory.usage_rate }}%</a-descriptions-item>
      </a-descriptions>

      <a-descriptions :column="1" size="large" bordered title="PHP及环境信息" class="item">
        <a-descriptions-item label="操作系统">{{ env?.os }}</a-descriptions-item>
        <a-descriptions-item label="PHP版本">{{ env?.php }}</a-descriptions-item>
        <a-descriptions-item label="运行环境">{{ env?.server }}</a-descriptions-item>
      </a-descriptions></a-col>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appApi } from '@/api/system'

const Api = appApi('system')

const env = ref({})
const cpu = ref({})
const memory = ref({})
const loading = ref(true)

onMounted(() => initData())

const initData = async () => {
  const res = await Api.get('os')
  env.value = res.env
  cpu.value = res.cpu
  memory.value = res.memory
  loading.value = false
}

</script>

<style scoped>
.loading {
  background-color: var(--color-bg-2);
  padding: 16px;
}

.item {
  margin-bottom: 12px;
  padding: 16px;
  background-color: var(--color-bg-2);
}
</style>
