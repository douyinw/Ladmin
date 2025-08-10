<template>
    <a-row justify="space-between" align="end" style="margin-bottom: 12px;">
        <a-space class="list-btn">
            <template v-for="b in buttons">

                <a-dropdown v-if="b?.children?.length">
                    <a-button :type="b?.type" :status="b?.status" :size="b?.size">
                        <template #icon>
                            <component v-if="b?.icon" :is="b.icon" />
                        </template>
                        {{ b?.title }}
                    </a-button>
                    <template #content>
                        <ai-submenu v-if="b?.children?.length" :rowKey="b?.key" :data="b.children"
                            @select="handleSubmenuSelect" />
                    </template>
                    <template #footer>
                        <div class="label">菜单</div>
                    </template>
                </a-dropdown>

                <a-dropdown v-else-if="b.options?.length">
                    <a-button :type="b?.type" :status="b?.status" :size="b?.size">
                        <template #icon>
                            <component v-if="b?.icon" :is="b.icon" />
                        </template>
                        {{ b?.title }}
                    </a-button>
                    <template #content>
                        <a-doption v-for="p in b.options" @click="handleSelect(b.key, p.value)">
                            {{ p.label }}
                        </a-doption>
                    </template>
                    <template #footer>
                        <div class="label">操作</div>
                    </template>
                </a-dropdown>

                <a-popconfirm v-else-if="b?.key == 'dels'" content="确定要删除数据吗?" position="bottom"
                    @ok="handleSelect(b.key)">
                    <a-button :type="b?.type" :status="b?.status" :size="b?.size">
                        <template #icon>
                            <component v-if="b?.icon" :is="b.icon" />
                        </template>
                        {{ b?.title }}
                    </a-button>
                </a-popconfirm>

                <a-button v-else :type="b?.type" :status="b?.status" :size="b?.size" @click="handleSelect(b.key)">
                    <template #icon>
                        <component v-if="b?.icon" :is="b.icon" />
                    </template>
                    {{ b?.title }}
                </a-button>
            </template>

            <template v-if="hasChildren">
                <a-button @click="handleExpandAll">
                    <template #icon>
                        <icon-shrink v-if="expand" /><icon-expand v-else />
                    </template>{{ expand ? '收起' : '展开' }}
                </a-button>
            </template>
        </a-space>

        <a-space>
            <a-tooltip content="刷新表格" @click="handleRefresh()">
                <a-button shape="circle"><icon-refresh /></a-button>
            </a-tooltip>
            <a-tooltip :content="hideSearch ? '显隐搜索' : '显示搜索'">
                <a-button shape="circle" @click="handleHideSearch"><icon-search /></a-button>
            </a-tooltip>
            <a-tooltip content="打印表格">
                <a-button shape="circle" @click="handlePrint"><icon-printer /></a-button>
            </a-tooltip>
        </a-space>
    </a-row>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import aiSubmenu from './submenu.vue'

const emits = defineEmits(['operate', 'refresh', 'expand', 'hide', 'print'])
const props = defineProps({
    buttons: { type: Array, default: [] },
    expandAll: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
})

const expand = ref(false)
const hideSearch = ref(false)

// 监听数据变化
watch(() => props.expandAll, (val) => {
    expand.value = val;
}, { immediate: true });

watch(() => props.hideSearch, (val) => {
    hideSearch.value = val;
}, { immediate: true });

const buttons = computed(() => {
    const res = props.buttons.filter(b => b.float === 'top');
    return res?.length ? res : [
        { key: 'add', title: '新增', type: 'primary', icon: 'icon-plus' },
        { key: 'dels', title: '删除', type: 'primary', status: "danger", icon: 'icon-delete' }
    ]
})

// 下拉选择
const handleSelect = (key, item) => {
    let obj = null
    if (!key?.length) return
    if (typeof item !== 'object') {
        obj = { [key]: item ?? null }
    }
    emits('operate', { key: key, data: obj })
}

// 子菜单选择
const handleSubmenuSelect = (data) => {
    emits('operate', data)
}

// 展开收起
const handleExpandAll = () => {
    expand.value = !expand.value;
    emits('expand', expand.value)
}

// 刷新数据
const handleRefresh = () => {
    emits('refresh')
}

// 显示搜索
const handleHideSearch = () => {
    hideSearch.value = !hideSearch.value;
    emits('hide', hideSearch.value)
}

// 打印数据
const handlePrint = () => {
    emits('print', true)
}

</script>

<style scoped>
.list-btn :deep(.arco-btn-primary) {
    padding: 0 10px;
}

.label {
    padding: 8px;
    text-align: center;
    color: var(--color-text-2);
    background-color: var(--color-fill-2);
}
</style>