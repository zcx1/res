<template>
  <div>
    <nav class="d-flex justify-content-between my-3">
      <div>{{ dateTableTitle }}</div>
    </nav>
    <table class="table_print" border="1">
      <thead>
        <tr>
          <th class="text-center align-top py-4">Время</th>
          <th
            v-for="doctor in doctors"
            :key="doctor.user.id"
            :style="doctorColWidth"
            class="text-center"
          >
            <div class="text-capitalize">
              <div>
                {{ doctor.user.last_name + ' ' + doctor.user.first_name }}
              </div>
              <small>{{ doctor.user.position }}</small>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="keyTime in tableTime" :key="keyTime">
          <th scope="row" class="py-4">{{ keyTime }}</th>
          <td
            v-for="doctor in doctors"
            :id="doctor.user.id + 'T' + keyTime"
            :key="doctor.user.id"
            class="position-relative p-0"
          >
            <div
              v-if="getAppointmentByIdDay(doctor.user.id + 'T' + keyTime)"
              class="position-absolute w-100 border zindex-fixed list-group-item-secondary"
              :style="getAppointmentStyleById(doctor.user.id + 'T' + keyTime)"
            >
              <div class="mx-auto px-3">
                <span v-html="getAppointmentsInfoById(doctor.user.id + 'T' + keyTime)"></span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import moment from 'moment'
import { getFullName } from '@/utils/user.js'

moment.locale('ru')

export default {
  name: 'TableDayPrint',
  props: {
    appointments: {
      type: Array,
      required: true
    },
    doctors: {
      type: Array,
      required: true
    },
    day: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableTime: [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30'
      ]
    }
  },
  computed: {
    doctorColWidth() {
      const width = 100 / this.doctors.length
      return `width: ${width}%`
    },
    dateTableTitle() {
      return moment(this.day, 'YYYY-MM-DD').format('DD MMMM YYYY')
    }
  },
  methods: {
    getAppointmentByIdDay(id) {
      if (!id) throw 'Required argument "id" is missed!'
      return this.appointments.find(
        item =>
          item.doctor.user.id +
            moment(item.start_time).format('THH') +
            (moment(item.start_time).format('mm') >= 30 ? ':30' : ':00') ===
          id
      )
    },
    getAppointmentsInfoById(id) {
      const appointment = this.getAppointmentByIdDay(id)
      if (appointment) {
        const fullName = getFullName(appointment.patient.user)
        const service = appointment.service.name ? appointment.service.name : ''
        const startTime = appointment.start_time
          ? moment(appointment.start_time).format('HH:mm')
          : ''
        const endTime = appointment.end_time ? moment(appointment.end_time).format('HH:mm') : ''
        return `${fullName}<br />${service}. ${startTime}-${endTime}`
      }
    },
    // TODO: This copy paste was left, because the component will be completely refactor later
    getAppointmentStyleById(id) {
      const ONE_CELL_MS = 30 * 60 * 1000
      const HEIGHT_CARD_COEF = 100 / ONE_CELL_MS
      const BORDER_PERCENT = 2

      const appointment = this.getAppointmentByIdDay(id)

      let startMinute = 0
      if (appointment.start_time) startMinute = Number(moment(appointment.start_time).format('mm'))

      let top = 0
      if (startMinute != 0 && startMinute != 30) top = (startMinute * 100) / 30

      const period = moment(appointment.end_time) - moment(appointment.start_time)
      const min30 = period / ONE_CELL_MS
      const height = period * HEIGHT_CARD_COEF + BORDER_PERCENT * (min30 - 1)

      return `height: ${height}%; top: ${top}%;`
    }
  }
}
</script>
