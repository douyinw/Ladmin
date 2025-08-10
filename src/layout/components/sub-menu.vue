<template>
  <template v-for="item in menus" :key="item.key">
    <!-- 有子菜单的情况 -->
    <a-sub-menu v-if="item.children?.length" :key="item.key" :title="item.title">
      <template #icon v-if="item.icon">
        <component :is="item.icon" style="font-size: 18px;" />
      </template>

      <!-- 递归调用自身 -->
      <sub-menu :menus="item.children" />
    </a-sub-menu>

    <!-- 无子菜单的菜单项 -->
    <a-menu-item v-else :key="item.key">
      <template #icon v-if="item.icon">
        <component :is="item.icon" style="font-size: 18px;" />
      </template>
      {{ item.title }}
    </a-menu-item>
  </template>
</template>

<script setup>
import subMenu from './sub-menu.vue'
const props = defineProps({
  menus: {
    type: Array,
    default: () => []
  }
})
</script>