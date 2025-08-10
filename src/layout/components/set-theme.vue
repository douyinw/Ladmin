<template>
    <a-drawer :width="400" :visible="modelValue" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
        <template #title>主题配置</template>
        <a-form ref="formRef" :model="formModel" style="margin-top: 20px;">
            <a-form-item label="主题色调" field="avatar">
                <a-space>
                    <a-color-picker v-model="formModel.color" size="mini" showPreset
                        @change="(val) => { formModel.color = val }" />
                    <div v-for="color in colors" class="colors" :style="{ backgroundColor: color }"
                        @click="() => { formModel.color = color }">
                    </div>
                </a-space>
                <template #help>
                    <div>设置主题颜色</div>
                </template>
            </a-form-item>
            <a-form-item label="主题皮肤" field="avatar">
                <a-select v-model="formModel.skin" allow-clear
                    @change="(val) => { if (val !== 'default') formModel.mode = 'light' }">
                    <a-option value="default">纯净</a-option>
                    <a-option value="concise">色彩</a-option>
                    <a-option value="classics">经典</a-option>
                    <a-option value="skin_a">晴空</a-option>
                    <a-option value="skin_b">青竹</a-option>
                    <a-option value="skin_c">松石</a-option>
                    <a-option value="skin_d">花火</a-option>
                    <a-option value="skin_e">沉墨</a-option>
                    <a-option value="skin_f">菖蒲</a-option>
                </a-select>
                <template #help>
                    <div>设置皮肤样式</div>
                </template>
            </a-form-item>
            <a-form-item label="菜单布局" field="avatar">
                <!-- <a-select v-model="formModel.layout" allow-clear>
                    <a-option value="classic">侧栏</a-option>
                    <a-option value="columns">分栏</a-option>
                </a-select> -->
                <a-radio-group v-model="formModel.layout"  type="button">
                    <a-radio value="classic">侧栏</a-radio>
                    <a-radio value="columns">分栏</a-radio>
                </a-radio-group>
                <template #help>
                    <div>设置菜单布局</div>
                </template>
            </a-form-item>
            <a-form-item label="黑夜模式" field="avatar">
                <a-space direction="vertical" size="large">
                    <a-switch v-model="formModel.mode" checked-value="dark" unchecked-value="light"
                        @change="(val) => { if (val === 'dark') formModel.skin = 'default' }" />
                </a-space>
                <template #help>
                    <div>设置显示模式</div>
                </template>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore } from '@/store'

const emits = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: () => false
    }
})

const appStore = useAppStore()
const formRef = ref()
const formModel = reactive(appStore.$state.config);
const colors = ref([
    '#7166f0',
    '#e84a6c',
    '#0d9496',
    '#0960be',
    '#4e69fd',
    '#43a047',
    '#344256',
    '#3f3f46',
])

watch(() => formModel, () => {
    appStore.setTheme()
}, { deep: true })


const handleOk = () => { }

const handleCancel = () => {
    emits('update:modelValue', false)
}

</script>

<style scoped lang="scss">
:deep(.arco-form-item) {
    margin: 5px 0;
}

.colors {
    width: 24px;
    height: 24px;
    background-image: conic-gradient(rgba(0, 0, 0, .06) 0 25%,
            transparent 0 50%, rgba(0, 0, 0, .06) 0 75%, transparent 0);
    background-size: 8px 8px;
    border-radius: 3px;
    cursor: pointer;
    transition: transform ease-out 60ms;
}

.colors:hover {
    transform: scale(1.1);
}
</style>
