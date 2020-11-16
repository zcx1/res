<template>
  <my-preloader-screen></my-preloader-screen>
</template>

<script>
import MyPreloaderScreen from '@/components/preloaders/MyPreloaderScreen.vue'

export default {
  name: 'TestPage',
  components: {
    'my-preloader-screen': MyPreloaderScreen
  }
}
</script>
