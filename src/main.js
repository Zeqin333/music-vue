// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import attachFastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

import 'common/stylus/index.styl'

Vue.use(VueLazyload, {
  loading: require('common/image/default.png') // 设置图片都需要想这样子设置
})

attachFastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
