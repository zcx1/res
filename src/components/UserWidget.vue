<template>
  <span>
    {{ authUserName }}
  </span>
</template>

<script>
import { getShortName } from '@/utils/user.js'

export default {
  name: 'UserWidget',
  computed: {
    authUserName() {
      return getShortName(this.$store.getters.getProfile)
    }
  }
}
</script>
