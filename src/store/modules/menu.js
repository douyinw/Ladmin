import { defineStore } from 'pinia'

const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [],
  }),
  getters: {},
  actions: {
    setMenus(data) {
      this.menus = this.formatMenu(data)
    },
    
    // 递归转换菜单结构（处理子菜单的 key）
    formatMenu(items) {
      return items.reduce((res, item) => {
        if (item.type === 'M' && item.show === 1) {
          res.push({
            key: item.path,
            title: item.title,
            icon: item.icon,
            children: item.children ? this.formatMenu(item.children) : undefined
          })
        }
        return res
      }, [])
    }

  }
})

export default useMenuStore 