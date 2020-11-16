import backendApi from '@/gateways/backend-api.js'
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth.js'
import { USER_REQUEST } from '../actions/user.js'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
}

const actions = {
  [AUTH_REQUEST]: async ({ commit, dispatch }, credential) => {
    commit(AUTH_REQUEST)
    try {
      let response = await backendApi.post('/auth/token/login/', credential)
      const token = response.data.auth_token
      localStorage.setItem('user-token', token)
      backendApi.defaults.headers.common['Authorization'] = 'Token ' + token
      commit(AUTH_SUCCESS, token)
      dispatch(USER_REQUEST)
    } catch (error) {
      commit(AUTH_ERROR, error)
      localStorage.removeItem('user-token')
      throw error
    }
  },
  [AUTH_LOGOUT]: async ({ commit }) => {
    commit(AUTH_LOGOUT)
    delete backendApi.defaults.headers.common['Authorization']
    localStorage.removeItem('user-token')
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
