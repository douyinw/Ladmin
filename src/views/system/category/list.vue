<template>
  <a-layout class="container">
    <ai-table :app-api="Api" :data="data" :columns="columns" :form-append="formAppend" :rowSelection="{}"
      @search="initData" @refresh="initData" />
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { appApi } from '@/api/system'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const Api = appApi('system.category');

const data = ref([])
const formAppend = ref({})

// 字段配置
const columns = ref([
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
  { title: '上级分类', dataIndex: 'parent_id', view_type: 'treeSelect', is_edit: true, is_list: false, default_value: null },
  { title: '分类标题', dataIndex: 'name', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
  { title: '分类标识', dataIndex: 'code', is_list: true },
  { title: '排序', dataIndex: 'sort', view_type: 'number', is_edit: true, is_list: true, default_value: 0, },
  {
    title: '状态', dataIndex: 'status', view_type: 'radio', is_edit: true, is_list: true, default_value: 1,
    extend_type: 'dict', options: [{ label: '正常', value: 1 }, { label: '停用', value: 2 }]
  },
  { title: '操作', dataIndex: 'optional', width: 150, fixed: 'right', is_list: true }
]);


watch(() => props.data, (val) => {
  categoryType(val)
}, { deep: true })

onMounted(() => categoryType())

// 数据获取
const initData = async (params = {}) => {
  if (!props.data?.id) return;
  const res = await Api.list({ ...params, ...formAppend.value })
  data.value = res.list

  columns.value[1].options = res.options
}

const categoryType = (val = props.data) => {
  formAppend.value = { code: val.code }
  initData()
}

</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>