<template>

  <a-space wrap>
    <div class="image-box" v-for="(item, index) in imageList">
      <a-image class="image" width="90" height="90" show-loader :src="item?.response?.url" :preview="false" />
      <div class="image-btn">
        <a-space :size="12">
          <a-tooltip content="预览" :mini="true">
            <a-button type="primary" shape="circle" size="mini" @click="current = index; imageVisible = true">
              <icon-eye />
            </a-button>
          </a-tooltip>
          <a-tooltip content="删除" :mini="true">
            <a-button type="primary" status="danger" shape="circle" size="mini" @click="imageList.splice(index, 1)">
              <icon-delete />
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <div class="upload-box" v-if="mode?.limit > imageList.length">
      <div class="upload-card">
        <div><icon-plus /></div>
        <div>上传图片</div>
      </div>
      <div class="upload-btn">
        <div @click="visible = true">
          <icon-cloud-download />选择资源
        </div>
        <a-upload v-model:fileList="imageList" :multiple="mode?.multiple" :limit="mode?.limit" :show-file-list="false"
          :custom-request="customRequest" @success="handleUploadSuccess" @error="handleUploadError">
          <template #upload-button>
            <icon-upload />本地图片
          </template>
        </a-upload>
      </div>
    </div>
  </a-space>

  <a-modal title="选择图片" :width="856" v-model:visible="visible" :body-style="{ padding: '0' }" draggable unmount-on-close
    @ok="handleOk">
    <ai-attach-group active-key="image" :page-size="10" @change="handleChange" />
  </a-modal>

  <a-image-preview-group v-model:visible="imageVisible" v-model:current="current" infinite :srcList="previewList" />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { appApi } from '@/api/system'

const emits = defineEmits(['update:modelValue', 'success', 'error'])
const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => null
  },
  mode: {
    type: Object,
    default: () => ({
      multiple: false,
      limit: 1
    })
  },
})

const Api = appApi('system.attach')

const imageList = ref([])
const Selecteds = ref([])
const visible = ref(false)
const imageVisible = ref(false)
const current = ref(0)

const previewList = computed(() => {
  return imageList.value.map(item => item?.response?.url)
})

watch(() => imageList.value, (val) => {
  updateModelValue(val)
}, { deep: true })

watch(() => props.modelValue, (val) => {
  if (!val || imageList.value?.length) return;

  if (Array.isArray(val)) {
    imageList.value = val.filter(url => url !== null)
      .map((url, index) => ({
        uid: index, url: url, response: { url: url }
      }))
  } else {
    imageList.value.push({
      uid: 0, url: val, response: { url: val },
    })
  }
}, { immediate: true });


// 更新modelValue
const updateModelValue = (list) => {
  const bool = props.mode?.multiple
  let value = list.filter(item => item?.response !== undefined)
    .map(item => item.response.url)
  value = value?.length ? value : null
  emits('update:modelValue', bool ? value : value?.[0])
}

// 自定义上传请求
const customRequest = async (options) => {
  const { onError, onSuccess, fileItem } = options
  try {
    const formData = new FormData()
    formData.append('file', fileItem.file)
    formData.append('group_id', 1);
    const res = await Api.post('upload', formData)
    if (res) {
      onSuccess(res)
    } else {
      onError(res)
    }
  } catch (err) {
    onError(err)
  }
}

// 上传成功处理
const handleUploadSuccess = (file) => {
  emits('success', file)
}

//上传错误处理
const handleUploadError = (file) => {
  emits('error', file)
}

// 选择资源处理
const handleChange = (data) => {
  Selecteds.value = data
}

// 确定选择处理
const handleOk = () => {
  if (props.mode.multiple === false) {
    Selecteds.value = Selecteds.value.slice(0, 1) ?? []
  }

  Selecteds.value.forEach(item => {
    imageList.value.push({
      uid: imageList.value.length,
      url: item.url,
      response: { url: item.url }
    })
  })
  Selecteds.value = []
}
</script>

<style lang="scss" scoped>
.upload-box {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-text-2);
  text-align: center;
  background: var(--color-fill-2);
  border: 1px dashed var(--color-neutral-3);
  border-radius: var(--border-radius-small);
}

.image-box {
  position: relative;
  width: 90px;
  height: 90px;

  .image {
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-medium);

    :deep(.arco-image-img) {
      transform: scale(0.97);
      transition: transform 0.3s ease;
    }
  }

  &:hover {
    :deep(.arco-image-img) {
      transform: scale(1.03);
      transition: transform 0.3s ease;
    }
  }
}

.upload-card {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.1s ease;
  opacity: 1;
  overflow: hidden;

  div:first-child {
    margin-bottom: 6px;
  }
}

.upload-btn,
.image-btn {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: opacity 0.3s ease;
  z-index: 668;
  opacity: 0;

  div,
  .arco-upload {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-top: 1px dashed var(--color-neutral-3);

    &:hover {
      background: var(--color-fill-3);
    }
  }

  div:first-child {
    border: none;

    .arco-icon {
      margin-right: 2px;
    }
  }
}

.image-box:hover {

  .image-btn {
    flex-direction: row;
    background: rgba(0, 0, 0, 0.1);
    opacity: 1;

    .arco-icon {
      margin: 0;
    }
  }
}

.upload-box:hover {
  .upload-card {
    opacity: 0;
  }

  .upload-btn {
    opacity: 1;
  }
}
</style>