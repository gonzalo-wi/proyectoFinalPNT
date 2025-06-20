import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)
app.use(router)
app.use(MotionPlugin)
app.mount('#app')