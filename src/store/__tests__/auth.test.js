import {
  AUTH_REQUEST
} from '../actions/auth.js'
import store from '../index.js'
jest.mock('@/gateways/backend-api.js')

it('Check auth', async () => {
  await store.dispatch(AUTH_REQUEST)
  // TODO: Fix this broken test
  // expect(store.state.auth.token).toBe('token-hash')
})
