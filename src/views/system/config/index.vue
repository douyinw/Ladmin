<template>
  <a-row class="container">
    <a-col class="left-side">
      <a-row class="title">
        <div><icon-unordered-list /> 配置</div>
        <a-tooltip content="添加" :mini="true">
          <a-button type="primary" size="mini" shape="circle" @click="handleForm('add')">
            <template #icon><icon-plus /></template>
          </a-button>
        </a-tooltip>
      </a-row>

      <a-scrollbar style="height: calc(100vh - 160px); overflow:auto;">
        <a-row v-for="item in data" :class="['config-item', item.id === configId ? 'active' : '']">
          <div class="name" @click="handleSelect(item)">
            {{ item.name }} ({{ item.code }})
          </div>
          <div class="btns">
            <a-tooltip content="修改" :mini="true"><icon-edit @click="handleForm('edit', item)" /></a-tooltip>
            <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleDel(item.id)">
              <a-tooltip content="删除" :mini="true"><icon-delete /></a-tooltip>
            </a-popconfirm>
          </div>
        </a-row>
      </a-scrollbar>
    </a-col>

    <a-col class="right-side">
      <a-row class="title">
        <div>{{ configData.name }}表</div>
        <a-tooltip content="设置" :mini="true">
          <a-button type="primary" size="mini" shape="circle" @click="() => { modalVisible = true; }">
            <template #icon><icon-settings /></template>
          </a-button>
        </a-tooltip>
      </a-row>
      <a-scrollbar style="height: calc(100vh - 160px); overflow:hidden auto;">
        <div style="max-width: 800px;">
          <ai-form-model ref="formRefa" :model="formModela" :columns="configData.columns ?? []" :button="true"
            module="div" confirm="保存" style="padding:10px 20px;" @submit="handleSave" />
        </div>
      </a-scrollbar>
    </a-col>
  </a-row>

  <ai-form-model ref="formRef" :model="formModel" :columns="columns" @submit="handleSubmit" />

  <ai-list v-model:visible="modalVisible" :data="configData" @refresh="initData" />

</template>
<script setup>
import { ref, onMounted } from 'vue'
import aiList from './list.vue'
import { appApi } from '@/api/system'

const Api = appApi('system.config')

const formRef = ref(null)
const formModel = ref({})

const formRefa = ref(null)
const formModela = ref({})

const data = ref([])
const configId = ref(null)
const configData = ref({})
const currentAction = ref(null)
const modalVisible = ref(false)


// 字段配置
const columns = [
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
  { title: '配置名称', dataIndex: 'name', view_type: 'input', is_required: true, is_edit: true, is_list: true },
  { title: '配置标识', dataIndex: 'code', view_type: 'input', is_required: true, is_edit: true, is_list: true },
  { title: '备注', dataIndex: 'remark', view_type: 'textarea', is_edit: true, is_list: true },
]

// 初始化
onMounted(() => { initData() })

// 获取数据
const initData = async (params = {}) => {
  const res = await Api.list({ ...params })
  if (res?.length) {
    const index = res.findIndex(item => item.id === configId.value)
    handleSelect(res[index < 0 ? 0 : index])
  }
  data.value = res
}

// 选择分类
const handleSelect = (item) => {
  configId.value = item.id
  configData.value = item
  formModela.value = { ...item.data }
}

// 创建表单
const handleForm = (key, data = {}) => {
  const title = { add: '新增', edit: '修改' }
  currentAction.value = key
  formModel.value = { ...data }
  formRef.value?.open({ title: title[key], width: 500 })
}

// 提交数据
const handleSubmit = async (data) => {
  await Api[currentAction.value](data);
  formRef.value?.close();
  initData()
}

// 删除数据
const handleDel = async (id) => {
  await Api.delete({ ids: id })
  initData()
}

// 保存配置
const handleSave = async (data) => {
  await Api.edit({ id: configId.value, data: data })
  initData()
}

</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: var(--color-bg-2);
}

:deep(.arco-tabs-content) {
  padding: 0;
}

:deep(.arco-btn-size-small) {
  padding: 0 8px;
}

.left-side {
  height: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-2);
  border-right: 1px solid var(--color-neutral-2);
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-neutral-3);
  box-sizing: border-box;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px 4px;
  padding: 0 10px;
  height: 38px;
  border-radius: var(--border-radius-small);

  &:hover {
    background-color: var(--color-fill-2);
    cursor: pointer;
  }

  &.active {
    background-color: var(--color-fill-2);
    color: rgb(var(--primary-6));
  }

  .name {
    flex: 1;
    line-height: 38px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .btns {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(var(--primary-6));

    :deep(.arco-icon:hover) {
      font-size: 16px;
      color: rgb(var(--primary-6));
    }
  }
}
</style>