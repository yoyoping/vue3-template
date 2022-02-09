import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './router/guard'
import store from './store'
import './assets/css/index.scss'
import Img from './components/Img.vue'
// message的样式需要单独引入
import 'ant-design-vue/es/message/style/css'
import 'virtual:windi.css'

const app = createApp(App)
app.use(router)
app.use(store)

// 挂载全局组件
app.component('Img', Img)

app.mount('#app')
