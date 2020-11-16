import router from '@/router/index.js'
import { shallowMount } from '@vue/test-utils'
import App from '../App.vue'

describe('Test App', () => {
  it('App works!', () => {
    const wrapper = shallowMount(App, { router })
  })
})
