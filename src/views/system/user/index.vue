<template>
  <a-layout>
    <ai-table :app-api="Api" :data="data" :columns="columns" :buttons="buttons" :rowSelection="{}" :pagination="{}"
      @search="initData" @refresh="initData" />
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appApi } from '@/api/system'

const Api = appApi('system.user')
const roleApi = appApi('system.role')

const data = ref([])

const buttons = [
  { key: 'add', title: '新增', float: 'top', type: 'primary', icon: 'icon-plus' },
  { key: 'dels', title: '删除', float: 'top', type: 'primary', status: "danger", icon: 'icon-delete' },
  { key: 'edit', title: '编辑', float: 'right', type: 'primary', icon: 'icon-edit' },
  { key: 'delete', title: '删除', float: 'right', type: 'text', status: "danger", icon: 'icon-delete' }
]

const columns = ref([
  { title: '主键', dataIndex: 'id', key: 'PRI', is_edit: true },
  { title: '角色', dataIndex: 'role_id', view_type: 'treeSelect', is_edit: true, is_list: true, extend_type: 'category', },
  { title: '账号', dataIndex: 'username', view_type: 'input', is_edit: true, is_list: true },
  { title: '密码', dataIndex: 'password', view_type: 'password', is_edit: true },
  { title: '昵称', dataIndex: 'nickname', view_type: 'input', is_edit: true, is_list: true },
  { title: '头像', dataIndex: 'avatar', view_type: 'upimage', is_edit: true, is_list: true },
  { title: '手机号', dataIndex: 'mobile', view_type: 'input', is_edit: true, is_list: true },
  { title: '邮箱', dataIndex: 'email', view_type: 'input', is_edit: true, is_list: true },
  { title: '会员ID', dataIndex: 'member_id', view_type: 'number', is_edit: true, help: '绑定会员ID' },
  {
    title: '状态', dataIndex: 'status', view_type: 'radio', is_edit: true, is_list: true, default_value: 1,
    extend_type: 'dict',
    options: [{ label: '正常', value: 1 }, { label: '停用', value: 2 }]
  },
  { title: '登录IP', dataIndex: 'login_ip', is_list: true },
  { title: '登录时间', dataIndex: 'login_time', is_list: true },
  { title: '创建时间', dataIndex: 'create_time', is_list: true },
  { title: '操作', dataIndex: 'optional', width: 150, fixed: 'right', is_list: true }
])

onMounted(() => {
  initRoleData()
  initData()
})

const initData = async (params = {}) => {
  const res = await Api.list({ ...params })
  data.value = res.list
}

const initRoleData = async (params = {}) => {
  const res = await roleApi.list({ ...params })
  columns.value[1].options = res.options
}
</script>

<style scoped>

</style>