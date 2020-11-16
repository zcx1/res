<template>
  <div>
    <div class="text-primary pointer" @click="showForm">
      {{ fullPatientName }}
    </div>
    {{ patientAddress }} <br />
    {{ patientPhone }} <br />
  </div>
</template>

<script>
import { getFullName } from '@/utils/user.js'

export default {
  name: 'PatientInfo',
  props: {
    patient: {
      type: Object,
      required: true
    }
  },
  computed: {
    fullPatientName() {
      let fullName = ''
      if (this.patient) fullName = getFullName(this.patient.user)
      return fullName
    },
    patientAddress() {
      return this.getUserProperty('address')
    },
    patientPhone() {
      return this.getUserProperty('phone')
    }
  },
  methods: {
    getUserProperty(property) {
      let result = ''
      if (this.patient) result = this.patient.user[property]
      return result
    },
    showForm() {
      this.$emit('showForm')
    }
  }
}
</script>
