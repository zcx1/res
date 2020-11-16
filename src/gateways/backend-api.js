import axios from 'axios'

import backendURL from '@/gateways/backend-url.js'

import router from '@/router/index.js'

const baseURL = `${backendURL}/api/v1`

const backendApi = axios.create({
  baseURL: baseURL,
  timeout: 5 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

backendApi.interceptors.response.use(undefined, error => {
  return new Promise(() => {
    if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
      this.$store.dispatch('auth/logout')
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      })
    }
    throw error
  })
})

export default backendApi
