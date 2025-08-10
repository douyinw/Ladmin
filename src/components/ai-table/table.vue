<template>
  <slot name="search" :hideSearch="hideSearch">
    <ai-search :visible="hideSearch" :columns="columns" @change="handleSearch" />
  </slot>

  <a-layout class="table-container">
    <slot name="button" :selectedKeys="selectedKeys">
      <ai-button v-if="mode?.top_btn !== 0" :buttons="buttons" :expandAll="expandAll" :hideSearch="hideSearch"
        :hasChildren="hasChildren" @hide="(val) => (hideSearch = val)" @operate="btnOperate" @expand="handleExpandAll"
        @refresh="handleRefresh" />
    </slot>

    <a-col ref="tableRef" :style="{ x: '100%', height: scroll.y + 'px', flex: '1' }">
      <a-table :rowKey="rowKey" :columns="columns" :data="tableData" :scroll="scroll" :loading="loading"
        v-model:selectedKeys="selectedKeys" :expandedKeys="expandedKeys" :rowSelection="rowSelection"
        :pagination="pagination" :draggable="draggable" :bordered="bordered" stickyHeader striped columnResizable
        @expandedChange="handleExpanded" @pageChange="handlePage" @pageSizeChange="handlePageSize"
        @change="handleChange">

        <template #columns>
          <template v-for="(row, index) in columns" :key="index">
            <a-table-column align="center" v-if="row.is_list === true" :ellipsis="true" :tooltip="row.tooltip ?? true"
              :width="row.width" :title="row.title" :fixed="row.fixed" :dataIndex="row.dataIndex">
              <template #cell="{ record, rowIndex }">

                <slot name="link" v-if="row.dataIndex === 'optional'" :rowIndex="rowIndex" :record="record"
                  :column="columns">
                  <ai-link :data="record" :column="columns" :links="buttons" @operate="linkOperate($event, record)" />
                </slot>

                <slot name="show" v-else :rowIndex="rowIndex" :record="record" :column="row">
                  <ai-show :data="record" :column="row" @setup="handleUpdate($event, record[rowKey])" />
                </slot>

              </template>
            </a-table-column>
          </template>
        </template>

      </a-table>
    </a-col>
  </a-layout>

  <ai-form-model ref="formRef" :model="formModel" :columns="columns" @formChange="formChange"
    @formItemChange="formItemChange" @submit="handleSubmit" />

</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue';
import aiSearch from './components/search.vue';
import aiButton from './components/button.vue';
import aiLink from './components/link.vue';
import aiShow from './components/show.vue';

const emits = defineEmits(['operate', 'refresh', 'search', 'selected', 'change', 'formChange', 'formItemChange'])
const props = defineProps({
  appApi: { type: Object, default: null },
  rowKey: { type: String, default: 'id' },
  data: { type: Array, default: [] },
  columns: { type: Array, default: [] },
  pagination: { type: Object, default: null },
  draggable: { type: Object, default: null },
  rowSelection: { type: Object, default: null },
  bordered: { type: Object, default: { cell: true } },
  buttons: { type: Array, default: [] },
  useForm: { type: Boolean, default: false },
  formRules: { type: Object, default: {} },
  formAppend: { type: Object, default: {} },
  mode: { type: Object, default: {} },
})

// 表单响应式
const formRef = ref(null)
const formModel = ref({});
const currentAction = ref(null);

const expandAll = ref(false);
const hideSearch = ref(false);
const hasChildren = ref(false);
const loading = ref(false);

// 表格响应式
const tableRef = ref(null)
const tableData = ref([]);
const columns = ref([]);
const queryParams = ref({});
const expandedKeys = ref([]);
const selectedKeys = ref([]);

const rowSelection = computed(() => {
  return props.rowSelection ? {
    type: 'checkbox',
    columnWidth: 40,
    showCheckedAll: true,
    onlyCurrent: true,
    fixed: true,
    ...props.rowSelection
  } : null
})

const pagination = computed({
  get: () => {
    return props.pagination ? {
      current: 1,          // 当前页码
      pageSize: 20,        // 每页显示条数
      total: 0,            // 数据总数
      size: "small",       // 分页器大小
      showTotal: true,     // 显示总数统计
      showJumper: true,    // 显示页码跳转
      showPageSize: true,  // 显示页容量切换
      ...props.pagination
    } : false
  },
  set: (val) => { props.pagination = val }
})

const scroll = computed(() => {
  const height = tableRef.value?.$el.offsetHeight - 90;
  return { x: '100%', y: height }
})

// 监听列变化
watch(() => props.columns, (val) => {
  hideSearch.value = val.some(r => r.is_query === true);
  const obj = val.some(r => r.dataIndex === 'optional');
  if (!obj) val.push({
    title: '操作',
    dataIndex: 'optional',
    fixed: 'right',
    tooltip: false,
    width: props.mode?.option_width ?? 160,
    is_list: Boolean(props.mode?.right_btn ?? true)
  })
  columns.value = val ?? [];
}, { immediate: true, deep: true })

// 监听数据变化
watch(() => props.data, (val) => {
  loading.value = false
  tableData.value = val;
  selectedKeys.value = [];
  hasChildren.value = val.some(r => r.children?.length);
}, { deep: true })

// 监听选中变化
watch(() => selectedKeys.value, (val) => {
  emits('selected', val)
})

// 处理发送请求
const handleRequest = async (key, data = null) => {
  const Api = props.appApi;
  if (!Api) {
    emits('operate', { key: key, data })
    return;
  }
  switch (key) {
    case 'addOk':
      await Api.add(data).then(() => formRef.value?.close())
      handleRefresh()
      break
    case 'editOk':
      await Api.edit(data).then(() => formRef.value?.close())
      handleRefresh()
      break
    case 'update':
      await Api.update(data).then(() => handleQuery())
      break
    case 'dels':
    case 'delete':
      await Api.delete(data).then(() => handleQuery())
      break
    default:
  }
}

// 处理按钮操作
const btnOperate = async ({ key, data }) => {
  currentAction.value = key
  const id = { id: selectedKeys.value }
  switch (key) {
    case 'add':
      await handleForm(key)
      break
    case 'dels':
      await handleDelete(key, id)
      break
    default:
      if (data?.[key]) {
        await handleUpdate(key, { ...data, ...id })
      } else {
        emits('operate', { key, data })
      }
  }
}

// 处理链接操作
const linkOperate = async ({ key, data }, record = null) => {
  currentAction.value = key;
  const id = { id: record?.[props.rowKey] ?? 0 }
  switch (key) {
    case 'edit':
      await handleForm(key, record)
      break
    case 'delete':
      await handleDelete(key, id)
      break
    default:
      if (data?.[key]) {
        await handleUpdate(key, { ...data, ...id })
      } else {
        emits('operate', { key, data, record })
      }
  }
}

// 提交数据
const handleSubmit = (data) => {
  handleRequest(currentAction.value + 'Ok', { ...data, ...props.formAppend })
}

// 更新数据
const handleUpdate = (key, data) => {
  console.log(key, data)
  if (data.id?.length == 0) {
    Message.error('请选择要更新的数据')
    return
  }
  handleRequest('update', data)
}

// 删除数据
const handleDelete = (key, data) => {
  if (data.id?.length == 0) {
    Message.error('请选择要删除的数据')
    return
  }
  handleRequest(key, data)
}

//-------------------------------表格式事件----------------------------------

// 刷新处理
const handleRefresh = () => {
  loading.value = true
  emits('refresh', {
    page: 1, limit: pagination.value.pageSize,
  })
}

// 查询处理
const handleQuery = () => {
  loading.value = true
  emits('search', {
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
    ...queryParams.value
  })
}

// 搜索处理
const handleSearch = (params) => {
  queryParams.value = params;
  if (pagination.value !== false) {
    pagination.value.current = 1
  }
  handleQuery()
}

// 分页处理
const handlePage = (current) => {
  if (pagination.value.current === current) return;
  pagination.value.current = current;
  handleQuery()
}

// 页码处理
const handlePageSize = (size) => {
  if (pagination.value.pageSize === size) return;
  pagination.value.pageSize = size;
  handleQuery()
}

// 展开控制
const handleExpandAll = () => {
  loading.value = !expandAll.value
  setTimeout(() => {
    expandedKeys.value = expandAll.value && expandedKeys.value?.length
      ? [] : getAllKey(props.data)
    expandAll.value = expandedKeys.value.length > 0
    loading.value = false
  }, 100)
}

// 展开状态：同步最新
const handleExpanded = (Keys) => {
  expandedKeys.value = [...Keys]
}

// 获取所有节点key
const getAllKey = (data) => {
  let keys = [];
  data.forEach(item => {
    keys.push(item[props.rowKey])
    if (item.children) {
      keys = keys.concat(getAllKey(item.children))
    }
  });
  return keys
}

// 表格数据改变
const handleChange = (val) => {
  emits('change', val)
}

//-------------------------------表单事件----------------------------------

// 创建表单
const visible = ref(false)
const handleForm = (key, data = null) => {
  if (!props.appApi && !props.useForm) {
    emits('operate', { key: key, data: data });
    return;
  }

  const title = { add: '新增', edit: '编辑' }
  const { module, width, fullscreen } = props.mode;
  formModel.value = JSON.parse(JSON.stringify(data))
  formRef.value?.open({
    title: title[key],
    module: module || 'a-modal',
    width: width || 600,
    fullscreen: fullscreen || 0,
  })
  visible.value = true
}

// 表单数据改变
const formChange = (val) => {
  emits('formChange', val)
}

// 表单项数据改变
const formItemChange = (val) => {
  emits('formItemChange', val)
}

defineExpose({ formModel })
</script>

<style lang="scss" scoped>
.table-container {
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: var(--border-radius-small);
  box-sizing: border-box;
  overflow: hidden;
}
</style>