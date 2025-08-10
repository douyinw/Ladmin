<template>
  <a-layout>
    <ai-table :app-api="Api" :data="data" :columns="columns" :buttons="buttons" :rowSelection="{}" @search="initData"
      @refresh="initData" @operate="handleOperate" />
  </a-layout>
  <ai-edit v-model:visible="modelVisible" :data="selectedData" :menu-data="menuData" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appApi } from '@/api/system'
import aiEdit from './edit.vue'

const Api = appApi('system.role')
const menuApi = appApi('system.menu')

const data = ref([])
const menuData = ref([])
const selectedData = ref({})
const modelVisible = ref(false)

const buttons = [
  { key: 'add', title: '新增', float: 'top', type: 'primary', icon: 'icon-plus' },
  { key: 'dels', title: '删除', float: 'top', type: 'primary', status: "danger", icon: 'icon-delete', },
  { key: 'join', title: '权限', float: 'right', type: 'text', status: "", icon: 'iconSafe', },
  { key: 'edit', title: '编辑', float: 'right', type: 'primary', icon: 'icon-edit', },
  { key: 'delete', title: '删除', float: 'right', type: 'text', status: "danger", icon: 'icon-delete', }
]

const columns = ref([
  { title: '主键', dataIndex: 'id', key: 'PRI', is_edit: true },
  { title: '上级角色', dataIndex: 'parent_id', view_type: 'treeSelect', is_edit: true, is_list: false },
  { title: '角色名称', dataIndex: 'name', view_type: 'input', is_edit: true, is_list: true },
  { title: '排序', dataIndex: 'sort', view_type: 'number', is_edit: true, is_list: true, default_value: 0 },
  {
    title: '状态', dataIndex: 'status', view_type: 'radio', is_edit: true, is_list: true, default_value: 1,
    extend_type: 'dict',
    options: [{ label: '正常', value: 1 }, { label: '停用', value: 2 }]
  },
  { title: '创建时间', dataIndex: 'create_time', is_list: true },
  { title: '操作', dataIndex: 'optional', width: 200, fixed: 'right', is_list: true }
])

onMounted(async () => {
  initData()
  initMenu()
})

const initMenu = async () => {
  await menuApi.list().then(res => {
    menuData.value = res.options
  })
}

const initData = async (params = {}) => {
  const res = await Api.list({ ...params })
  data.value = res.list
  columns.value[1].options = res.options
}

const handleOperate = (e) => {
  console.log(e)
  if (e.key === 'join') {
    selectedData.value = e.record
    modelVisible.value = true
  }
}
</script>

<style scoped>

</style>