<template>
  <a-row style="height: 100%;">
    <a-col :span="6" class="left-side">
      <a-row class="title">
        <div><icon-unordered-list /> 分组</div>
        <a-tooltip content="添加" :mini="true">
          <a-button type="primary" size="mini" shape="circle" @click="handleForm('add')">
            <template #icon><icon-plus /></template>
          </a-button>
        </a-tooltip>
      </a-row>

      <a-row v-for="item in data" :class="['group-item', item.id == groupId ? 'active' : '']">
        <div class="name" @click="handleSelect(item.id)">
          <component is="icon-folder" style="font-size: 16px;" /> {{ item.name }}
        </div>

        <div class="btns" v-if="item.id > 1">
          <a-tooltip content="重命名" :mini="true"><icon-edit @click="handleForm('edit', item)" /></a-tooltip>
          <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleDel(item.id)">
            <a-tooltip content="删除" :mini="true"><icon-delete /></a-tooltip>
          </a-popconfirm>
        </div>
      </a-row>
    </a-col>

    <a-col :span="18" class="right-side">
      <ai-list :group-id="groupId" :group-data="data" :active-key="activeKey" :page-size="pageSize"
        @selecteds="selecteds" />
    </a-col>
  </a-row>

  <ai-form-model ref="formRef" :model="formModel" :columns="columns" @submit="handleSubmit" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import aiList from './list.vue'
import { appApi } from '@/api/system'

const emits = defineEmits(['change']);

const props = defineProps({
  activeKey: {
    type: String,
    default: null
  },
  pageSize: {
    type: Number,
    default: 20
  }
})

const Api = appApi('system.attachgroup')

const formRef = ref(null)
const formModel = ref({})

const data = ref([])
const groupId = ref(0)
const currentAction = ref(null)

const columns = [
  { title: '主键', dataIndex: 'id', key: 'PRI', view_type: 'number', is_edit: true },
  { title: '分组名称', dataIndex: 'name', view_type: 'input', is_edit: true, is_list: true }
];

onMounted(() => {
  initData()
})

const initData = async (params = {}) => {
  const res = await Api.list({ ...params })
  data.value = [
    { id: 0, name: '全部' },
    { id: 1, name: '未分组' }
  ].concat(res)
}

const selecteds = (data) => {
  emits('change', data)
}

const handleSelect = (id) => {
  groupId.value = id
}

const handleForm = (key, data = {}) => {
  const title = { add: '新增', edit: '修改' }
  currentAction.value = key
  formModel.value = { ...data }
  formRef.value?.open({
    title: title[key],
    width: 500
  })
}

const handleSubmit = async (data) => {
  if (currentAction.value === 'add') {
    delete data.id
  }
  await Api[currentAction.value](data);
  formRef.value?.close();
  initData()
}

const handleDel = async (id) => {
  await Api.delete({ id: id })
  if (groupId.value === id) {
    groupId.value = 0
  }
  initData()
}
</script>

<style lang="scss" scoped>
:deep(.arco-btn-size-mini.arco-btn-shape-circle) {
  width: 22px;
  height: 22px;
}

:deep(.arco-btn-size-small) {
  padding: 0 8px;
}

/* 左侧区域样式 */
.left-side {
  min-width: 220px;
  max-width: 300px;
  height: 100%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

/* 右侧区域样式 */
.right-side {
  flex: 1;
  height: 100%;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-neutral-2);
}

/* 标题栏样式 */
.title {
  height: 40px;
  margin-bottom: 10px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-neutral-3);
  box-sizing: border-box;
}

/* 分组项样式 */
.group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px 4px;
  padding: 0 10px;
  height: 38px;
  border-radius: var(--border-radius-small);

  /* 悬停效果 */
  &:hover {
    background-color: var(--color-fill-2);
    cursor: pointer;
  }

  /* 激活状态样式 */
  &.active {
    background-color: var(--color-fill-2);
    color: rgb(var(--primary-6));
  }

  /* 分组名称样式 */
  .name {
    flex: 1;
    line-height: 38px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* 超出显示省略号 */
  }

  /* 操作按钮区域 */
  .btns {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(var(--primary-6));

    /* 按钮悬停效果 */
    :deep(.arco-icon:hover) {
      font-size: 16px;
      color: rgb(var(--primary-6));
    }
  }
}
</style>