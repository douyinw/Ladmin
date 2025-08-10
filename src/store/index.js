import { createPinia } from 'pinia'
import useMenuStore from './modules/menu'
import useUserStore from './modules/user'
import useAppStore from './modules/app'

const pinia = createPinia()

export {
  useMenuStore,
  useUserStore,
  useAppStore,
}

export default pinia
