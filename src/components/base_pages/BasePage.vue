<template>
  <div>
    <page-header @reload="reload"></page-header>

    <div class="container-fluid p-3">
      <div class="row">
        <div class="col-12 col-md-2">
          <slot name="slot1"></slot>
        </div>
        <div class="col-12 col-md-10">
          <slot name="slot2"></slot>
        </div>
      </div>
    </div>

    <page-footer></page-footer>

    <my-preloader-screen v-if="isPreloaderLocal"></my-preloader-screen>
  </div>
</template>

<script>
import MyPreloaderScreen from '@/components/preloaders/MyPreloaderScreen.vue'
import PageHeader from './PageHeader.vue'
import PageFooter from './PageFooter.vue'

export default {
  name: 'BasePage',
  data() {
    return {
      isReload: false
    }
  },
  props: {
    isPreloader: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    'my-preloader-screen': MyPreloaderScreen,
    'page-header': PageHeader,
    'page-footer': PageFooter
  },
  computed: {
    isPreloaderLocal() {
      return this.isPreloader || this.isReload
    }
  },
  methods: {
    reload() {
      this.isReload = true
      setTimeout(() => {
        this.isReload = false
      }, 1000)
      this.$emit('reload')
    }
  }
}
</script>
