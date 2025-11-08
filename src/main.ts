import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)    // ✅ ativa o Vue Router
app.mount('#app')