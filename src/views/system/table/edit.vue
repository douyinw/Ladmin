<template>
  <a-tabs ref="tabsRef" v-model="activeKey" style="height: 100%" @change="handleTabClick">
    <!-- <template #extra>
      <a-button shape="circle" size="small" style="margin-right: 16px;"><icon-question /></a-button>
    </template> -->
    <a-tab-pane title="基础配置" key="1">
      <a-row :gutter="24" style="padding:16px;">
        <a-col :span="8" v-for="(row, index) in columns" :key="index">

          <a-form-item v-if="row.mode" :label="row.title" :name="row.dataIndex">
            <a-input v-if="row.view_type === 'input'" v-model="data.mode[row.dataIndex]" :disabled="row.is_disabled"
              :placeholder="`请输入${row.title}`" />
            <a-input-number v-else-if="row.view_type === 'number'" v-model="data.mode[row.dataIndex]"
              :placeholder="`请输入${row.title}`" />
            <a-radio-group v-else-if="row.view_type === 'radio'" v-model="data.mode[row.dataIndex]"
              :options="row.options" type="button" />
            <a-select v-else-if="row.view_type === 'select'" v-model="data.mode[row.dataIndex]" :options="row.options"
              :placeholder="`请输入${row.title}`" />
          </a-form-item>


          <a-form-item v-else :label="row.title" :name="row.dataIndex">
            <a-input v-if="row.view_type === 'input'" v-model="data[row.dataIndex]" :disabled="row.is_disabled"
              :placeholder="`请输入${row.title}`" />
            <a-input-number v-else-if="row.view_type === 'number'" v-model="data[row.dataIndex]"
              :placeholder="`请输入${row.title}`" />
            <a-radio-group v-else-if="row.view_type === 'radio'" v-model="data[row.dataIndex]" :options="row.options"
              type="button" />
            <a-select v-else-if="row.view_type === 'select'" v-model="data[row.dataIndex]" :options="row.options"
              :placeholder="`请输入${row.title}`" />
          </a-form-item>

        </a-col>
      </a-row>
    </a-tab-pane>

    <a-tab-pane title="字段配置" key="2">
      <ai-columns v-if="activeKey === '2'" v-model="data.columns" :tagsHeight="tagsHeight" :category-type="categoryType"
        :dict-type="dictType" @change="(val) => { data.columns = val }" />
      <a-form-item name="columns" style="display: none;" />
    </a-tab-pane>

    <a-tab-pane title="关联配置" key="3">
      <ai-rules v-model="data.rules" @change="(val) => { data.rules = val }" />
    </a-tab-pane>

    <a-tab-pane title="验证规则" key="4">
      <ai-rules v-model="data.rules" @change="(val) => { data.rules = val }" />
    </a-tab-pane>

    <a-tab-pane title="操作设置" key="5">
      <ai-buttons v-if="activeKey === '5'" v-model="data.buttons" :tagsHeight="tagsHeight" :category-type="categoryType"
        :dict-type="dictType" @change="(val) => { data.buttons = val }" />
    </a-tab-pane>

  </a-tabs>

  <div v-if="loading" class="loading"><a-spin :size="28" /></div>
</template>

<script setup>
import { ref,  watch } from 'vue'
import aiColumns from './components/columns.vue'
import aiButtons from './components/buttons.vue'
import aiRules from './components/rules.vue'
import * as vars from './config'

const props = defineProps({
  model: { type: Object, default: () => { } },
  categoryType: { type: Array, default: () => [] },
  dictType: { type: Array, default: () => [] },
})

const data = ref(props.model)
const tabsRef = ref(null)
const activeKey = ref(1)
const loading = ref(false)
const tagsHeight = ref(null)

const columns = ref([
  { title: '数据表', dataIndex: 'name', view_type: 'input', is_disabled: true, mode: false },
  { title: '应用模块', dataIndex: 'controller', view_type: 'input', mode: false },
  { title: '应用名称', dataIndex: 'comment', view_type: 'input', mode: false },
  { title: '表单宽度', dataIndex: 'width', view_type: 'number', mode: true },
  { title: '表单全屏', dataIndex: 'fullscreen', view_type: 'radio', options: vars.state, mode: true },
  { title: '表单样式', dataIndex: 'module', view_type: 'radio', options: vars.module, mode: true },
  { title: '操作表宽', dataIndex: 'option_width', view_type: 'number', mode: true },
  { title: '操作按钮', dataIndex: 'top_btn', view_type: 'radio', options: vars.show, mode: true },
  { title: '操作链接', dataIndex: 'right_btn', view_type: 'radio', options: vars.show, mode: true },
])

const handleTabClick = (val) => {
  loading.value = true
  setTimeout(() => {
    activeKey.value = val
    loading.value = false
    console.log(activeKey.value)
  }, 100)
  tagsHeight.value = tabsRef.value?.$el.offsetHeight - 115
}

</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
