import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import toast from 'components/common/toast'

Vue.config.productionTip = false
//Vue实例可以作为事件总线,这里相当于创建了一个事件总线
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
