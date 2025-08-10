export const realtionsType = [
  { name: '一对一', value: 'hasOne' },
  { name: '一对多', value: 'hasMany' },
  { name: '一对一（反向)', value: 'belongsTo' },
  { name: '多对多', value: 'belongsToMany' }
]

export const queryType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'egt' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'elt' },
  { label: 'LIKE', value: 'like' },
  { label: 'IN', value: 'in' },
  { label: 'NOT IN', value: 'notin' },
  { label: 'BETWEEN', value: 'between' }
]

export const componentType = [
  { label: '文本框', value: 'input' },
  { label: '密码框', value: 'password' },
  { label: '数字框', value: 'number' },
  { label: '浮点数框', value: 'float' },
  { label: '标签框', value: 'tag' },
  { label: '图标框', value: 'icon' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '下拉框', value: 'select' },
  { label: '树形下拉框', value: 'treeSelect' },
  { label: '文本域', value: 'textarea' },
  { label: '开关', value: 'switch' },
  { label: '滑块', value: 'slider' },
  //{ label: '评分器', value: 'rate' },
  // { label: '提及', value: 'mention' },
  //{ label: '级联选择器', value: 'cascader' },
  // { label: '数据穿梭框', value: 'transfer' },
  //{ label: '省市区联动', value: 'cityLinkage' },
  { label: '富文本', value: 'editor' },
  { label: '图片上传', value: 'upimage' },
  { label: '文件上传', value: 'upfile' },
  { label: '日期选择器', value: 'date' },
  { label: '时间选择器', value: 'time' },
]

export const dateType = [
  { label: "年月日", value: "dict" },
  { label: "年", value: "YYYY" },
  { label: "季", value: "category" },
  { label: "月", value: "category" },
  { label: "日", value: "category" },
]

export const extendType = [
  { label: "A.数据字典", value: "dict" },
  { label: "B.数据类别", value: "category" }
]

export const module = [
  { label: "模态框", value: "a-modal" },
  { label: "抽屉", value: "a-drawer" }
]

export const state = [
  { label: "是", value: 1 },
  { label: "否", value: 0 }
]

export const show = [
  { label: "显示", value: 1 },
  { label: "隐藏", value: 0 }
]

export const json = [
  { label: "默认", value: 0 },
  { label: "Json", value: 1 }
]

export const buttons = [
  {
    "id": "1",
    "key": "add",
    "icon": "IconPlus",
    "size": "medium",
    "type": "primary",
    "float": "top",
    "title": "新增",
    "status": "normal",
  },
  {
    "id": "2",
    "key": "dels",
    "icon": "IconDelete",
    "size": "medium",
    "type": "primary",
    "float": "top",
    "title": "删除",
    "status": "danger",
  },
  {
    "id": "3",
    "key": "join",
    "icon": "IconUnorderedList",
    "size": "medium",
    "type": "secondary",
    "float": "top",
    "title": "类别",
    "status": "normal"
  },
  {
    "id": "4",
    "key": "edit",
    "icon": "IconEdit",
    "size": "medium",
    "type": "primary",
    "float": "right",
    "title": "编辑",
    "status": "normal",
  },
  {
    "id": "5",
    "key": "delete",
    "icon": "IconDelete",
    "size": "medium",
    "type": "primary",
    "float": "right",
    "title": "删除",
    "status": "danger",
  }
]