<template>
    <a-space :class="appStore.config.skin">
        <a-breadcrumb>
            <a-breadcrumb-item v-for="(item, index) in appStore.tags" :key="item.key">
                <IconApps v-if="index == 0"/> {{ item.title }}
            </a-breadcrumb-item>
        </a-breadcrumb>
    </a-space>
    <a-space :size="20" :class="appStore.config.skin">
        <a-trigger trigger="click">
            <a-button shape="circle">
                <template #icon>
                    <!-- <a-badge :count="5" dot :dotStyle="{ width: '5px', height: '5px' }">
                        <icon-notification />
                    </a-badge> -->
                    <icon-notification />
                </template>
            </a-button>

            <template #content>
                <a-list :max-height="230"></a-list>
            </template>
        </a-trigger>

        <a-tooltip :content="appStore.config.mode === 'light' ? '暗色' : '亮色'" :mini="true">
            <a-button shape="circle" @click="handleTheme">
                <template #icon>
                    <icon-sun-fill v-if="appStore.config.mode === 'light'" />
                    <icon-moon v-else />
                </template>
            </a-button>
        </a-tooltip>

        <a-tooltip content="主题" :mini="true">
            <a-button shape="circle" @click="() => visible = true">
                <template #icon>
                    <icon-skin />
                </template>
            </a-button>
        </a-tooltip>

        <a-dropdown trigger="hover">
            <a-avatar shape="square" :size="32">
                <a-image width="30" height="30" :src="userStore.info?.avatar" :preview="false" />
            </a-avatar>
            <template #content>
                <a-doption value="userCenter" @click="userCenter"><icon-user /> 个人信息</a-doption>
                <a-doption value="clearCache" @click="clearCache"><icon-delete /> 清除缓存</a-doption>
                <a-divider style="margin: 5px 0" />
                <a-doption value="logout" @click="logout"><icon-poweroff /> 退出系统</a-doption>
            </template>
        </a-dropdown>
    </a-space>

    <set-theme v-model="visible"></set-theme>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import setTheme from './components/set-theme.vue'
import { useAppStore, useUserStore } from '@/store'
import { appApi } from '@/api/system';

const emits = defineEmits([''])
const props = defineProps({
    collapsed: {
        type: Boolean,
        default: () => false
    }
});

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const Api = appApi('system');

const visible = ref(false)

const handleTheme = () => {
    appStore.config.mode = appStore.config.mode === 'light' ? 'dark' : 'light'
    if (appStore.config.mode === 'dark') {
        appStore.config.skin = 'default'
    }
    appStore.setTheme()
}

//个人信息
const userCenter = () => {
    router.push({ name: 'center' })
};

// 清除缓存
const clearCache = () => {
    Api.post('clearCache', {});
}

// 退出登录
const logout = () => {
    router.push('/login?logout=yes');
};

</script>
<style lang="scss" scoped>
[mine-skin=concise] {

    .arco-btn-secondary,
    .arco-btn-secondary[type='button'],
    .arco-avatar {
        background-color: #0002;
        color: #fff;

        &:hover {
            background-color: #0004;
            color: #fff;
        }
    }
}

[mine-skin=skin_a],
[mine-skin=skin_b],
[mine-skin=skin_c],
[mine-skin=skin_d],
[mine-skin=skin_e],
[mine-skin=skin_f] {

    .arco-btn-secondary,
    .arco-btn-secondary[type='button'],
    .arco-avatar {
        background-color: #0001;
        color: #fff;

        &:hover {
            background-color: #0003;
            color: #fff;
        }
    }
}

.concise,
.skin_a,
.skin_b,
.skin_c,
.skin_d,
.skin_e,
.skin_f {

    :deep(.arco-breadcrumb-item),
    :deep(.arco-icon-apps) {
        color: rgba(255, 255, 255, 0.7);
        &:last-child {
            color: rgba(255, 255, 255, 0.9);
        }
    }
}

:deep(.arco-avatar) {
    background-color: var(--color-fill-3);
}
</style>
