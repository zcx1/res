<template>
  <form>
    <div v-for="doctor in doctors" :key="'doctor' + doctor.user.id" class="form-check">
      <label class="form-check-label pointer">
        <input v-model="localFilter" class="form-check-input" type="radio" :value="[doctor]" />
        <div :class="doctor.html_classes" class="d-inline-block border color-marker"></div>
        {{ getDoctorName(doctor) }}
      </label>
    </div>
  </form>
</template>

<script>
import { getShortName } from '@/utils/user.js'

export default {
  name: 'DoctorFilter',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    doctors: {
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
    },
    getDoctorName(doctor) {
      return getShortName(doctor.user)
    }
  }
}
</script>

<style scoped>
.color-marker {
  width: 1rem;
  height: 1rem;
}
</style>
