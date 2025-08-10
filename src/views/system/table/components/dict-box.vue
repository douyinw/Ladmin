<template>
    <a-row align="end">

        <a-table v-if="data?.length" :data="data" :columns="columns" size="mini" :show-header="false" :bordered="false"
            :pagination="false" :scrollbar="false" :draggable="{}" @change="handleChange">
            <template #drag>
                <div class="cell">
                    <a-button size="mini" shape="circle" style="cursor: move;">
                        <template #icon> <icon-drag-arrow /></template>
                    </a-button>
                </div>
            </template>
            <template #label="{ rowIndex }">
                <div class="cell"><a-input v-model="data[rowIndex].label" placeholder="输入标签" allow-clear /></div>
            </template>
            <template #value="{ rowIndex }">
                <div class="cell">
                    <a-input-number v-if="props.dataType === 'number'" v-model="data[rowIndex].value" placeholder="输入数值"
                        allow-clear />
                    <a-input v-else v-model="data[rowIndex].value" placeholder="输入文本值" allow-clear />
                </div>
            </template>
            <template #optional="{ rowIndex }">
                <div class="cell">
                    <a-button size="mini" type="primary" status="danger" shape="circle" @click="handleDel(rowIndex)">
                        <template #icon><icon-delete /></template>
                    </a-button>
                </div>
            </template>
        </a-table>
        <div :style="{ marginBottom: data?.length ? '10px' : '0' }">
            <a-tooltip content="新增" :mini="true">
                <a-button size="mini" type="primary" shape="circle" @click="handleAdd">
                    <template #icon><icon-plus /></template>
                </a-button>
            </a-tooltip>
        </div>
    </a-row>
</template>
<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    dataType: { type: String, default: 'input' }
})

const data = ref([])

watch(() => props.modelValue, (val) => {
    data.value = Array.isArray(val) ? val : []
}, { immediate: true })

watch(() => data.value, (val) => {
    emits('update:modelValue', val)
}, { deep: true })

watch(() => props.dataType, (val) => {
    data.value.forEach(r => (r.value = null))
})

// 字段配置
const columns = [
    { title: 'Label', dataIndex: 'label', slotName: 'label', width: 150, view_type: 'input' },
    { title: 'Value', dataIndex: 'value', slotName: 'value', width: 150, view_type: 'input' },
    { title: 'drag', dataIndex: 'drag', slotName: 'drag', width: 30, view_type: 'input' },
    { title: '操作', dataIndex: 'optional', slotName: 'optional', width: 30, fixed: 'right' }
]

const handleAdd = () => {
    data.value.push({ label: null, value: null })
}

const handleDel = (index) => {
    data.value.splice(index, 1)
}

const handleChange = (val) => {
    data.value = val
}

</script>

<style lang="scss" scoped>
:deep(.arco-table-td) {
    line-height: 34px;
    text-align: center;
    background-color: transparent;
    border: 0;

    .cell {
        width: auto;
        height: auto;
        padding: 0 10px 4px 0;
        background-color: var(--color-bg-3);
    }
}

:deep(.arco-table-size-mini .arco-table-cell) {
    padding: 0;
}
</style>