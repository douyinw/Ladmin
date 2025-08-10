<template>
    <a-config-provider :update-at-scroll="true">
        <router-view></router-view>
    </a-config-provider>
</template>

<script setup>
import { useAppStore } from '@/store'
useAppStore().init()
console.log(`%c LAdmin %c v1.0 release %c`,
    "background: #35495E; padding: 2px; border-radius: 3px 0 0 3px; color: #fff;",
    `background: #7166f0; padding: 2px; border-radius: 0 3px 3px 0; color: #fff;`,
    "background: transparent")
</script>

<style lang="scss">
@import '@/assets/css/style.scss';
@import '@/assets/css/nprogress.css'
</style>
