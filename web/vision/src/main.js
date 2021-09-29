import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.less'
import './assets/font/iconfont.css'
import webSocketService from './utils/socketUtils'
import china from '../public/static/map/china.json'
// 请求基准路径的配置
axios.defaults.baseURL = '/api'
// 将axios挂载在Vue原型上
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到Vue原型上
// 别的组件中 使用  this.$echarts
window.echarts.registerMap('China', china)
Vue.prototype.$echarts = window.echarts

// 将webSocketService挂载到vue上
webSocketService.Instance.connect()// 创建实例连接到服务器
Vue.prototype.$webSocket = webSocketService.Instance

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
