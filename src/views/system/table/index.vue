<template>
  <a-layout class="layout-table">
    <a-row justify="space-between" :wrap="false">
      <a-button type="primary" @click="handleAdd()">
        <template #icon><icon-export /></template>装载数据表
      </a-button>
      <a-space>

      </a-space>
    </a-row>
    <a-table row-key="name" :data="data" :columns="columns" :pagination="{}" :bordered="{ wrapper: true, cell: true }">
      <template #columns>
        <template v-for="(row, index) in columns" :key="index">
          <a-table-column :ellipsis="true" :tooltip="true" align="center" :width="row.width" :title="row.title"
            :fixed="row.fixed" :dataIndex="row.dataIndex">
            <template #cell="{ record, rowIndex }">
              <template v-if="row.dataIndex === 'optional'">
                <a-space>
                  <a-link type="primary" @click="handleEdit(record)"><icon-edit />编辑</a-link>
                  <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleDel(record.id)">
                    <a-link type="primary" status="danger"><icon-delete />删除</a-link>
                  </a-popconfirm>
                </a-space>
              </template>
              <template v-else>{{ record[row.dataIndex] }} </template>
            </template>
          </a-table-column>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="modalVisible" title="选择数据表" :width="800" ok-text="装载" @ok="formModalVisible = true"
      unmount-on-close>
      <a-table row-key="name" :data="tables" :columns="modalColumns" :row-selection="{ type: 'radio' }"
        @select="handleSelected" />
    </a-modal>

    <a-modal v-model:visible="formModalVisible" width="96%" ok-text="保存" unmount-on-close
      :body-style="{ padding: '0px', height: 'calc(100vh - 200px)' }" @before-ok="handleSubmit">
      <template #title>{{ selectedName }} 数据表</template>
      <a-form ref="formRef" style="height: 100%" :model="formModel" :rules="formRules" auto-label-width>
        <ai-edit :model="formModel" :category-type="categoryType" :dict-type="dictType" />
      </a-form>
    </a-modal>

    <ai-loading v-model:visible="loading" />
  </a-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { appApi } from '@/api/system'
import aiEdit from './edit.vue'

const Api = appApi('system.table')

const formRef = ref(null)
const formModel = ref({})

const data = ref([])
const tables = ref([])
const dictType = ref([])
const categoryType = ref([])

const selectedName = ref(null)
const modalVisible = ref(false)
const formModalVisible = ref(false)
const currentAction = ref(null)
const loading = ref(false)


// 表单验证
const formRules = {
  controller: [{ required: true, message: '请输入应用名称' }],
}

// 列表配置
const columns = [
  { title: '数据表', dataIndex: 'name', view_type: 'input', is_query: true, is_list: true },
  { title: '表注释', dataIndex: 'comment', is_list: true },
  { title: '字段数', dataIndex: 'count', is_list: true },
  { title: '应用模块', dataIndex: 'controller', is_list: true },
  { title: '创建时间', dataIndex: 'create_time', is_list: true },
  { title: '更新时间', dataIndex: 'update_time', is_list: true },
  { title: '操作', dataIndex: 'optional', width: 150, fixed: 'right', is_list: true }
]

// 选择列表配置
const modalColumns = [
  { title: '数据表', dataIndex: 'name' },
  { title: '表注释', dataIndex: 'comment' },
  { title: '字段数', dataIndex: 'count' },
]

// 初始化
onMounted(() => initData())

// 初始化数据
const initData = async (params = {}) => {
  const res = await Api.list(params);
  data.value = res.list;
  tables.value = res.table
  dictType.value = res.dictType
}

// 删除数据
const handleDel = async (id) => {
  await Api.delete({ id: id })
  initData()
}

// 表单新增
const handleAdd = () => {
  currentAction.value = 'add'
  modalVisible.value = true
}

// 表单编辑
const handleEdit = async ({ id, name }) => {
  loading.value = true
  currentAction.value = 'edit'
  const res = await Api.get('read', { id })
  try {
    categoryType.value = res.categoryType
    formModel.value = await syncData(res)
    selectedName.value = name
    formModalVisible.value = true
  } catch (error) {
    console.error('同步数据表失败')
  } finally {
    loading.value = false
  }
}

// 同步数据表
const syncData = async ({ table, data }) => {
  const { columns } = getFormData(table)

  for (let i = data.columns.length - 1; i >= 0; i--) {
    let col = data.columns[i]
    let index = columns.findIndex(f => f.dataIndex === col.dataIndex)

    if (index > -1) {
      let newCol = columns[index]
      col.data_type = newCol.data_type

      switch (newCol.data_type) {
        case 'int':
          col.default_value = parseInt(newCol.default_value)
          break
        case 'decimal':
          col.default_value = parseFloat(newCol.default_value)
          console.log(col.default_value)
          break
        default:
          col.default_value = newCol.default_value
      }

      columns.splice(index, 1)
    } else {
      data.columns.splice(i, 1)
    }
  }
  
  data.columns = data.columns.concat(columns)
  return data
}

// 选择数据表
const handleSelected = async (row) => {
  const data = tables.value.find(r => r.name === row[0]);
  delete data.id;
  formModel.value = await getFormData(data)
  selectedName.value = row[0]
}

// 表单提交
const handleSubmit = async (done) => {
  try {
    loading.value = true
    if (await formRef.value?.validate()) {
      console.error('表单验证失败');
      return;
    }
    await Api[currentAction.value](formRef.value.model)
    initData()
    done(true)
  } catch {
    done(false)
  } finally {
    loading.value = false
  }
}

// 表单数据结构
const getFormData = (data) => {
  const config = {
    mode: {
      module: "a-modal",
      width: 600,
      fullscreen: 0,
    },
    ...data
  }

  const append = {
    width: 180,
    is_json: false,
    is_required: false,
    is_insert: true,
    is_edit: true,
    is_list: true,
    is_query: false,
    query_type: null,
    view_type: null,
  }

  config.columns.map(m => Object.assign(m, append));
  return config;
}

</script>

<style scoped>
.layout-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: var(--border-radius-small);
  box-sizing: border-box;

  :deep(.arco-btn-size-medium) {
    padding: 0 8px;
    margin-bottom: 12px;
  }
}


.layout-edit {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-sizing: border-box;
  background: var(--color-bg-2);
}
</style>