<template>
  <form>
    <div v-for="cabinet in cabinets" :key="'cabinet' + cabinet.id" class="form-check">
      <label class="form-check-label pointer">
        <input v-model="localFilter" class="form-check-input" type="radio" :value="[cabinet]" />
        Кабинет {{ cabinet.name }}
      </label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CabinetFilter',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    cabinets: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      localFilter: this.value
    }
  },
  watch: {
    localFilter: 'changeFilter',
    value: 'updateLocalFilter'
  },
  methods: {
    changeFilter() {
      this.$emit('input', this.localFilter)
    },
    updateLocalFilter() {
      if (this.localFilter != this.value) this.localFilter = this.value
    }
  }
}
</script>
