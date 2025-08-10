<template>
    <a-col style="padding: 0 16px;">
        <a-space style="margin-bottom: 12px;">
            <a-button @click="handleAdd()" type="primary" size="small" style="padding: 0 10px;">
                <template #icon><icon-plus /></template> 新增
            </a-button>
            <a-button @click="handleBase" size="small" style="padding: 0 10px;">
                导入
            </a-button>
        </a-space>

        <a-table ref="tableRef" rowKey="id" :columns="columns" :data="data" :pagination="false"
            :default-expand-all-rows="true" :bordered="{ wrapper: true, cell: true }"
            :scroll="{ x: '100%', y: tagsHeight - 40 }" :draggable="{ title: '拖动', type: 'handle', width: 50 }"
            @change="handleChange">
            <template #columns>
                <template v-for="(row, index) in columns" :key="index">
                    <a-table-column :ellipsis="true" :tooltip="row.tooltip" align="center" :width="row.width"
                        :title="row.title" :fixed="row.fixed" :dataIndex="row.dataIndex">
                        <template #cell="{ record, rowIndex }">

                            <a-input v-if="row.view_type === 'input'" v-model="record[row.dataIndex]"
                                :placeholder="`请输入${row.title}`" allow-clear />

                            <a-radio-group v-else-if="row.view_type === 'radio'" v-model="record[row.dataIndex]"
                                :options="row.options" type="button" />

                            <a-select v-else-if="row.view_type === 'select'" v-model="record[row.dataIndex]"
                                :options="row.options" :placeholder="`请选择${row.title}`" />

                            <ai-icon v-else-if="row.view_type === 'icon'" v-model="record[row.dataIndex]" />

                            <template v-else-if="row.dataIndex === 'optional'">
                                <a-space>
                                    <a-tooltip content="请求参数" :mini="true">
                                        <a-link type="primary" @click="DICT.open(record)">
                                            <IconSettings />设置
                                        </a-link>
                                    </a-tooltip>
                                    <a-tooltip content="子节点" :mini="true">
                                        <a-link type="primary" @click="handleAdd(record)"><icon-plus />添加</a-link>
                                    </a-tooltip>
                                    <a-link type="primary" status="danger"
                                        @click="handleDel(record)"><icon-delete />删除</a-link>
                                </a-space>
                            </template>

                        </template>
                    </a-table-column>
                </template>
            </template>
        </a-table>
    </a-col>

    <a-modal v-model:visible="DICT.visible" width="500" unmount-on-close>
        <template #title>{{ DICT.data.title }}::参数</template>
        <a-form-item label="数据类型">
            <a-radio-group v-model="DICT.type" type="button" size="small">
                <a-radio value="number">数型</a-radio>
                <a-radio value="input">文本型</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="请求参数">
            <ai-dict v-model="DICT.data[DICT.key]" :data-type="DICT.type" />
        </a-form-item>
    </a-modal>

    <a-form-item name="buttons" style="display: none;" />
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import aiDict from './dict-box.vue';
import * as vars from '../config'

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    tagsHeight: { type: Number, default: 500 },
    categoryType: { type: Array, default: () => [] },
    dictType: { type: Array, default: () => [] },
})

const data = ref(props.modelValue ?? [])

const tableRef = ref(null)

const columns = [
    { title: '标签', dataIndex: 'title', view_type: 'input', width: 200, },
    { title: '标识', dataIndex: 'key', view_type: 'input', width: 200, },
    { title: '图标', dataIndex: 'icon', view_type: 'icon', width: 260 },
    {
        title: '组件', dataIndex: 'float', view_type: 'radio', width: 150,
        options: [
            { label: "按钮", value: "top" },
            { label: "链接", value: "right" }
        ]
    },
    {
        title: '样式', dataIndex: 'type', view_type: 'select', width: 150,
        options: [
            { label: "主要", value: "primary" },
            { label: "次要", value: "secondary" },
            { label: "虚线", value: "dashed" },
            { label: "线形", value: "outline" },
            { label: "文字", value: "text" }
        ]
    },
    {
        title: '颜色', dataIndex: 'status', view_type: 'select', width: 150,
        options: [
            { label: "默认", value: "normal" },
            { label: "主色", value: "success" },
            { label: "黄色", value: "warning" },
            { label: "红色", value: "danger" },
        ]
    },
    {
        title: '大小', dataIndex: 'size', view_type: 'select', width: 150,
        options: [
            { label: "迷你", value: "mini" },
            { label: "小", value: "small" },
            { label: "中", value: "medium" },
            { label: "大", value: "large" }
        ]
    },
    { title: '操作', dataIndex: 'optional', width: 200, fixed: 'right', is_list: true }
]


watch(() => data.value, (val) => {
    handleChange(val)
}, { deep: true })

const handleChange = (val) => {
    data.value = val
    emits('update:modelValue', val)
}

const handleBase = () => {
    data.value = JSON.parse(JSON.stringify(vars.buttons))
}

// 添加节点
const handleAdd = (node = null) => {
    const id = Date.now().toString(36);
    const newNode = {
        id: id,
        key: '',
        title: '新节点',
        icon: '',
        float: '',
        type: '',
        status: '',
        size: '',
    }
    if (!node) {
        data.value.push(newNode)
    } else {
        node.children = node.children ?? []
        node.children.push(newNode)
    }

    // tableRef.value.expandAll()
}

// 删除节点
const handleDel = (node) => {
    const deleteNode = (tree, target) => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i] === target) {
                tree.splice(i, 1);
                return true;
            }
            if (tree[i]?.children?.length) {
                if (deleteNode(tree[i].children, target)) {
                    if (tree[i].children.length === 0) {
                        delete tree[i].children;
                    }
                    return true;
                }
            }
        }
        return false;
    };

    deleteNode(data.value, node);
}

// 字典参数配置
const DICT = reactive({
    key: null,
    data: null,
    type: null,
    visible: false,
    open: (node, key = 'options') => {
        DICT.key = key;
        DICT.type = 'input';
        node[key] = node[key] ?? [];
        node[key].forEach(m => {
            if (typeof m.value == "number") {
                DICT.type = 'number';
            }
        })
        DICT.data = node;
        DICT.visible = true
    }
})

</script>
<style scoped lang="scss"></style>