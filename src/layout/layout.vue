<template>
  <a-layout class="layout-demo">
    <a-layout-sider style="width: none;">
      <ai-menu />
    </a-layout-sider>

    <a-layout style="overflow: hidden;">
      <a-layout-header>
        <ai-header />
      </a-layout-header>

      <a-layout class="main">

        <a-layout class="content">
          <a-layout-content>
            <router-view />
          </a-layout-content>
        </a-layout>

      </a-layout>

    </a-layout>

  </a-layout>
</template>

<script setup>
import aiHeader from './header.vue'
import aiMenu from './menu.vue'
import aiTags from './tags.vue'

</script>

<style lang="scss" scoped>
.layout-demo {
  height: 100%;

  .main {
    padding: 12px 0;
    color: var(--color-text-2);
    background: var(--color-neutral-2);
    overflow: hidden;
  }

  .content {
    padding: 2px 16px;
    background-color: transparent !important;
    overflow-x: hidden;
  }

  &:deep(.arco-layout-sider) {
    flex-direction: column;
    box-shadow: none;
  }

  &:deep(.arco-layout-header) {
    height: 60px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-bg-2);
  }

  &:deep(.arco-layout-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

[mine-skin=skin_a],
[mine-skin=skin_b],
[mine-skin=skin_c],
[mine-skin=skin_d],
[mine-skin=skin_e],
[mine-skin=skin_f] {
  .layout-demo {

    .arco-layout-header,
    .arco-layout-sider-light {
      background-color: transparent !important;
      border: 0;
    }

    .main {
      margin-right: 14px;
      border-radius: 12px 12px 0 0;
      border-radius: 12px 12px 0 0;
      background: var(--color-bg-2);
    }

    .content{
      padding:0 6px;
    }

  }
}

[mine-skin=concise] .layout-demo {

  background: rgb(var(--primary-6));

  .arco-layout-header,
  .arco-layout-sider-light {
    background-color: transparent !important;
    border: 0;
  }

}

[mine-skin=classics] .layout-demo {

  background: #222d32;

  .arco-layout-sider-light {
    background-color: transparent !important;
    border: 0;
  }

}
</style>
