import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components/web-vue'
import App from './App.vue';
import router from './router'
import store from './store'
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);
app.use(router)
    .use(store)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(globalComponents)
    .mount('#app');
