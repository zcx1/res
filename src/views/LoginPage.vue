<template>
  <div class="login mx-auto my-5">
    <login-form></login-form>
  </div>
</template>

<style scoped>
div.login {
  width: 30rem;
}
</style>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    'login-form': LoginForm
  },
  data() {
    return {}
  }
}
</script>
