<template>
  <div class="card">
    <article class="card-body">
      <h4 class="card-title text-center mb-4 mt-1">Вход в систему</h4>
      <div v-if="err_msg" class="alert alert-danger" role="alert">{{ err_msg }}</div>
      <form @submit.prevent="login">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <font-awesome-icon icon="user"></font-awesome-icon>
              </span>
            </div>
            <input
              v-model="username"
              required
              class="form-control"
              placeholder="Имя пользователя"
              type="text"
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <font-awesome-icon icon="lock"></font-awesome-icon>
              </span>
            </div>
            <input
              v-model="password"
              required
              class="form-control"
              placeholder="******"
              type="password"
            />
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block">Войти</button>
        </div>
      </form>
    </article>
  </div>
</template>

<script>
import { AUTH_REQUEST, AUTH_LOGOUT } from '@/store/actions/auth'

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      err_msg: ''
    }
  },
  watch: {
    username() {
      this.removeErrMsg()
    },
    password() {
      this.removeErrMsg()
    }
  },
  created() {
    this.$store.dispatch(AUTH_LOGOUT)
  },
  methods: {
    login() {
      const { username, password } = this
      this.$store
        .dispatch(AUTH_REQUEST, { username, password })
        .then(() => {
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch(() => {
          this.err_msg = 'Неверный логин или пароль'
        })
    },
    removeErrMsg() {
      this.err_msg = ''
    }
  }
}
</script>
