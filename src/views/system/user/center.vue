<template>

  <a-card class="container" title="个人中心">
    <template #extra>
      <a-link @click="handleForm('edit')">修改密码</a-link>
    </template>

    <a-row align="start" style="padding: 10px 10px 20px;">
      <a-col class="detail-main" :span="16">
        <a-row align="start">

          <a-avatar shape="square" :size="80">
            <a-image width="80" height="80" v-if="user.avatar?.length" :src="user.avatar" />
            <IconUser v-else />
            <template #trigger-icon>
              <a-upload :custom-request="customRequest" :show-file-list="false" style="width: auto;">
                <template #upload-button>
                  <IconEdit />
                </template>
              </a-upload>
            </template>
          </a-avatar>

          <a-descriptions style="margin-left: 20px;flex: 1;" title="管理员" :data="userInfo" size="large" :column="1">
            <template #value="{ data }">
              <template v-if="['nickname', 'email'].includes(data.key)">
                <a-typography>
                  <a-typography-paragraph editable v-model:editText="data.value"
                    @change="handleChange(data.key, $event)" @edit-end="handleUpdate">
                    {{ data.value }}
                  </a-typography-paragraph>
                </a-typography>
              </template>
              <div v-else>{{ data.value }}</div>
            </template>
          </a-descriptions>
        </a-row>
      </a-col>

      <a-col :span="8"> </a-col>
    </a-row>

  </a-card>

  <ai-form-model ref="formRef" :model="formModel" :columns="columns" @submit="handleSubmit" />

</template>
<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/store'
import { appApi } from '@/api/system'

const Api = appApi('system.user')
const attachApi = appApi('system.attach')

const userStore = useUserStore()
const user = reactive(userStore?.info)
const updateData = ref('')

// 响应式数据
const formRef = ref(null)
const formModel = reactive({})

// 字段表单
const columns = [
  { title: '账号', dataIndex: 'username', view_type: 'input', is_disabled: true, is_edit: true, default_value: user.username },
  { title: '原密码', dataIndex: 'password', view_type: 'password', is_required: true, is_edit: true },
  { title: '新密码', dataIndex: 'passwordNew', view_type: 'password', is_required: true, is_edit: true },
  { title: '确认密码', dataIndex: 'passwordOk', view_type: 'password', is_required: true, is_edit: true }
]

const userInfo = ref([
  { label: '账号', value: user?.username, },
  { key: 'nickname', label: '昵称', value: user?.nickname, },
  { key: 'email', label: '邮箱', value: user?.email, },
  { label: '登录IP', value: user?.login_ip },
  { label: '登录时间', value: user?.login_time },
])

// 更新数据
const handleChange = async (key, val) => {
  updateData.value = { id: user.id, [key]: val }
}

// 更新信息
const handleUpdate = async (data = updateData.value) => {
  if (!data) return;
  await Api.edit(data).then(() => {
    userStore.setInfo(Object.assign(user, data))
  })
  updateData.value = null
}

// 自定义上传请求
const customRequest = async ({ fileItem }) => {
  const formData = new FormData()
  formData.append('file', fileItem.file)
  await attachApi.post('upload', formData).then(res => {
    handleUpdate({ id: user.id, avatar: res.url })
  })
}

// 创建表单
const handleForm = () => {
  formModel.value = null
  formRef.value?.open({ title: '修改', module: 'a-modal', width: 500 })
}

// 表单提交
const handleSubmit = async (data) => {
  if (data.passwordOk !== data.passwordNew) {
    Message.error('两次密码不一致')
    return
  }
  await Api.post('alter', data).then(() => formRef.value?.close())
}

</script>

<style scoped lang="scss">
.container {
  flex: 1;
  background: var(--color-bg-2);
  border: none;
}

:deep(.arco-card-header) {
  border-bottom: .5px solid var(--color-neutral-3);
}

div.arco-typography {
  margin-bottom: 0;
}

:deep(.arco-avatar-trigger-icon-button) {
  background-color: rgb(var(--primary-6));
  color: #fff;
}

.arco-avatar {
  background-color: #0002;
}
</style>