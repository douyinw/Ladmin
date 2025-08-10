<template>
    <component v-if="viewType('icon')" :is="data[key]" style="font-size: 18px;" />

    <a-switch v-else-if="viewType('switch')" v-model="data[key]" :checked-value="1" :unchecked-value="2"
        @change="switchChange" />

    <template v-else-if="viewType('upimage')">
        <a-image-preview-group infinite>
            <a-space v-if="Array.isArray(data?.[key])">
                <a-image v-for="(url, index) in data?.[key] ?? []" width="36" height="36" :src="url" show-loader />
            </a-space>
            <a-space v-else>
                <a-image width="36" height="36" :src="data?.[key]" show-loader />
            </a-space>
        </a-image-preview-group>
    </template>

    <a-tag v-else-if="viewType('radio')" :color="color">{{ output() }}</a-tag>

    <span v-else>{{ output() }}</span>

</template>
<script setup>
import { ref, computed } from 'vue'
import { queryTreeNode } from '@/assets/js/common';

const emits = defineEmits(['setup'])

const props = defineProps({
    data: { type: Object, default: {} },
    column: { type: Object, default: {} },
})

const key = ref(props.column.dataIndex);

const color = ref(null);
const colors = [
    'red', 'green', 'orangered', 'orange', 'gold', 'lime', 'cyan', 'blue', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'
];

// 视图类型
const viewType = (value) => {
    return props.column.view_type == value && props.data[key.value]?.length;
}

// 操作开关
const switchChange = (value) => {
    emits('setup', { [key.value]: value })
}

// 输出数据
const output = () => {
    const { dataIndex, extend_type, options } = props.column;
    const value = props.data[dataIndex];
    let result = null;
    switch (extend_type) {
        case 'dict':
            result = queryTreeNode(options, value, 'value');
            result = result?.label;
            color.value = colors[value];
            break
        case 'category':
            result = queryTreeNode(options, value, 'id');
            result = result?.name;
            break
        case 'data':
            result = queryTreeNode(options, value, 'value');
            result = result?.label;
            break
        default:

    }
    return result ?? value;
}

</script>
<style lang="scss" scoped>

:deep(.arco-space-item) {
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-medium);
    padding: 2px;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;

    &:hover {
        .arco-image-img {
            transition: all 0.3s ease;
            transform: scale(1.1);
        }
    }

}
</style>