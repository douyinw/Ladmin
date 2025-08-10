<template>
    <a-modal v-model:visible="visible" title="上传素材" ok-text="上传" cancel-text="关闭" :width="600"
        :body-style="{ padding: '16px' }" draggable unmount-on-close @ok="confirmUpload" @cancel="uploadCancel">
        <a-upload ref="uploadRef" :custom-request="customRequest" v-model:fileList="fileList" :auto-upload="false"
            :limit="10" draggable multiple @success="successChange">
        </a-upload>
    </a-modal>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { appApi } from '@/api/system'

const emits = defineEmits(['update:visible', 'change']);

const props = defineProps({
    modelVisible: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: Number,
        default: null
    },
    mode: {
        type: String,
        default: null
    },
})

const Api = appApi('system.attach')

const visible = ref(props.modelVisible)
const uploadRef = ref(null)
const fileList = ref([]);
const count = ref(0)
const successCount = ref(0)
const failCount = ref(0)

watch(() => props.modelVisible, (val) => {
    visible.value = val
})

const customRequest = async (options) => {
    const { onError, onSuccess, fileItem } = options;
    try {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('group_id', props.groupId || 1);
        const res = await Api.upload(formData);

        if (res) {
            successCount.value++
            onSuccess(res);
        } else {
            failCount.value++
            onError(res);
        }

        count.value++
        if (count.value === fileList.value.length) {
            if (successCount.value === count.value) {
                Message.success(`上传成功${successCount.value}条`)
            } else {
                Message.info(`上传成功${successCount.value}条，失败${failCount.value}条`)
            }
            successCount.value = 0
            failCount.value = 0
            count.value = 0
        }
    } catch (err) {
        onError(err);
    }
};

const confirmUpload = (e) => {
    e.stopPropagation();
    const uploading = fileList.value.find(item => item.status === 'init');
    if (!uploading) {
        Message.warning('请选择文件并上传')
        return
    }
    uploadRef.value.submit();
}

const uploadCancel = () => {
    fileList.value = []
    visible.value = false
    emits('update:visible', false)
}

const successChange = (file) => {
    emits('change', file)
}

</script>
<style scoped lang="scss"></style>