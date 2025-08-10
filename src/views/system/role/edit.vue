<template>
  <a-modal v-model:visible="visible" unmount-on-close @before-ok="handleSubmit">
    <template #title>菜单权限</template>
    <a-form :model="{}">
      <a-form-item label="角色名称">
        <a-input disabled :default-value="props.data?.name" />
      </a-form-item>
      <a-form-item label="菜单列表">
        <a-tree ref="treeRef" v-model:checked-keys="checkedKeys" :data="menuData" :check-strictly="checkStrictly"
          :field-names="{ title: 'title', key: 'id' }" :virtualListProps="{
            height: 300,
          }" :checkable="true" style="width: 100%;" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref,  computed, watch } from 'vue'
import { appApi } from '@/api/system'

const emits = defineEmits(['update:visible'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  menuData: {
    type: Array,
    default: () => []
  }
})


const roleApi = appApi('system.role')
const treeRef = ref(null)
const checkedKeys = ref([])
const checkStrictly = ref(true)

const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emits('update:visible', val)
  }
})

watch(() => props.visible, async (val) => {
  if (val) initData()
})

const initData = async () => {
  const res = await roleApi.read({ id: props.data?.id })
  checkedKeys.value = res.menus
  treeRef.value?.expandAll()
}

const handleSubmit = async () => {
  await roleApi.post('setup', {
    role_id: props.data?.id,
    menu_id: checkedKeys.value
  })
}

</script>
