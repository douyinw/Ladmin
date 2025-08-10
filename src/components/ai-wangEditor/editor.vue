<template>
  <div class="wang-editor">
    <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor class="editor" :style="{ height: height + 'px' }" :defaultConfig="editorConfig" v-model="content"
      :mode="mode" @onCreated="handleCreated" @change="handleChange" />
  </div>

  <a-modal :title="title" :width="856" v-model:visible="visible" :body-style="{ padding: '0' }" draggable
    unmount-on-close @ok="handleAnnexOk" @cancel="">
    <ai-attach-group :active-key="activeKey" :page-size="10" @change="handleAnnexChange" />
  </a-modal>

</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, computed, watch, shallowRef, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const emits = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  modelValue: { type: String },
  height: { type: Number, default: 400 },
  mode: { type: String, default: 'default' },
})

const editorRef = shallowRef();

const title = ref(null)
const activeKey = ref(null)
const visible = ref(false)

const datas = ref([])


// 工具栏配置
const toolbarConfig = {
  excludeKeys: ['emotion'],
};

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
};

editorConfig.MENU_CONF['uploadImage'] = {
  customBrowseAndUpload() {
    title.value = '选择图片'
    activeKey.value = 'image'
    visible.value = true;
  }
}

editorConfig.MENU_CONF['uploadVideo'] = {
  customBrowseAndUpload() {
    title.value = '选择视频'
    activeKey.value = 'video'
    visible.value = true;
  }
}

const content = computed({
  get() { return props.modelValue },
  set(value) {
    // 加入背景颜色
    value = value.replace(/<video/gi, '<video width="100%" style="background-color: #000;"')
    emits('update:modelValue', value)
  },
})

watch(() => content.value, (newVal) => {
  emits('change', newVal)
})

const handleAnnexChange = (data) => {
  datas.value = data
}

const handleAnnexOk = () => {
  datas.value.forEach(r => {
    editorRef.value.insertNode({
      type: r.type, src: r.url, children: [{ text: '' }]
    })
  })
}

const handleCreated = (editor) => {
  editorRef.value = editor;
};

const handleChange = (html) => {
  emits('change', html)
}

// 卸载组件时销毁
onBeforeUnmount(() => {
  editorRef.value?.destroy();
  editorRef.value = null;
});

</script>

<style scoped>
.w-e-full-screen-container {
  z-index: 1002;
}

.wang-editor {
  border: 1px solid #ddd;
}

.toolbar {
  border-bottom: 1px solid #ddd;
}

.editor {
  overflow-y: hidden;
}

.arco-modal {
  width: auto;
}
</style>