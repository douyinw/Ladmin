<template>
  <a-layout>
    <ai-table :data="data" :columns="columns" :app-api="Api" :buttons="buttons" :pagination="{}" :rowSelection="{}"
      @search="initData" @refresh="initData" @operate="handleOperate" />

    <a-modal width="90%"
      :body-style="{ padding: '12px', height: 'calc(100vh - 200px)', overflow: 'hidden auto', backgroundColor: 'var(--color-neutral-2)' , borderRadius:'0 0 6px 6px' }"
      v-model:visible="modalVisible" unmount-on-close :footer="false">
      <template #title>{{ selectedData.name }}</template>
      <ai-list :data="selectedData" />
    </a-modal>

  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import aiList from './list.vue'
import { appApi } from '@/api/system'

const Api = appApi('system.dicttype');

// 响应式数据
const data = ref([])
const selectedData = ref({})
const modalVisible = ref(false)


// 字段配置
const columns = [
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
  { title: '字典名称', dataIndex: 'name', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
  { title: '字典标识', dataIndex: 'code', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
  {
    title: '状态', dataIndex: 'status', view_type: 'radio', is_edit: true, is_list: true, default_value: 1,
    extend_type: 'dict', options: [{ label: '正常', value: 1 }, { label: '停用', value: 2 }]
  },
  { title: '备注', dataIndex: 'remark', view_type: 'textarea', is_edit: true, is_list: true },
  { title: '操作', dataIndex: 'optional', width: 200, fixed: 'right', is_list: true }
];

// 操作配置
const buttons = [
  { key: 'join', title: '数据', float: 'right', type: 'text', status: "", icon: 'IconOrderedList', size: 'small' },
  { key: 'edit', title: '编辑', float: 'right', type: 'text', status: "", icon: 'icon-edit', size: 'small' },
  { key: 'delete', title: '删除', float: 'right', type: 'text', status: "danger", icon: 'icon-delete', size: 'small' }
];

// 初始化
onMounted(() => {
  initData()
})

// 数据获取
const initData = async (params = {}) => {
  const res = await Api.list(params)
  data.value = res.list
}

// 表格操作处理
const handleOperate = (e) => {
  if (e.key === 'join') {
    selectedData.value = e.record
    modalVisible.value = true
  }
}
</script>

<style scoped></style>