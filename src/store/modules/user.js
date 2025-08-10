import { defineStore } from 'pinia'
import storage from '@/utils/storage'

const useUserStore = defineStore('user', {
  state: () => ({
    info: storage.get('userInfo') || {},
    token: storage.get('userToken') || null
  }),
  getters: {
    getInfo: (state) => {
      return state.info
    }
  },
  actions: {
    setInfo(data) {
      storage.set('userInfo', data)
      this.info = data
    },
    setToken(token) {
      storage.set('userToken', token)
      this.token = token
    },
  }
})

export default useUserStore
