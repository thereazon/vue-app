import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/tailwind.css'
import 'floating-vue/dist/style.css'
import { Icon } from 'vant'
import FloatingVue from 'floating-vue'
import { VueScreenSizeMixin } from 'vue-screen-size'
const app = createApp(App)
app.use(createPinia())
app.use(FloatingVue)
app.use(Icon)
app.use(router)
app.mixin(VueScreenSizeMixin)
app.mount('#app')
