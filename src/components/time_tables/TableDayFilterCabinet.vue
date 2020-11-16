<template>
  <div :style="tableWidth">
    <day-navigation v-model="localDay" :title="formattedDay" :isReady="isReady"></day-navigation>
    <div class="table-responsive">
      <table class="table table-bordered table-hover timetable">
        <thead>
          <tr>
            <th class="text-center align-top">Время</th>
            <th v-for="cabinet in cabinets" :key="cabinet.id" :style="colWidth" class="text-center">
              <div class="text-primary text-capitalize pointer" @click="routeToWeekTable(cabinet)">
                Кабинет {{ cabinet.name }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in tableTime" :key="time">
            <th scope="row">{{ time }}</th>
            <td
              v-for="cabinet in cabinets"
              :id="cabinet.id + 'T' + time"
              :key="cabinet.id"
              class="position-relative p-0"
            >
              <div v-if="isReady">
                <appointment-card
                  v-if="getAppointmentByIdDay(cabinet.id + 'T' + time)"
                  :appointment="getAppointmentByIdDay(cabinet.id + 'T' + time)"
                  @edit="editAppointment"
                  @remove="removeAppointment"
                ></appointment-card>
                <div
                  v-else
                  class="position-absolute w-100 h-100"
                  @click="createAppointment(time, cabinet.url)"
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

import { colWidth, tableWidth } from './core/core.js'

import AppointmentCard from './core/AppointmentCard.vue'
import DayNavigation from './core/DayNavigation.vue'

moment.locale('ru')

export default {
  name: 'TableDay',
  model: {
    prop: 'day',
    event: 'changeDay'
  },
  components: {
    'appointment-card': AppointmentCard,
    'day-navigation': DayNavigation
  },
  props: {
    appointments: {
      type: Array,
      required: true
    },
    cabinets: {
      type: Array,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    isReady: {
      type: Boolean,
      default() {
        return true
      }
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
      ],
      appointmentsById: {},
      localDay: this.day
    }
  },
  computed: {
    colWidth() {
      const width = colWidth(this.cabinets.length)
      return `width: ${width}%`
    },
    tableWidth() {
      const width = tableWidth(this.cabinets.length)
      return `width: ${width}%`
    },
    formattedDay() {
      return moment(this.day, 'YYYY-MM-DD').format('DD MMMM YYYY')
    }
  },
  watch: {
    appointments: 'resetAppointmentsById',
    localDay: 'changeDay'
  },
  methods: {
    changeDay(newDay) {
      this.$emit('changeDay', newDay)
    },
    resetAppointmentsById() {
      this.appointmentsById = {}
    },
    getAppointmentByIdDay(id) {
      const appointmentsById = this.appointmentsById

      if (id in appointmentsById) return appointmentsById[id]

      appointmentsById[id] = this.appointments.find(
        item =>
          item.cabinet.id +
            moment(item.start_time).format('THH') +
            (moment(item.start_time).format('mm') >= 30 ? ':30' : ':00') ===
          id
      )

      return appointmentsById[id]
    },
    editAppointment(appointment) {
      this.$emit('edit', appointment)
    },
    removeAppointment(appointment) {
      this.$emit('remove', appointment)
    },
    createAppointment(time, cabinet) {
      this.$emit('create', {
        id: null,
        day: this.day,
        time: time,
        doctor: null,
        cabinet: cabinet
      })
    },
    routeToWeekTable(cabFilter) {
      this.$root.cabFilter = [cabFilter]
      this.$router.push('/week/')
    }
  }
}
</script>
