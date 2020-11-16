<template>
  <table-day-print
    :appointments="appointments"
    :doctors="doctors"
    :day="currentDay"
    class="mt-3"
  ></table-day-print>
</template>

<script>
import moment from 'moment'
import backendApi from '@/gateways/backend-api'

import TableDayPrint from '@/components/time_tables/TableDayPrint.vue'

moment.locale('ru')

export default {
  name: 'TableDayPrintPage',
  components: {
    'table-day-print': TableDayPrint
  },
  data() {
    return {
      doctors: [],
      appointments: [],
      currentDay: ''
    }
  },
  created() {
    this.setCurrentDay()
    this.loadDoctors()
    this.loadAppointments()
  },
  methods: {
    setCurrentDay() {
      this.currentDay = moment().format('YYYY-MM-DD')
    },
    loadDoctors() {
      backendApi
        .get('/doctors/')
        .then(response => (this.doctors = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить врачей. Ошибка ${error.response.status}`)
        })
    },
    loadAppointments() {
      backendApi
        .get('/appointments', {
          params: {
            start_time__gt: this.currentDay,
            start_time__lt: moment(this.currentDay, 'YYYY-MM-DD')
              .add(1, 'days')
              .format('YYYY-MM-DD')
          }
        })
        .then(response => (this.appointments = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить записи. Ошибка ${error.response.status}`)
        })
    }
  }
}
</script>
