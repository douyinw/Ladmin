<template>
    <a-row class="container" align="start">
        <a-col :span="6" class="left-side">
            <a-row class="title">
                <div><icon-unordered-list /> 类别</div>
                <a-tooltip content="新增" :mini="true">
                    <a-button type="primary" size="mini" shape="circle" @click="handleForm('add')">
                        <template #icon><icon-plus /></template>
                    </a-button>
                </a-tooltip>
            </a-row>
            <a-row v-for="item in extendData" :class="['extend-item', item.id === selectedId ? 'active' : '']">
                <div class="name" @click="handleSelect(item)">{{ item.name }} ({{ item.code }})</div>
                <div class="btns">
                    <a-tooltip content="修改" :mini="true"><icon-edit @click="handleForm('edit', item)" /></a-tooltip>
                    <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleDel(item.id)">
                        <a-tooltip content="删除" :mini="true"><icon-delete /></a-tooltip>
                    </a-popconfirm>
                </div>
            </a-row>
        </a-col>

        <a-col :span="18" class="right-side" style="flex: 1;">
            <ai-list :data="selectedData" />
        </a-col>
    </a-row>

    <ai-form-model ref="formRef" :model="formModel" :columns="columns" @submit="handleSubmit" />

</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import aiList from './list.vue'
import { appApi } from '@/api/system'

const props = defineProps({
    controller: {
        type: String,
        default: null
    }
})

const Api = appApi('system.categorytype');

const formRef = ref(null)
const formModel = ref({})

const extendData = ref([])
const selectedId = ref(0)
const selectedData = ref({})
const currentAction = ref(null)

const columns = ref([
    { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
    { title: '类别名称', dataIndex: 'name', view_type: 'input', is_required: true, is_edit: true, is_list: true },
    { title: '类别标识', dataIndex: 'code', view_type: 'input', is_required: true, is_edit: true, is_query: true, is_list: true },
    { title: '应用名称', dataIndex: 'controller', view_type: 'input', is_disabled: true, is_required: true, is_edit: true, is_list: true },
    { title: '备注', dataIndex: 'remark', view_type: 'textarea', is_edit: true, is_list: true }
])

// 监听路由变化
watch(() => props.controller, (val) => {
    columns.value[3].default_value = val
}, { immediate: true })

// 初始化
onMounted(() => initData())

// 获取数据
const initData = async (params = {}) => {
    const res = await Api.get('list', { controller: props.controller, ...params })
    extendData.value = res ?? []
    if (res?.length) {
        handleSelect(res[0])
    }
}

// 选择分类
const handleSelect = (item) => {
    selectedId.value = item.id
    selectedData.value = item
}

// 创建表单
const handleForm = (key, data = {}) => {
    const title = { add: '新增', edit: '修改' }
    currentAction.value = key
    formModel.value = { ...data }
    formRef.value?.open({ title: title[key], module: 'a-modal', width: 500 })
}

// 表单提交
const handleSubmit = async (data) => {
    await Api[currentAction.value]({ controller: props.controller, ...data })
    formRef.value?.close()
    initData()
}

// 删除数据
const handleDel = async (id) => {
    await Api.delete({ id: id })
    initData()
}

</script>

<style lang="scss" scoped>
.container {
    flex: 1;
    height: calc(100% - 24px);
}

.title {
    padding: 0 16px;
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-neutral-2);
}

.left-side {
    height: 100%;
    min-width: 220px;
    max-width: 300px;
    margin: 12px 0 0 12px;
    overflow: hidden auto;
    background: var(--color-bg-2);
}

.right-side {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 12px 12px 0;
}

.extend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 12px 4px;
    padding: 0 10px;
    height: 38px;
    border-radius: var(--border-radius-small);

    &:hover {
        background-color: var(--color-fill-2);
        cursor: pointer;
    }

    &.active {
        background-color: var(--color-fill-2);
        color: rgb(var(--primary-6));
    }

    .name {
        flex: 1;
        line-height: 38px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .btns {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgb(var(--primary-6));

        :deep(.arco-icon:hover) {
            font-size: 16px;
            color: rgb(var(--primary-6));
        }
    }
}
</style>