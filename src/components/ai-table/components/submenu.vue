<template>
    <template v-for="b in data">
        <template v-if="b.children?.length">
            <a-dsubmenu :value="b.key" trigger="hover">
                <template #default>{{ b.title }}</template>
                <template #content>
                    <ai-submenu :rowKey="b.key" :data="b.children" />
                </template>
                <template #footer>
                    <div class="label">菜单</div>
                </template>
            </a-dsubmenu>
        </template>

        <template v-else-if="b.options?.length">
            <a-dsubmenu :value="b.key" trigger="hover">
                <template #default>{{ b.title }}</template>
                <template #content>
                    <a-doption v-for="p in b.options" @click="handleSelect(b.key, p.value)">
                        {{ p.label }}
                    </a-doption>
                </template>
                <template #footer>
                    <div class="label">操作</div>
                </template>
            </a-dsubmenu>
        </template>

        <a-doption v-else @click="handleSelect(rowKey, b)">
            <template #icon>
                <component v-if="b?.icon" :is="b.icon" />
            </template>
            {{ b.title }}
        </a-doption>
    </template>
</template>
<script setup>
import { ref } from 'vue'
import aiSubmenu from './submenu.vue'

const emits = defineEmits(['select'])
const props = defineProps({
    rowKey: { type: String, default: '' },
    data: { type: Array, default: [] },
})

const data = ref(props.data ?? [])

const handleSelect = (key, item) => {
    let obj = null
    if (!key?.length) return
    if (typeof item !== 'object') {
        obj = { [key]: item ?? null }
    }
    emits('select', { key: key, data: obj })
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