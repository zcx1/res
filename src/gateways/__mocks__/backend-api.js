export default {
  defaults: {
    headers: {
      common: {}
    }
  },
  post: url => {
    if (url === '/auth/token/login/') {
      return Promise.resolve({
        data: {
          auth_token: 'token-hash'
        }
      })
    }
  }
}
