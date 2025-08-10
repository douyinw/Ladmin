<template>
  <a-layout>
    <ai-table :app-api="Api" :data="tableData" :columns="columns" :rowSelection="{}" @search="initData"
      @refresh="initData" @form-item-change="formItemChange" @formChange="formChange">
    </ai-table>
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appApi } from '@/api/system'

const Api = appApi('system.menu');

const tableData = ref([])

const columns = ref([
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true, is_list: false },
  { title: '上级菜单', dataIndex: 'parent_id', view_type: 'treeSelect', is_edit: true, is_list: false },
  { title: '菜单名称', dataIndex: 'title', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true, width: 220 },
  {
    title: '类型', dataIndex: 'type', view_type: 'radio', is_edit: true, is_list: true, default_value: 'M', width: 100, default_value: 'M',
    extend_type: 'dict', options: [{ label: '菜单', value: 'M' }, { label: '按钮', value: 'B' }, { label: '链接', value: 'L' }]
  },
  { title: '图标', dataIndex: 'icon', view_type: 'icon', is_edit: true, is_list: true, width: 100 },
  { title: '菜单标识', dataIndex: 'name', view_type: 'input', is_edit: true, is_query: true, is_list: true, width: 150 },
  { title: '路由地址', dataIndex: 'path', view_type: 'input', is_edit: true, is_list: true, width: 150 },
  { title: '组件路径', dataIndex: 'component', view_type: 'input', is_edit: true, is_list: true, width: 150,help:'公共组件：default/index' },
  { title: '应用接口', dataIndex: 'controller', view_type: 'input', is_edit: true, is_list: true, width: 150 },
  { title: '排序', dataIndex: 'sort', view_type: 'number', is_edit: true, is_list: true, default_value: 0, width: 100 },
  {
    title: '显示', dataIndex: 'show', view_type: 'radio', is_edit: true, is_list: true, default_value: 1, width: 100, default_value: 1,
    extend_type: 'dict', options: [{ label: '是', value: 1 }, { label: '否', value: 2 }]
  },
  {
    title: 'CRUD', dataIndex: 'crud', view_type: 'radio', is_edit: true, default_value: 0,
    options: [{ label: '是', value: 1 }, { label: '否', value: 0 }]
  },
])

onMounted(() => initData())

const initData = async (params = {}) => {
  const res = await Api.list(params);
  tableData.value = res.list
  columns.value[1].options = res.options
}

const formItemChange = ({ key, value }) => {
  const fixed = ['icon', 'name', 'path', 'component'];
  if (key === 'type') {
    columns.value.forEach(c => {
      if (fixed.includes(c.dataIndex)) {
        c.is_edit = value === 'M';
      }
    })
  }
}

const formChange = (data) => {
  if (data?.type) {
    formItemChange({ key: 'type', value: data.type })
  } else {
    setTimeout(() => {
      formItemChange({ key: 'type', value: 'M' })
    }, 300)
  }
}

</script>

<style scoped></style>