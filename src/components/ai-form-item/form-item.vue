<template>
  <template v-for="(r, index) in columns">

    <!-- 可视化字段 -->
    <a-form-item v-if="r[mode]" :label="r.title" :field="r.dataIndex" :class="[mode, r?.key]">

      <!-- 文本框 -->
      <a-input v-if="r.view_type === 'input'" v-model="formData[r.dataIndex]" :disabled="r.is_disabled"
        :placeholder="`请输入${r.title}`" allow-clear @input="change($event, r.dataIndex)" />

      <!-- 数字框 -->
      <a-input-number v-else-if="r.view_type === 'number'" v-model="formData[r.dataIndex]"
        :placeholder="`请输入${r.title}`" allow-clear @input="change($event, r.dataIndex)" />

      <!-- 浮点数框 -->
      <a-input-number v-else-if="r.view_type === 'float'" v-model="formData[r.dataIndex]" :precision="2"
        :placeholder="`请输入${r.title}`" allow-clear @input="change($event, r.dataIndex)" />

      <!-- 密码框 -->
      <a-input-password v-else-if="r.view_type === 'password'" v-model="formData[r.dataIndex]"
        :placeholder="`请输入${r.title}`" allow-clear :error="r?.error" @input="change($event, r.dataIndex)" />

      <!-- 下拉框 -->
      <a-select v-else-if="r.view_type === 'select'" v-model="formData[r.dataIndex]" :options="r?.options"
        :field-names="fieldNames(r.options, 'select')" :placeholder="`请选择${r.title}`" allow-clear
        @change="change($event, r.dataIndex)" />

      <!-- 树形框 -->
      <a-tree-select v-else-if="r.view_type === 'treeSelect'" v-model="formData[r.dataIndex]" :data="r?.options"
        :field-names="fieldNames(r.options, 'tree')" :placeholder="`请选择${r.title}`" allow-clear
        @change="change($event, r.dataIndex)" />

      <!-- 复选框 -->
      <a-checkbox-group v-else-if="r.view_type === 'checkbox'" v-model="formData[r.dataIndex]" :options="r.options"
        @change="change($event, r.dataIndex)" />

      <!-- 单选框 -->
      <a-radio-group v-else-if="r.view_type === 'radio'" v-model="formData[r.dataIndex]" :options="r.options"
        @change="change($event, r.dataIndex)" :type="r?.view_mode?.type" />

      <!-- 开关 -->
      <a-switch v-else-if="r.view_type === 'switch'" v-model="formData[r.dataIndex]" :checked-value="1"
        :unchecked-value="2" @input="change($event, r.dataIndex)" />

      <!-- 滑块 -->
      <a-slider v-else-if="r.view_type === 'slider'" v-model="formData[r.dataIndex]"
        @input="change($event, r.dataIndex)" />

      <!-- 文本域 -->
      <a-textarea v-else-if="r.view_type === 'textarea'" v-model="formData[r.dataIndex]" :placeholder="`请输入${r.title}`"
        :auto-size="r.view_mode?.autoSize ?? true" allow-clear @input="change($event, r.dataIndex)" />

      <!-- 富文本 -->
      <ai-wang-editor v-else-if="r.view_type === 'editor'" v-model="formData[r.dataIndex]"
        @change="change($event, r.dataIndex)" />

      <!-- 日期范围 -->
      <a-range-picker v-else-if="r.view_type === 'range'" v-model="formData[r.dataIndex]" />

      <!-- 日期选择 -->
      <a-date-picker v-else-if="r.view_type === 'date'" v-model="formData[r.dataIndex]" />

      <!-- 时间选择 -->
      <a-time-picker v-else-if="r.view_type === 'time'" v-model="formData[r.dataIndex]" />

      <!-- 上传图片 -->
      <ai-upload-image v-else-if="r.view_type === 'upimage'" v-model="formData[r.dataIndex]" :mode="r?.view_mode" />

      <!-- 上传文件 -->
      <ai-upload-file v-else-if="r.view_type === 'upfile'" v-model="formData[r.dataIndex]" :mode="r?.view_mode" />

      <!-- 字典组合框 -->
      <ai-dict v-else-if="r.view_type === 'dict'" v-model="formData[r.dataIndex]" :data-type="r.data_type"
        @input="change($event, r.dataIndex)" />

      <!-- 图标选择器 -->
      <ai-icon v-else-if="r.view_type === 'icon'" v-model="formData[r.dataIndex]"
        @input="change($event, r.dataIndex)" />

      <template v-if="r?.help" #help>
        <div>{{ r.help }}</div>
      </template>
    </a-form-item>
  </template>

</template>

<script setup>
import { ref, computed } from 'vue'

import aiDict from './components/dict.vue';

const emits = defineEmits(['update:data', 'change']);

const props = defineProps({
  mode: { type: String, default: () => 'is_edit' },
  data: { type: Object, default: () => { } },
  columns: { type: Array, default: () => [] },
})

const formData = computed({
  get() { return props.data },
  set(val) {
    props.data = val
    emits('update:data', val)
  }
})

const columns = computed({
  get() { return props.columns },
  set(val) { props.columns = val }
})

// 监听数据变化
const change = (val, key) => {
  emits('change', { key: key, value: val })
}

// 操作数据结构
const fieldNames = (options, type) => {
  let obj = {}, keys;
  switch (type) {
    case 'select':
      keys = {
        value: ['value', 'id', 'key'],
        label: ['label', 'name', 'title']
      }
      break
    case 'tree':
      keys = {
        key: ['key', 'value', 'id'],
        title: ['title', 'label', 'name'],
        children: ['children', 'child']
      }
      break
    default:
  }
  for (let key in keys) {
    let val = keys[key];
    obj[key] = val[0];
    if (!options?.length) { continue }
    for (let field in options[0] ?? {}) {
      if (val.indexOf(field) > -1) {
        obj[key] = field;
        break
      }
    }
  }
  return obj;
}

</script>

<style lang="scss" scoped>
.is_edit.PRI {
  display: none
}

.is_query {
  width: auto;
  min-width: 300px;
  padding: 0 6px;
}

.arco-btn-size-medium {
  padding: 0;
}
</style>