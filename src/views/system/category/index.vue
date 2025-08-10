<template>
    <a-layout>
        <ai-table :app-api="Api" :data="data" :columns="columns" :buttons="buttons" :pagination="{}"
            :rowSelection="{}" @search="initData" @refresh="initData" @operate="handleOperate" />

        <a-modal width="90%"
            :body-style="{ padding: '12px', height: 'calc(100vh - 200px)', overflow: 'hidden auto', backgroundColor: 'var(--color-neutral-2)'
            , borderRadius:'0 0 6px 6px' }"
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

const Api = appApi('system.categorytype');

// 响应式数据
const data = ref([])
const selectedData = ref({})
const modalVisible = ref(false)

// 字段配置
const columns = [
    { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
    { title: '类别名称', dataIndex: 'name', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
    { title: '类别标识', dataIndex: 'code', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
    { title: '应用名称', dataIndex: 'controller', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
    { title: '备注', dataIndex: 'remark', view_type: 'textarea', is_edit: true, is_list: true },
    { title: '操作', dataIndex: 'optional', width: 200, fixed: 'right', is_list: true }
]

// 操作配置
const buttons = [
    { key: 'join', title: '数据', float: 'right', type: 'text', status: "", icon: 'IconOrderedList', size: 'small' },
    { key: 'edit', title: '编辑', float: 'right', type: 'text', status: "", icon: 'icon-edit', size: 'small' },
    { key: 'delete', title: '删除', float: 'right', type: 'text', status: "danger", icon: 'icon-delete', size: 'small' }
];

// 初始化
onMounted(() => initData())

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

<style scoped>

</style>