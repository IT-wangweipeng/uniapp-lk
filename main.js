import Vue from 'vue'
import App from './App'

import SgPopup from './components/base/sg-popup/sg-popup.vue'
import SgSearch from './components/base/sg-search/sg-search.vue'
import SgDialog from './components/base/sg-dialog/sg-dialog.vue'
import Request from './plugins/request/js/index'
Vue.prototype.$http = Request()

Vue.component('sg-popup', SgPopup)
Vue.component('sg-search', SgSearch)
Vue.component('sg-dialog', SgDialog)

import '@/common/scss/index.scss'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
