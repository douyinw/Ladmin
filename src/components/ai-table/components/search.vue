<template>
  <a-card class="ai-search" v-if="visible">
    <a-form ref="formRef" :model="formModel" :auto-label-width="true">
      <a-row :gutter="10">
        <ai-form-item mode="is_query" :data="formModel" :columns="columns" />
        <div class="search-btns">
          <a-space>
            <a-button type="primary" @click="search">
              <template #icon><icon-search /></template>搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon><icon-refresh /></template>重置
            </a-button>
          </a-space>
        </div>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref } from 'vue'

const emits = defineEmits(['change'])

const props = defineProps({
  columns: { type: Array, default: () => [] },
  visible: { type: Boolean, default: false },
})

const formRef = ref(null)
const formModel = ref({})

// 搜索
const search = () => {
  emits('change', formRef.value?.model ?? {})
}

// 重置
const resetSearch = () => {
  emits('change', {})
  formRef.value?.resetFields()
}

</script>

<style lang="scss" scoped>
.ai-search {
  margin-bottom: 12px;
  border: none;

  :deep(.arco-card-body) {
    padding: 16px 16px 0 16px;
  }

  :deep(.arco-form-item) {
    margin-bottom: 16px;
  }

  :deep(.arco-btn-size-medium) {
    padding: 0 10px;
  }

  .search-btns {
    min-width: 150px;
    padding: 0 10px 16px;
  }
}

[mine-skin=skin_a],
[mine-skin=skin_b],
[mine-skin=skin_c],
[mine-skin=skin_d],
[mine-skin=skin_e],
[mine-skin=skin_f]{ .ai-search{
  margin: 0;

}}
</style>