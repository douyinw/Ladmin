<template>
  <component :body-style="{ overflow: 'hidden auto' }" :is="state.module" :title="state.title" :width="state.width"
    :fullscreen="Boolean(state.fullscreen)" v-model:visible="visible" :mask-closable="false" :ok-text="state.confirm"
    :cancel-text="state.cancel" :ok-loading="loading" @before-ok="handleOkSubmit" @cancel="close" unmount-on-close>
    <a-empty v-if="!columns?.length" />

    <a-form v-else ref="formRef" :model="formModel" :rules="formRules" auto-label-width @submit="handleSubmit">
      <ai-form-item :data="formModel" :columns="columns" @change="itemChange" />
      <a-form-item v-if="button">
        <a-space :size="12">
          <a-button type="primary" html-type="submit">{{ state.confirm }}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </component>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const emits = defineEmits([
  'update:visible',
  'submit',
  'formChange',
  'formItemChange'
])

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  columns: { type: Array, default: () => [] },
  rules: { type: Object, default: () => null },
  module: { type: String, default: 'a-modal' },
  title: { type: String, default: '表单' },
  width: { type: Number, default: 600 },
  fullscreen: { type: Number, default: 0 },
  confirm: { type: String, default: '提交' },
  cancel: { type: String, default: '取消' },
  visible: { type: Boolean, default: false },
  button: { type: Boolean, default: false },
})

const formRef = ref(null)
const formModel = ref({})
const columns = ref([])
const visible = ref(props.visible)
const loading = ref(false)

const state = reactive({
  module: props.module,
  title: props.title,
  width: props.width,
  fullscreen: props.fullscreen,
  confirm: props.confirm,
  cancel: props.cancel,
})

watch(() => props.columns, (val) => {
  columns.value = val ?? []
}, { immediate: true })

watch(() => props.model, (val) => {
  formModel.value = getFormData('is_edit', props.columns, { ...val })
}, { deep: true })

watch(() => formModel.value, (val) => {
  emits('formChange', val)
}, { deep: true })

const formRules = computed(() => {
  return props.rules || getRulesDate(props.columns)
})

const open = (config = {}) => {
  Object.assign(state, config)
  visible.value = true
}

const close = () => {
  formRef.value?.clearValidate()
  formModel.value = {}
  formRef.value = null
  loading.value = false
  visible.value = false
  emits('update:visible', false)
}

const handleOkSubmit = async (done) => {
  validate(formModel.value)
  done(false)
}

const handleSubmit = async ({ values, errors }) => {
  validate(values)
}

const itemChange = async ({ key, value }) => {
  columns.value.forEach(r => r.dataIndex === key && (r.error = false))
  await formRef.value?.validateField(key)
  emits('formItemChange', { key, value })
}

const validate = async (data) => {
  try {
    loading.value = true
    const errors = await formRef.value?.validate()
    if (!errors) {
      emits('submit', undefToNull(data))
      return true
    }
    return false
  } catch {
    return false
  } finally {
    loading.value = false
  }
}

const getRulesDate = (columns) => {
  return columns.reduce((res, col) => {
    if (col.is_required === true) {
      res[col.dataIndex] = [{
        required: true,
        message: col.title + '不能为空'
      }]
    }
    return res
  }, {})
}

const undefToNull = (data) => {
  Object.keys(data).forEach(k => {
    if (data[k] === undefined) data[k] = null
  })
  return data
}

const setFormDate = (data) => Object.assign(formModel.value, data)

const setFields = (data) => Object.assign(formModel.value, data)

const getFormData = (edit, columns, data = {}) =>
  columns.reduce((res, col) => {
    if (col[edit]) {
      res[col.dataIndex] = data[col.dataIndex] ?? col.default_value
    }
    return res
  }, {})

defineExpose({
  open,
  close,
  columns,
  formModel,
  setFields,
  setFormDate,
  getFormData,
  getRulesDate
})
</script>

<style lang="scss" scoped>
:deep(.arco-form-item-label) {
  font-weight: 500;
  color: #1d2129;
}

:deep(.arco-form-item) {
  margin-bottom: 18px;
}

:deep(.arco-modal-title) {
  font-size: 16px;
  font-weight: 600;
}
</style>