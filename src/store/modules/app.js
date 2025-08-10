import { generate, getRgbStr } from '@arco-design/color'
import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { set } from 'nprogress'

const appConfig = {
  title: 'LAdmin',
  wss: false,
  theme: false,
  mode: 'light',
  layout: 'classic',
  skin: 'default',
  color: '#7166f0',
}

const useAppStore = defineStore('app', {
  state: () => ({
    config: appConfig,
    tags: [],
    loading: false,
  }),
  getters: {},
  actions: {
    init() {
      this.config = storage.get('appConfig') || appConfig
      this.setTheme()
    },
    setTheme() {
      const str = this.config.color;
      if (!/^#[0-9A-Za-z]{6}/.test(str)) return;
      generate(str, { list: true, dark: this.config.mode == 'dark' }).forEach((v, i) => {
        const rgbStr = getRgbStr(v)
        document.body.style.setProperty(`--primary-${i + 1}`, rgbStr)
        document.body.style.setProperty(`--arcoblue-${i + 1}`, rgbStr)
      });
      document.body.setAttribute('arco-theme', this.config.mode);
      document.body.setAttribute('mine-skin', this.config.skin);
      document.body.style.setProperty(`--border-radius-small`, '4px')
      document.body.style.setProperty(`--border-radius-medium`, '6px')
      storage.set('appConfig', this.config)
    },
  }
})

export default useAppStore
