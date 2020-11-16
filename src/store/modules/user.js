import Vue from 'vue'

import backendApi from '@/gateways/backend-api.js'
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user.js'
import { AUTH_LOGOUT } from '../actions/auth.js'

const state = () => ({
  status: '',
  profile: {}
})

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.last_name
}

const actions = {
  [USER_REQUEST]: async ({ commit, dispatch }) => {
    commit(USER_REQUEST)
    try {
      let response = await backendApi.get('/auth/users/me/')
      commit(USER_SUCCESS, response.data)
    } catch {
      commit(USER_ERROR)
      dispatch(AUTH_LOGOUT)
    }
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, profile) => {
    state.status = 'success'
    Vue.set(state, 'profile', profile)
  },
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: state => {
    state.profile = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
