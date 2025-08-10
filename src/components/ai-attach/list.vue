<template>
  <!-- 文件类型标签页 -->
  <a-tabs :default-active-key="activeKey" @change="tabsChange">
    <!-- 遍历文件类型配置 -->
    <a-tab-pane v-for="item in fileTypes" :key="item.key"
      :disabled="!activeKey ? false : activeKey === item.key ? false : true">
      <template #title>
        <!-- 显示文件类型图标和标题 -->
        <component :is="item.icon" style="font-size: 16px;" /> {{ item?.title }}
      </template>
    </a-tab-pane>
  </a-tabs>

  <!-- 主内容区 -->
  <div class="container">
    <!-- 操作按钮区域 -->
    <a-row justify="space-between" style="margin-bottom: 12px;">
      <a-space>
        <!-- 上传按钮 -->
        <a-button type="primary" size="small" @click="uploadModalVisible = true">
          <template #icon><icon-upload /></template>上传
        </a-button>

        <!-- 批量删除按钮（带确认） -->
        <a-popconfirm content="确定要删除数据吗?" position="bottom" @ok="handleBatchDelete">
          <a-button type="primary" status="danger" size="small">
            <template #icon><icon-delete /></template>删除
          </a-button>
        </a-popconfirm>

        <!-- 移动按钮 -->
        <a-button size="small" @click="handleBatchMove">
          <template #icon><icon-folder /></template>移动
        </a-button>

        <!-- 选择操作按钮组 -->
        <a-button-group>
          <a-button size="small" @click="handleSelectAll"><icon-select-all />全选</a-button>
          <a-button size="small" @click="handleClearAll"><icon-eraser />清除</a-button>
        </a-button-group>
      </a-space>

      <!-- 视图切换按钮 -->
      <a-space v-if="!activeKey">
        <a-tooltip content="刷新" :mini="true" @click="initData">
          <a-button shape="circle"><icon-refresh /></a-button>
        </a-tooltip>
        <a-tooltip :content="state.modeList ? '列表模式' : '网格模式'" :mini="true" @click="state.modeList = !state.modeList">
          <a-button shape="circle">
            <icon-unordered-list v-if="state.modeList" />
            <icon-apps v-else />
          </a-button>
        </a-tooltip>
      </a-space>
    </a-row>

    <!-- 文件列表展示区 -->
    <a-row style="flex: 1;">
      <!-- 空状态提示 -->
      <a-empty v-if="state.data?.length === 0" />

      <!-- 文件项网格布局 -->
      <a-space v-else wrap>
        <!-- 遍历文件数据 -->
        <div class="list-item" v-for="(item, index) in state.data" :key="index">
          <!-- 文件后缀标识 -->
          <div class="Suffix">
            {{ item.ext }}
          </div>

          <!-- 文件选择框 -->
          <a-checkbox class="Checkbox" :model-value="state.selectedIds.includes(item.id)"
            @change="(checked) => handleSelectItem(item.id, checked)" />

          <!-- 图片预览 -->
          <div v-if="item.type === 'image'">
            <a-image width="130" height="126" show-loader :src="item.url" :preview="false"
              @click="handlePreview(item.name)" />
          </div>

          <!-- 视频预览 -->
          <div v-if="item.type === 'video'">
            <video :src="item.url" width="130" height="126" @click="showVideoModal(item)"></video>
          </div>

          <!-- 音频预览 -->
          <div v-if="item.type === 'audio'" @click="showAudioModal(item)">
            <div class="Preview" style="cursor: pointer;">
              <img src="@/assets/image/music.png">
            </div>
          </div>

          <!-- 文档预览 -->
          <div v-if="item.type === 'document'">
            <div class="Preview">
              <img src="@/assets/image/file.png">
            </div>
          </div>

          <!-- 压缩文件预览 -->
          <div v-if="item.type === 'archive'">
            <div class="Preview">
              <img src="@/assets/image/zip.png">
            </div>
          </div>

          <!-- 文件操作按钮 -->
          <div class="Actions">
            <!-- 文件信息提示 -->
            <a-tooltip :mini="true">
              <template #content>
                <p>文件名称：{{ item.name }}</p>
                <p>文件类型：{{ item.ext }}</p>
                <p>文件大小：{{ item.size }}</p>
                <p>上传时间：{{ item.create_time }}</p>
              </template>
              <span class="action"><icon-info-circle /></span>
            </a-tooltip>

            <!-- 复制链接 -->
            <a-typography-paragraph copyable :copy-text="item.url" :copy-tooltip-props="{ mini: true }"
              @copy="handleCopyLink">
              <template #copy-icon><icon-link /></template>
              <template #copy-tooltip>链接</template>
            </a-typography-paragraph>

            <!-- 下载按钮 -->
            <a-tooltip content="下载" :mini="true">
              <span class="action" @click="onDownLoad(item)"><icon-download /></span>
            </a-tooltip>

            <!-- 移动按钮 -->
            <a-tooltip content="移动" :mini="true">
              <span class="action" @click="handleMove([item.id])"><icon-folder /></span>
            </a-tooltip>

            <!-- 删除按钮 -->
            <a-tooltip content="删除" :mini="true">
              <span class="action" @click="handleDelete([item.id])"><icon-delete /></span>
            </a-tooltip>
          </div>
        </div>
      </a-space>
    </a-row>

    <!-- 分页控件 -->
    <a-row justify="end" style="margin-top: 8px;">
      <a-pagination size="small" :total="state.pagination.total" :default-page-size="state.pagination.pageSize"
        show-total show-page-size @change="handleChangePage" @page-size-change="handleChangePageSize" />
    </a-row>
  </div>

  <!-- 图片预览模态框 -->
  <a-image-preview-group v-model:visible="imageModalVisible" v-model:current="current" :srcList="previewList"
    infinite />

  <!-- 视频预览模态框 -->
  <a-modal title="视频播放" v-model:visible="videoModalVisible" :width="600" :footer="false" @close="handleVideoClose">
    <video ref="videoPlayer" :src="currentVideo?.url" controls autoplay style="width: 100%;"></video>
  </a-modal>

  <!-- 音频播放模态框 -->
  <a-modal title="音频播放" v-model:visible="audioModalVisible" :width="400" :footer="false" @close="handleAudioClose">
    <audio ref="audioPlayer" :src="currentAudio?.url" controls autoplay style="width: 100%;"></audio>
  </a-modal>

  <!-- 移动分组模态框 -->
  <a-modal title="移动文件" v-model:visible="moveModalVisible" :width="400" @ok="confirmMove" @cancel="moveCancel">
    <a-select v-model="moveGroupId" :options="groupData" :field-names="{ value: 'id', label: 'name' }"
      placeholder="请选择分组" />
  </a-modal>

  <!-- 上传组件 -->
  <ai-upload v-model:visible="uploadModalVisible" :groupId="groupId" @change="uploadChange" />

</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import aiUpload from './upload.vue'
import { appApi } from '@/api/system'

// 定义组件事件
const emits = defineEmits(['selecteds']);

// 定义组件属性
const props = defineProps({
  groupData: {  // 分组数据
    type: Array,
    default: []
  },
  groupId: {    // 当前分组ID
    type: Number,
    default: null
  },
  activeKey: {  // 当前激活的文件类型
    type: String,
    default: null
  },
  pageSize: {   // 每页显示数量
    type: Number,
    default: 20
  }
})

// 初始化API模块
const Api = appApi('system.attach')

// 视频相关状态
const videoModalVisible = ref(false)  // 视频模态框显示状态
const currentVideo = ref(null)        // 当前播放的视频
const videoPlayer = ref(null)         // 视频播放器引用

// 音频相关状态
const audioModalVisible = ref(false)  // 音频模态框显示状态
const currentAudio = ref(null)        // 当前播放的音频
const audioPlayer = ref(null)         // 音频播放器引用

// 移动分组相关状态
const moveModalVisible = ref(false)   // 移动模态框显示状态
const moveGroupId = ref(null)         // 移动目标分组ID

// 上传模态框相关状态
const uploadModalVisible = ref(false) // 上传模态框显示状态

// 图片预览相关状态
const imageModalVisible = ref(false)  // 图片预览模态框显示状态
const current = ref(0)                // 当前预览图片索引
const previewList = ref([])           // 预览图片列表

// 组件状态管理
const state = reactive({
  data: [],          // 文件列表数据
  selectedIds: [],   // 选中的文件ID集合
  query: {           // 查询参数
    group_id: null,  // 分组ID
    type: null,      // 文件类型
    limit: 20,       // 每页数量
    page: 1,         // 当前页码
  },
  modeList: false,   // 视图模式（列表/网格）
  visible: false,    // 通用显示状态
  pagination: {      // 分页信息
    total: 1,        // 总条目数
    pageSize: props.pageSize, // 每页数量
  },
});

// 文件类型配置
const fileTypes = [
  { key: null, title: '所有', icon: 'icon-drive-file' },
  { key: 'image', title: '图片', icon: 'icon-file-image' },
  { key: 'video', title: '视频', icon: 'icon-file-video' },
  { key: 'audio', title: '音频', icon: 'icon-file-audio' },
  { key: 'document', title: '文档', icon: 'icon-file-pdf' },
  { key: 'archive', title: '文件', icon: 'icon-file' }
];

// 组件挂载时初始化数据
onMounted(() => {
  initData({ type: props.activeKey })
})

// 监听文件类型变化
watch(() => props.activeKey, (val) => {
  state.query.type = val
}, { immediate: true })

// 监听分组ID变化
watch(() => props.groupId, (val) => {
  state.query.group_id = val
  initData()
})

// 监听选中文件变化
watch(() => state.selectedIds, (val) => {
  const list = state.data.filter(r => val.includes(r.id))
  emits('selecteds', list)
}, { deep: true })

// 计算属性：分组数据（排除第一个元素）
const groupData = computed(() => {
  return props.groupData.filter(r => r.id > 0);
})

// 获取文件数据
const initData = async (params = {}) => {
  try {
    const res = await Api.list({ ...params, ...state.query })
    state.data = res.list
    state.pagination = res.pagination
    state.selectedIds = [] // 重置选中状态
  } catch (error) {
    Message.error('加载附件失败: ' + error.message)
  }
}

// 标签页切换处理
const tabsChange = (val) => {
  state.query.type = val;
  initData()
}

// 上传成功回调
const uploadChange = () => {
  initData()
}

// 分页变化处理
const handleChangePage = (page) => {
  state.query.page = page
  initData()
}

// 每页数量变化处理
const handleChangePageSize = (pageSize) => {
  state.query.limit = pageSize
  initData()
}

// 删除文件
const handleDelete = async (val) => {
  await Api.delete({ id: val })
  initData() // 刷新文件列表
}

// 批量删除文件
const handleBatchDelete = () => {
  if (state.selectedIds.length === 0) {
    Message.info('请选择要删除的文件')
    return
  }
  handleDelete(state.selectedIds)
}

// 确认移动文件
const confirmMove = async () => {
  console.log(moveGroupId.value)
  await Api.update({ id: state.selectedIds, group_id: moveGroupId.value })
  moveModalVisible.value = false
  initData()
}

// 移动单个文件
const handleMove = (val) => {
  state.selectedIds = val
  handleBatchMove()
}

// 批量移动文件
const handleBatchMove = () => {
  if (!state.selectedIds?.length) {
    Message.info('请选择要移动的文件')
    return
  }
  moveModalVisible.value = true
  moveGroupId.value = null
}

// 取消移动操作
const moveCancel = () => {
  moveModalVisible.value = false
  state.selectedIds = []
}

// 全选文件
const handleSelectAll = () => {
  state.selectedIds = state.data.map(item => item.id)
  Message.success(`已全选 ${state.selectedIds.length} 个文件`)
}

// 清除所有选择
const handleClearAll = () => {
  state.selectedIds = []
  Message.info('已清除所有选择')
}

// 选择/取消单个文件
const handleSelectItem = (id, checked) => {
  if (checked) {
    if (!state.selectedIds.includes(id)) {
      state.selectedIds.push(id)
    }
  } else {
    state.selectedIds = state.selectedIds.filter(itemId => itemId !== id)
  }
}

// 图片预览处理
const handlePreview = (name) => {
  previewList.value = state.data.filter(r => r.type === 'image').map(r => r.url)
  current.value = previewList.value.findIndex(r => r.includes(name))
  imageModalVisible.value = true
}

// 显示视频模态框
const showVideoModal = (videoItem) => {
  currentVideo.value = videoItem
  videoModalVisible.value = true
}

// 关闭视频模态框
const handleVideoClose = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause() // 暂停播放
  }
  videoModalVisible.value = false
}

// 显示音频模态框
const showAudioModal = (audioItem) => {
  currentAudio.value = audioItem
  audioModalVisible.value = true
}

// 关闭音频模态框
const handleAudioClose = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause() // 暂停播放
  }
  audioModalVisible.value = false
}

// 下载文件
const onDownLoad = (item) => {
  // 创建临时链接下载文件
  const link = document.createElement('a')
  link.href = item.path
  link.target = '_blank';
  link.download = item.name
  link.click()
}

// 复制链接成功提示
const handleCopyLink = () => {
  Message.success('链接已复制')
}
</script>

<style lang="scss" scoped>
/* 样式调整 */
:deep(.arco-image-footer-extra),
:deep(.arco-tabs-content) {
  padding: 0;
}

/* 容器样式 */
.container {
  flex: 1;
  height: calc(100% - 80px);
  margin: 20px 16px 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 文件项样式 */
.list-item {
  position: relative;
  width: 130px;
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  padding: 4px;
  transition: all 0.3s ease;
  overflow: hidden;

  /* 悬停效果 */
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);

    .Actions {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 媒体元素样式 */
  video,
  .arco-image {
    display: block;
    border-radius: var(--border-radius-small);
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
  }

  /* 文件后缀标识 */
  .Suffix {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 10;
    padding: 2px 4px 0;
    color: #fff;
    font-size: 12px;
    font-weight: 300;
    text-transform: uppercase;
    border-radius: 2px;
    background-color: rgb(var(--primary-5));
  }

  /* 复选框样式 */
  .Checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  }

  /* 预览容器 */
  .Preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 130px;
    height: 126px;

    img {
      width: 90px;
      height: 90px;
    }
  }
}

/* 操作按钮区域 */
.Actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;

  /* 操作按钮样式 */
  .action {
    line-height: 1;
    margin-left: 5px;
    padding: 5px 4px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:first-child {
      margin-left: 0;
    }

    &:hover {
      color: var(--color-primary-light-4);
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.1);
    }
  }

  /* 调整排版组件样式 */
  :deep(div.arco-typography) {
    margin: 0;
  }

  :deep(.arco-typography-operation-copy) {
    color: #fff;

    &:hover {
      color: var(--color-primary-light-4);
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>