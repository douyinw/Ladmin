<template>
    <a-col style="padding: 0 16px;">
        <a-table row-key="name" :data="data" :columns="columns" :pagination="false"
            :scroll="{ x: '100%', y: tagsHeight }" :bordered="{ wrapper: true, cell: true }"
            :draggable="{ title: '拖动', type: 'handle', width: 50 }" @change="handleChange">

            <template #columns>
                <template v-for="(row, index) in columns" :key="index">
                    <a-table-column align="center" v-if="row.is_list" :ellipsis="true" :tooltip="true"
                        :fixed="row.fixed" :title="row.title" :width="row.width" :dataIndex="row.dataIndex">

                        <template #title>
                            <div v-if="row.view_type === 'checkbox'" class="checkbox">
                                <a-checkbox :model-value="data.every(item => item[row.dataIndex])"
                                    @change="checkboxAll(row.dataIndex)" />
                                {{ row.title }}
                            </div>
                            <template v-else>
                                {{ row.title }}
                            </template>
                        </template>

                        <template #cell="{ record, rowIndex }">
                            <div v-if="row.view_type === 'text'">{{ record[row.dataIndex] }}</div>

                            <a-input v-else-if="row.view_type === 'input'" v-model="record[row.dataIndex]"
                                allow-clear />
                            <a-input-number v-else-if="row.view_type === 'number'" v-model="record[row.dataIndex]"
                                allow-clear />
                            <a-radio-group v-else-if="row.view_type === 'radio'" v-model="record[row.dataIndex]"
                                :options="row.options" type="button" />
                            <a-checkbox v-else-if="row.view_type === 'checkbox'" v-model="record[row.dataIndex]" />
                            <a-select v-else-if="row.view_type === 'select'" v-model="record[row.dataIndex]"
                                :options="row.options" placeholder="请选择" allow-clear
                                @change="changeSelect($event, row, record)" />
                            <a-button v-else-if="row.view_type === 'button'" @click="">{{ row.default_value
                            }}</a-button>

                            <template v-else>

                                <a-row v-if="['select', 'treeSelect', 'radio', 'checkbox'].includes(record.view_type)"
                                    :gutter="12" align="center">
                                    <a-col :span="12">
                                        <a-select v-model="record.extend_type" placeholder="请选择扩展" allow-clear
                                            :options="vars.extendType" @change="() => { record.extend_code = null }" />
                                    </a-col>
                                    <a-col :span="12">
                                        <a-select v-model="record.extend_code" placeholder="请选择标识" allow-clear
                                            :options="record.extend_type === 'dict' ? dictType : categoryType"
                                            :field-names="{ label: 'name', value: 'code' }" />
                                    </a-col>
                                </a-row>
                                <a-row v-else-if="['upfile', 'upimage'].includes(record.view_type)" :gutter="12"
                                    align="center">
                                    <a-col :span="12">
                                        <a-input-number v-model="record.view_mode.limit" placeholder="输入上传限制数量"
                                            allow-clear />
                                    </a-col>
                                    <a-col :span="8">
                                        <a-checkbox v-model="record.view_mode.multiple"
                                            @change="(val) => { record.view_mode.limit = val ? 2 : 1 }">多选模式</a-checkbox>
                                    </a-col>
                                </a-row>

                                <a-row v-else-if="['editor'].includes(record.view_type)" :gutter="12" align="center">
                                    <a-col :span="12">
                                        <a-input-number v-model="record.view_mode.height" placeholder="输入编辑框高度"
                                            allow-clear />
                                    </a-col>
                                </a-row>

                                <a-row v-else-if="['date'].includes(record.view_type)" :gutter="12" align="center">
                                    <a-col :span="12">
                                        <a-select v-model="record.view_mode.date_type" :options="vars.dateType"
                                            placeholder="请选择格式" allow-clear />
                                    </a-col>
                                    <a-col :span="8">
                                        <a-checkbox v-model="record.view_mode.show_time">显示时间</a-checkbox>
                                    </a-col>
                                </a-row>

                            </template>
                        </template>
                    </a-table-column>
                </template>
            </template>
        </a-table>
    </a-col>

</template>
<script setup>
import { ref } from 'vue'
import * as vars from '../config'

const emits = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    tagsHeight: { type: Number, default: 500 },
    categoryType: { type: Array, default: () => [] },
    dictType: { type: Array, default: () => [] },
})

const data = ref(props.modelValue ?? [])

const columns = ref([
    { title: '字段注释', dataIndex: 'title', view_type: 'input', width: 160, is_list: true, fixed: 'left' },
    { title: '字段名', dataIndex: 'dataIndex', view_type: 'text', is_list: true, width: 130, fixed: 'left' },
    { title: '数据类型', dataIndex: 'data_type', view_type: 'text', is_list: true, width: 130, is_list: true },
    { title: 'Json', dataIndex: 'is_json', view_type: 'checkbox', width: 100, is_list: true },

    { title: '表格宽度', dataIndex: 'width', view_type: 'number', width: 130, is_list: true },
    { title: '必填', dataIndex: 'is_required', view_type: 'checkbox', width: 100, is_list: true },
    { title: '表单', dataIndex: 'is_edit', view_type: 'checkbox', width: 100, is_list: true },
    { title: '列表', dataIndex: 'is_list', view_type: 'checkbox', width: 100, is_list: true },
    { title: '查询', dataIndex: 'is_query', view_type: 'checkbox', width: 100, is_list: true },
    { title: '查询方式', dataIndex: 'query_type', view_type: 'select', width: 140, options: vars.queryType, is_list: true },
    { title: '渲染组件', dataIndex: 'view_type', view_type: 'select', width: 160, options: vars.componentType, is_list: true },
    //{ title: '组件模式', dataIndex: 'setup', view_type: 'button', is_list: true, width: 100, default_value: '设置' },
    { title: '设置', dataIndex: 'extend', is_list: true, width: 300 },
])

// 全选切换方法
const checkboxAll = (field) => {
    const hasUnchecked = data.value.some(item => !item[field])
    data.value.forEach(item => item[field] = hasUnchecked)
}

// 选择组件
const changeSelect = (val, row, record) => {
    if (row.dataIndex === 'view_type') {
        if (!val?.length) {
            delete record.extend_type;
            delete record.extend_code;
            delete record.view_mode;
        } else {
            record.view_mode = {}
        }
    }
}

// 表格数据变化
const handleChange = (val) => {
    data.value = val
    emits('update:modelValue', val)
    emits('change', val)
}

</script>

<style lang="scss" scoped>
.config-table :deep(.arco-checkbox) {
    margin-right: 0;
}

.checkbox {
    min-width: 50px;
    display: flex;
    align-items: center;

    .arco-checkbox {
        padding: 0 4px;
    }

}
</style>