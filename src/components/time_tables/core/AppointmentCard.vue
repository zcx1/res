<template>
  <div
    v-b-tooltip.hover.html
    :title="getTooltipAppointment()"
    :class="getAppointmentClass()"
    :style="getAppointmentStyle()"
  >
    <h5 class="m-0 pointer text-center h-100" @click="editAppointment">
      {{ getAppointmentsName() }}
    </h5>
    <div class="position-absolute rb-0">
      <div class="d-flex justify-content-end">
        <div v-b-tooltip.hover title="Медицинская карта" class="pointer mr-2" @click="medicalCard">
          <font-awesome-icon icon="book-medical"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Редактировать запись" class="pointer mr-2">
          <font-awesome-icon icon="edit" @click="editAppointment"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Удалить запись" class="pointer mr-1">
          <font-awesome-icon icon="trash-alt" @click="removeAppointment"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { getShortName, getFullName } from '@/utils/user.js'

const ONE_CELL_MS = 30 * 60 * 1000
const HEIGHT_CARD_COEF = 100 / ONE_CELL_MS
const BORDER_PERCENT = 2

export default {
  name: 'AppointmentCard',
  props: {
    appointment: {
      type: Object,
      required: true
    }
  },
  methods: {
    getTooltipAppointment() {
      const appointment = this.appointment
      const cabinet = appointment.cabinet.name
      const doctor = getFullName(appointment.doctor.user)
      const patient = getFullName(appointment.patient.user)
      const service = appointment.service.name ? appointment.service.name : ''
      const startTime = appointment.start_time ? moment(appointment.start_time).format('HH:mm') : ''
      const endTime = appointment.end_time ? moment(appointment.end_time).format('HH:mm') : ''
      let phone = appointment.patient.user.phone ? appointment.patient.user.phone : ''

      if (phone) phone = `тел.: ${phone}`

      return `
        ${service}<br />
        ${startTime} - ${endTime}<br />
        Кабинет: ${cabinet}<br />
        Врач: ${doctor}<br />
        Пациент: ${patient}<br />
        ${phone}
      `
    },
    getAppointmentClass() {
      return 'position-absolute w-100 border zindex-fixed ' + this.appointment.doctor.html_classes
    },
    getAppointmentStyle() {
      const appointment = this.appointment

      let startMinute = 0
      if (appointment.start_time) startMinute = Number(moment(appointment.start_time).format('mm'))

      let top = 0
      if (startMinute > 0 && startMinute < 30) top = (startMinute * 100) / 30
      else if (startMinute > 30) top = ((startMinute - 30) * 100) / 30

      const period = moment(appointment.end_time) - moment(appointment.start_time)
      const min30 = period / ONE_CELL_MS
      const height = period * HEIGHT_CARD_COEF + BORDER_PERCENT * (min30 - 1)

      return `height: ${height}%; top: ${top}%;`
    },
    getAppointmentsName() {
      return getShortName(this.appointment.patient.user)
    },
    checkAction() {
      if (moment(this.appointment.start_time) < moment().subtract('hours', 12)) {
        this.$bvToast.toast(`Нельзя редактировать старые записи!`, {
          title: 'Сообщение',
          variant: 'info',
          solid: true
        })
        return false
      }
      return true
    },
    editAppointment() {
      if (this.checkAction()) this.$emit('edit', this.appointment)
    },
    removeAppointment() {
      if (this.checkAction()) this.$emit('remove', this.appointment)
    },
    medicalCard() {
      this.$root.patientId = this.appointment.patient.user.id
      this.$router.push('/patients/medical_card')
    }
  }
}
</script>
<style scoped>
.rb-0 {
  right: 0;
  bottom: 0;
  z-index: 1000;
}
</style>
