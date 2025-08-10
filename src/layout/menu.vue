<template>
    <template v-if="appStore.config.layout == 'classic'">
        <div class="logo">
            <img shape="square" src="../../public/vite.svg" />
            <span v-if="!reveal">LAdmin</span>
        </div>
        <div class="menu-list">
            <a-menu :style="{ width: '220px' }" :selected-keys="[selectedKey]" :auto-open-selected="true"
                :collapsed="reveal" show-collapse-button @menu-item-click="handleMenuClick"
                @collapse="(val) => { reveal = val }">
                <sub-menu :menus="menuData" />
            </a-menu>
        </div>
    </template>

    <template v-else>
        <div :class="['menu-columns', subMenuData ? 'showRight' : 'hideRight']">
            <div class="menu-left">
                <div class="logo" style="border: 0;">
                    <img shape="square" src="../../public/vite.svg" />
                </div>
                <template v-for="(item, index) in menuData" :key="item.key">
                    <div :class="['menu-item', indexId === index ? 'active' : '']" @click="handleClick(item, index)">
                        <component v-if="item.icon" :is="item.icon" class="icon" />
                        <div class="name"> {{ item.title }}</div>
                    </div>
                </template>
            </div>

            <div class="menu-right">
                <div class="columns">
                    <span v-if="!reveal">LAdmin</span>
                    <span v-else class="span">L</span>
                </div>
                <a-menu :style="{ width: '180px' }" :selected-keys="[selectedKey]" :auto-open-selected="true"
                    :collapsed="reveal" show-collapse-button @menu-item-click="handleMenuClick"
                    @collapse="(val) => { reveal = val }">
                    <sub-menu :menus="subMenuData" />
                </a-menu>
            </div>
        </div>
    </template>

</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import subMenu from './components/sub-menu.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useMenuStore } from '@/store'
import storage from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const reveal = ref(false);
const subMenuData = ref(null);
const indexId = ref(-1);

const menuData = computed(() => {
    return useMenuStore().menus
})

const selectedKey = computed(() => route.path)

watch(() => reveal.value, (val) => {
    console.log(val);
    storage.set('menuReveal', val);
})

onMounted(() => {
    indexId.value = storage.get('menuIndex');
    reveal.value = storage.get('menuReveal');
    if (indexId.value >= 0) {
        subMenuData.value = menuData.value[indexId.value].children || null;
    }
})

// 分栏菜单点击处理
const handleClick = (e, i) => {
    indexId.value = i;
    if (e.children?.length) {
        subMenuData.value = e.children;
    } else {
        subMenuData.value = null;
        router.push(e.key);
    }
    storage.set('menuIndex', i);
}

// 菜单点击处理
const handleMenuClick = (key) => {
    storage.set('menuKey', key);
    router.push(key);
}

</script>

<style lang="scss" scoped>
:deep(.arco-menu) {
    height: 100%;
}

:deep(.arco-menu-inner) {
    padding-top: 8px;
}

:deep(.arco-menu-collapsed) {
    width: 66px;
}

:deep(.arco-menu-vertical .arco-menu-inner) {
    padding: 4px 12px;
}

.menu-columns {
    height: 100%;
    display: flex;
}

.menu-left {
    width: 56px;
    padding: 0 8px 10px;
    text-align: center;
    // background: var(--color-bg-1);
}

.showRight {

    .menu-right {
        display: block;
    }
}

.hideRight {
    .menu-left {
        background-color: transparent !important;
    }

    .menu-right {
        display: none;
    }
}

.menu-item {
    width: 56px;
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    border-radius: 6px;
    color: var(--color-text-2);
    fill: var(--color-text-2);
    cursor: pointer;

    &:hover,
    &.active {
        background: rgb(var(--primary-1));
        color: rgb(var(--primary-6));
    }

    .name {
        font-size: 13px;
        line-height: 20px;
        display: flex;
        justify-content: center;
        white-space: nowrap;
    }

    .icon {
        line-height: 22px;
        font-size: 22px;
    }
}

.logo,
.columns {
    max-width: 300px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-1);

    span {
        margin-left: 10px;
        font-size: 20px;
        font-weight: 500;
    }

    .span {
        width: 100%;
        margin: 0;
        text-align: center;
    }
}

.columns {
    font-weight: 550;
    padding-left: 5px;
    justify-content: start;
}

[mine-skin=default] {

    .menu-list,
    .menu-right {
        height: calc(100% - 61px);
    }

    .menu-left {
        border-right: 1px solid var(--color-border-1);
    }

    .logo,
    .columns {
        border-bottom: 1px solid var(--color-border-1);
    }
}

[arco-theme=dark][mine-skin=default] {

    .menu-item {
        color: var(--color-text-2);

        &:hover,
        &.active {
            background: rgba(255, 255, 255, 0.2);
            color: rgb(var(--primary-6));
        }
    }
}

[mine-skin=classics] {
    .menu-left {
        background: #0003;
    }

    .menu-item {
        color: rgb(var(--primary-1));

        &:hover,
        &.active {
            background: rgb(var(--primary-6));
            color: rgb(var(--primary-1));
        }
    }

    .logo,
    .columns {
        color: #fff;
    }

}

[mine-skin=concise] {
    .menu-left {
        background: rgb(var(--primary-6));
    }

    .menu-item {
        color: rgb(var(--primary-1));

        &:hover,
        &.active {
            background: rgb(var(--primary-5));
            color: rgb(var(--primary-1));
        }
    }

    .logo,
    .columns {
        color: rgb(var(--primary-1));
    }
}


[mine-skin=concise],
[mine-skin=classics] {

    .menu-list,
    .menu-right {
        height: calc(100% - 60px);
    }
}

[mine-skin=skin_a],
[mine-skin=skin_b],
[mine-skin=skin_c],
[mine-skin=skin_d],
[mine-skin=skin_e],
[mine-skin=skin_f] {

    .menu-list,
    .menu-right {
        height: calc(100% - 60px);
    }

    .menu-left {
        background: #0001;
    }

    .menu-item {
        color: #fff;

        &:hover,
        &.active {
            background: #fff3;
            color: #fff;
        }
    }

    .logo img {
        width: 32px;
        height: 32px;
    }

    .logo,
    .columns {
        color: rgb(var(--primary-1));
    }
}
</style>