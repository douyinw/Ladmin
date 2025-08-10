<template>
    <a-space :size="4">
        <template v-for="b in links">
            <a-dropdown v-if="b?.children?.length">
                <a-link :type="b?.type" :status="b?.status" :size="b?.size">
                    <component v-if="b?.icon" :is="b.icon" />{{ b?.title }}
                </a-link>
                <template #content>
                    <ai-submenu v-if="b?.children?.length" :rowKey="b?.key" :data="b.children"
                        @select="handleSubmenuSelect" />
                </template>
                <template #footer>
                    <div class="label">菜单</div>
                </template>
            </a-dropdown>

            <a-dropdown v-else-if="b.options?.length">
                <a-link :type="b?.type" :status="b?.status" :size="b?.size">
                    <component v-if="b?.icon" :is="b.icon" />{{ b?.title }}
                </a-link>
                <template #content>
                    <a-doption v-for="p in b.options" @click="handleSelect(b.key, p.value)">
                        {{ p.label }}
                    </a-doption>
                </template>
                <template #footer>
                    <div class="label">操作</div>
                </template>
            </a-dropdown>

            <a-popconfirm v-else-if="b?.key == 'delete'" content="确定要删除数据吗?" position="bottom"
                @ok="handleSelect(b.key)">
                <a-link :type="b?.type" :status="b?.status" :size="b?.size">
                    <component v-if="b?.icon" :is="b.icon" />{{ b?.title }}
                </a-link>
            </a-popconfirm>

            <a-link v-else :type="b?.type" :status="b?.status" :size="b?.size" @click="handleSelect(b.key)">
                <component v-if="b?.icon" :is="b.icon" />{{ b?.title }}
            </a-link>
        </template>
    </a-space>
</template>
<script setup>
import { computed } from 'vue'
import aiSubmenu from './submenu.vue'

const emits = defineEmits(['operate'])

const props = defineProps({
    data: { type: Object, default: {} },
    column: { type: Object, default: {} },
    links: { type: Array, default: [] },
})

const links = computed(() => {
    const res = props.links.filter(b => b.float === 'right');
    return res?.length ? res : [
        { key: 'edit', title: '编辑', type: 'text', status: "", icon: 'icon-edit', size: 'small' },
        { key: 'delete', title: '删除', type: 'text', status: "danger", icon: 'icon-delete', size: 'small' }
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

</script>

<style scoped>
.label {
    padding: 8px;
    text-align: center;
    color: var(--color-text-2);
    background-color: var(--color-fill-2);
}
</style>