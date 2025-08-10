
import aiTable from '../ai-table/table.vue'
import aiFormModel from '../ai-form/form.vue'
import aiFormItem from '../ai-form-item/form-item.vue'
import aiAttachGroup from '../ai-attach/group.vue'
import aiWangEditor from '../ai-wangEditor/editor.vue'
import aiUploadImage from '../ai-upload-image/upimage.vue'
import aiUploadFile from '../ai-upload-file/upfile.vue'
import aiIcon from '../ai-icon/icon.vue'
import aiLoading from '../ai-loading/loading.vue'

export default {
  install(Vue) {
    Vue.component('aiTable', aiTable)
    Vue.component('aiFormModel', aiFormModel)
    Vue.component('aiFormItem', aiFormItem)
    Vue.component('aiAttachGroup', aiAttachGroup)
    Vue.component('aiWangEditor', aiWangEditor)
    Vue.component('aiUploadImage', aiUploadImage)
    Vue.component('aiUploadFile', aiUploadFile)
    Vue.component('aiIcon', aiIcon)
    Vue.component('aiLoading', aiLoading)
  }
}
