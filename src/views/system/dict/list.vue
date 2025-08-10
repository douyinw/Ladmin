<template>
  <a-layout class="container">
    <ai-table :app-api="Api" :data="tableData" :columns="columns" :form-append="formAppend" @search="initData"
      @refresh="initData" />
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { appApi } from '@/api/system'

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})

const Api = appApi('system.dict')

// 响应式数据
const tableData = ref([])
const formAppend = ref({})


// 字段配置
const columns = ref([
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
  { title: '上级菜单', dataIndex: 'parent_id', view_type: 'treeSelect', is_edit: true, is_query: false, is_list: false },
  { title: '字典标签', dataIndex: 'label', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
  { title: '字典键值', dataIndex: 'value', view_type: 'input', is_required: true, is_edit: true, is_list: true },
  {
    title: '数据类型', dataIndex: 'type', view_type: 'radio', is_edit: true, is_list: true, default_value: 'text', default_value: 'string',
    extend_type: 'data',
    view_mode: {
      type: 'button'
    },
    options: [
      { label: '文本型', value: 'string' },
      { label: '整数型', value: 'int' },
      { label: '小数型', value: 'float' },
      { label: '布尔型', value: 'bool' },
    ]
  },
  { title: '字典标识', dataIndex: 'code', is_list: true },
  { title: '排序', dataIndex: 'sort', view_type: 'number', is_edit: true, is_list: true, default_value: 0, },
  {
    title: '状态', dataIndex: 'status', view_type: 'radio', is_edit: true, is_list: true, default_value: 1,
    extend_type: 'dict',
    options: [
      { label: '正常', value: 1 },
      { label: '停用', value: 2 }]
  }])

watch(() => props.data, (val) => {
  dictType(val)
}, { deep: true })

onMounted(() => dictType())

const initData = async (params = {}) => {
  if (!props.data?.id) return;
  const res = await Api.list({ ...params, ...formAppend.value })
  tableData.value = res.list
  tableData.value.forEach(r => { r.value = r.value.toString() })
  columns.value[1].options = res.options
}

const dictType = (val = props.data) => {
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