<template>
  <div :style="tableWidth">
    <week-navigation
      v-model="localFirstWeekDay"
      :title="docFilterVerbose"
      :isReady="isReady"
    ></week-navigation>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th class="text-center align-top">Время</th>
            <th v-for="day in weekDays" :key="day" :style="colWidth" class="text-center">
              <div class="text-primary text-capitalize pointer" @click="routeToDayTable(day)">
                {{ weekDayFormat(day) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in tableTime" :key="time">
            <th class="text-center">{{ time }}</th>
            <td v-for="day in weekDays" :key="day + 'T' + time" class="position-relative p-0">
              <div v-if="isReady">
                <appointment-card
                  v-if="getAppointmentById(day + 'T' + time)"
                  :appointment="getAppointmentById(day + 'T' + time)"
                  @edit="editAppointment"
                  @remove="removeAppointment"
                ></appointment-card>
                <div
                  v-else
                  class="position-absolute w-100 h-100"
                  @click="createAppointment(day, time)"
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

import { getFullName } from '@/utils/user.js'
import { colWidth, tableWidth } from './core/core.js'

import AppointmentCard from './core/AppointmentCard.vue'
import WeekNavigation from './core/WeekNavigation.vue'

moment.locale('ru')

export default {
  name: 'TableWeek',
  components: {
    'appointment-card': AppointmentCard,
    'week-navigation': WeekNavigation
  },
  model: {
    prop: 'firstWeekDay',
    event: 'changeWeek'
  },
  props: {
    docFilter: {
      type: Array,
      required: true
    },
    appointments: {
      type: Array,
      required: true
    },
    weekDays: {
      type: Array,
      required: true
    },
    firstWeekDay: {
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
      localFirstWeekDay: this.firstWeekDay
    }
  },
  computed: {
    filteredAppointments() {
      if (!this.docFilter.length) return this.appointments
      const doctorIdArr = this.docFilter.map(doctor => doctor.user.id)
      return this.appointments.filter(item => doctorIdArr.includes(item.doctor.user.id))
    },
    colWidth() {
      const width = colWidth(this.weekDays.length)
      return `width: ${width}%`
    },
    tableWidth() {
      const width = tableWidth(this.weekDays.length)
      return `width: ${width}%`
    },
    docFilterVerbose() {
      return this.docFilter.map(doctor => getFullName(doctor.user)).join(', ')
    }
  },
  watch: {
    filteredAppointments: 'resetAppointmentsById',
    localFirstWeekDay: 'changeWeek'
  },
  methods: {
    changeWeek(newFirstWeekDay) {
      this.$emit('changeWeek', newFirstWeekDay)
    },
    resetAppointmentsById() {
      this.appointmentsById = {}
    },
    weekDayFormat(day) {
      return moment(day, 'YYYY-MM-DD').format('ddd DD.MM.YY')
    },
    prevWeek() {
      this.newWeek(-1)
    },
    nextWeek() {
      this.newWeek(1)
    },
    newWeek(shift) {
      const newFirstDay = moment(this.firstWeekDay, 'YYYY-MM-DD')
        .add(shift, 'week')
        .format('YYYY-MM-DD')
      this.$emit('changeWeek', newFirstDay)
    },
    getAppointmentById(id) {
      const appointmentsById = this.appointmentsById

      if (id in appointmentsById) return appointmentsById[id]

      appointmentsById[id] = this.filteredAppointments.find(
        item =>
          moment(item.start_time).format('YYYY-MM-DDTHH') +
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
    createAppointment(day, time) {
      this.$emit('create', {
        id: null,
        day: day,
        time: time,
        doctor: this.docFilter[0].url,
        cabinet: null
      })
    },
    routeToDayTable(day) {
      this.$root.currentDay = day
      this.$router.push('/day/')
    }
  }
}
</script>
