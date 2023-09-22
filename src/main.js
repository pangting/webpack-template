import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'
import ajax from '@/service'

const app = createApp(App)
app.config.globalProperties.$ajax = ajax
app.use(createPinia())
app.use(router)
app.mount('#app')
