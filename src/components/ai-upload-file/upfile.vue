<template>
  <a-upload v-model:fileList="fileList" :multiple="mode?.multiple" :limit="mode?.limit" :custom-request="customRequest"
    @success="handleUploadSuccess" @error="handleUploadError" />
</template>

<script setup>
import { ref, watch } from 'vue'
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

const fileList = ref([])

watch(() => fileList.value, (val) => {
  updateModelValue(val)
}, { deep: true })

watch(() => props.modelValue, (val) => {
  if (!val || fileList.value?.length) return;

  if (Array.isArray(val)) {
    fileList.value = val.filter(url => url !== null)
      .map((url, index) => ({
        uid: index, url: url, response: { url: url },
        name: url.match(/\/([^\/]+)$/)[1] ?? null
      }))
  } else {
    fileList.value.push({
      uid: 0, url: val, response: { url: val },
      name: val.match(/\/([^\/]+)$/)[1] ?? null
    })
  }
}, { immediate: true });

// 更新modelValue
const updateModelValue = (list) => {
  const bool = props.mode.multiple
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

</script>