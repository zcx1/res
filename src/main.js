import Vue from 'vue'

import 'bootstrap/dist/css/bootstrap.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faCircle,
  faPlus,
  faTrashAlt,
  faEdit,
  faBookMedical,
  faUser,
  faLock,
  faPhone,
  faFileContract,
  faExclamationTriangle,
  faPrint,
  faRedo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
  faCircle,
  faPlus,
  faTrashAlt,
  faEdit,
  faBookMedical,
  faUser,
  faLock,
  faPhone,
  faFileContract,
  faExclamationTriangle,
  faPrint,
  faRedo
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import 'bootstrap-vue/dist/bootstrap-vue.css'
import { NavbarPlugin } from 'bootstrap-vue'
Vue.use(NavbarPlugin)
import { ModalPlugin } from 'bootstrap-vue'
Vue.use(ModalPlugin)
import { TooltipPlugin } from 'bootstrap-vue'
Vue.use(TooltipPlugin)
import { ToastPlugin } from 'bootstrap-vue'
Vue.use(ToastPlugin)

import App from '@/App.vue'
import router from '@/router/index.js'
import backendApi from '@/gateways/backend-api.js'
import store from '@/store/index.js'
import { USER_REQUEST } from '@/store/actions/user.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

const token = localStorage.getItem('user-token')
if (token) {
  backendApi.defaults.headers.common['Authorization'] = 'Token ' + token
  store.dispatch(USER_REQUEST)
}
