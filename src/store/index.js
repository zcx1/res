import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth.js'
import bus from './modules/bus.js'
import user from './modules/user.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    bus,
    user
  },
  strict: debug
})
