<template>
  <select v-model="localValue" class="form-control d-inline">
    <option
      v-for="doctor in doctors"
      :key="'doctor' + doctor.user.id"
      :localValue="getDoctorStr(doctor)"
    >
      {{ getDoctorStr(doctor) }}
    </option>
  </select>
</template>

<script>
import backendApi from '@/gateways/backend-api'
import { getFullName } from '@/utils/user.js'

export default {
  name: 'SelectDoctor',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      doctors: [],
      localValue: this.value
    }
  },
  watch: {
    localValue: 'updateValue'
  },
  created() {
    this.getDoctors()
  },
  methods: {
    getDoctors() {
      backendApi
        .get('/doctors/')
        .then(response => (this.doctors = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить врачей. Ошибка ${error.response.status}`)
        })
    },
    getDoctorStr(doctor) {
      return getFullName(doctor.user)
    },
    updateValue() {
      this.$emit('input', this.localValue)
    }
  }
}
</script>
