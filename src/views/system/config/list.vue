<template>
  <a-modal v-model:visible="visible" width="90%" unmount-on-close :footer="false" :modal-style="{ maxWidth: '1200px' }"
    :body-style="{ padding: '16px', height: 'calc(100vh - 200px)', overflow: 'hidden auto' }">
    <template #title>{{ props.data.name }}</template>

    <a-col>
      <a-space>
        <a-button type="primary" size="small" @click="handleAdd('add')">
          <template #icon><icon-plus /></template>新增
        </a-button>
      </a-space>
      <a-table ref="tableRef" rowKey="id" :columns="columns" :data="data" :pagination="false"
        :default-expand-all-rows="true" :bordered="{ wrapper: true, cell: true }" :scroll="{ x: '100%' }"
        :draggable="{ title: '拖动', type: 'handle', width: 50 }" @change="handleChange">
        <template #columns>

          <template v-for="(row, index) in columns" :key="index">
            <a-table-column v-if="row.is_list !== false" :ellipsis="true" :tooltip="true" align="center"
              :width="row.width" :title="row.title" :fixed="row.fixed" :dataIndex="row.dataIndex">

              <template #cell="{ record, rowIndex }">

                <template v-if="row.dataIndex === 'optional'">
                  <a-space>
                    <a-link type="primary" @click="handleEdit(record)"><icon-edit />编辑</a-link>
                    <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleDel(rowIndex)">
                      <a-link type="primary" status="danger"><icon-delete />删除</a-link>
                    </a-popconfirm>
                  </a-space>
                </template>

                <template v-else>
                  {{ getValueLabel(record, row) }}
                </template>

              </template>
            </a-table-column>
          </template>

        </template>
      </a-table>

    </a-col>
  </a-modal>

  <ai-form-model ref="formRef" :model="formModel" :columns="columns" @submit="handleSubmit"
    @formItemChange="handleformat($event, true)" />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { appApi } from '@/api/system'

const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: () => { } },
})

const Api = appApi('system.config')

const data = ref([])
const formRef = ref(null)
const formModel = ref({})

const config =[
  { title: '排序', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true, is_list: false },
  { title: '标签名称', dataIndex: 'title', view_type: 'input', is_edit: true },
  { title: '字段标识', dataIndex: 'dataIndex', view_type: 'input', is_edit: true },
  {
    title: '渲染组件', dataIndex: 'view_type', view_type: 'select', is_edit: true,
    default_value: '', extend_type: 'dict', options: [
      { label: '文本框', value: 'input' }, { label: '数字框', value: 'number' },
      { label: '下拉框', value: 'select' }, { label: '单选框', value: 'radio' },
      { label: '字典框', value: 'dict' }, { label: '开关', value: 'switch' },
      { label: '滑块', value: 'slider' }, { label: '文本域', value: 'textarea' },
      { label: '富文本', value: 'editor' }, { label: '图片上传', value: 'upimage' },
      { label: '文件上传', value: 'upfile' }, { label: '日期选择器', value: 'date' }]
  },
  {
    title: '数据类型', dataIndex: 'data_type', view_type: 'radio', is_edit: true, default_value: 1,
    extend_type: 'dict', options: [{ label: '文本型', value: 'input' }, { label: '数字型', value: 'number' }]
  },
  { title: '默认值', dataIndex: 'default_value', view_type: 'input', is_edit: true, },
  { title: '注释', dataIndex: 'remark', view_type: 'input', is_edit: true },
  { title: '配置数据', dataIndex: 'options', view_type: 'dict', data_type: 'input', is_edit: true },
  { title: '操作', dataIndex: 'optional', width: 150, },
]

const columns = ref(config)


watch(() => props.data, (val) => {
  data.value = val.columns ?? []
  data.value.forEach((r, i) => { r.id = i + 1 })
}, { immediate: true, deep: true })

const visible = computed({
  get() { return props.visible },
  set(val) {
    if (!val) {
      emits('refresh', true)
      emits('update:visible', val)
    }
  }
})

const getValueLabel = (record, row) => {
  const value = record[row.dataIndex];
  if (row.extend_type !== 'dict') {
    return value;
  }
  for (const node of row.options) {
    if (node.value === value) {
      return node.label;
    }
  }
}

// 更新数据
const update = async () => {
  await Api.edit({ id: props.data.id, columns: data.value })
  formRef.value?.close()
}

// 创建表单
const handleForm = (key, data = {}) => {
  const title = { add: '新增', edit: '修改' }
  formModel.value = JSON.parse(JSON.stringify(data))
  formRef.value?.open({ title: title[key] })
}

// 表单添加
const handleAdd = () => {
  columns.value = config
  handleForm('add')
}

// 表单编辑
const handleEdit = (data) => {
  handleformat({ key: 'data_type', value: data.data_type })
  handleformat({ key: 'view_type', value: data.view_type })
  handleForm('edit', data)
}

//删除处理
const handleDel = (index) => {
  data.value.splice(index, 1)
  update()
}

// 表单提交
const handleSubmit = async (obj) => {
  const index = data.value.findIndex(r => r.id == obj.id)
  obj.is_edit = true
  if (index > -1) {
    data.value[index] = obj
  } else {
    data.value.push(obj)
  }
  update()
}

// 表格数据改变
const handleChange = (val) => {
  data.value = val
  update()
}

// 表单字段改变
const handleformat = ({ key, value }, alter = false) => {
  const b = ['select', 'radio', 'checkbox'].includes(value);
  const c = columns.value
  if (key == 'data_type') {
    c[5].view_type = value
    c[5].data_type = value
    c[7].data_type = value
    if (alter) formRef.value.setFields({ default_value: null, options: null })
  }
  if (key == 'view_type') {
    c[7].is_edit = b;
    c[7].data_type = c[5].view_type;
    if (alter !== b) formRef.value.setFields({ default_value: null, options: null })
  }

}
</script>

<style scoped>
:deep(.arco-btn-size-small) {
  padding: 0 8px;
  margin-bottom: 12px;
}

:deep(.arco-modal) {
  max-width: 800px;
}
</style>