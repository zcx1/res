import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import LoginForm from '../LoginForm.vue'
import { AUTH_REQUEST, AUTH_LOGOUT } from '../../store/actions/auth.js'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.component('font-awesome-icon', FontAwesomeIcon)

describe('LoginForm.vue', () => {
  const actions = {
    AUTH_REQUEST: jest.fn(),
    AUTH_LOGOUT: jest.fn()
  }
  const store = new Vuex.Store({
    actions
  })
  const wrapper = shallowMount(LoginForm, { store, localVue })

  it('Call AUTH_LOGOUT action when mounted', () => {
    expect(actions[AUTH_LOGOUT]).toHaveBeenCalled()
  })

  it('Has button', () => {
    expect(wrapper.get('button'))
  })

  it('Call AUTH_REQUEST action when form submitted', () => {
    const wrapper = shallowMount(LoginForm, { store, localVue })
    wrapper.find('form').trigger('submit')
    expect(actions[AUTH_REQUEST]).toHaveBeenCalled()
  })
})
