<template>
  <div class="h-100">
    <div class="modal-backdrop"></div>
    <my-preloader size="20" class="preloader"></my-preloader>
  </div>
</template>

<script>
import MyPreloader from './MyPreloader.vue'

export default {
  name: 'MyPreloaderScreen',
  components: {
    'my-preloader': MyPreloader
  }
}
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
}
.modal-backdrop {
  background-color: #fff;
}
</style>
