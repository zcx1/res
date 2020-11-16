<template>
  <base-page :isPreloader="isPreloader" @reload="init">
    <template #slot1>
      <month-calendar v-model="currentDay"></month-calendar>
      <hr />
      <mode-selector v-model="modeSelector" class="my-3" />
    </template>

    <template #slot2>
      <div>
        <div class="btn-group mr-3">
          <div
            v-for="day in weekDays"
            :key="day"
            :class="{ 'btn-primary': day == currentDay, 'btn-secondary': day != currentDay }"
            class="btn text-capitalize pointer"
            @click="setCurrentDay(day)"
          >
            {{ weekDayFormat(day) }}
          </div>
        </div>
        <b-modal
          id="appointmentForm"
          title="Запись на прием"
          size="lg"
          centered
          no-fade
          hide-footer
        >
          <appointment-form
            :data="appointmentFormData"
            @success="successAppointment"
          ></appointment-form>
        </b-modal>
      </div>

      <table-day-filter-doctor
        v-if="isDoctorMode"
        :appointments="appointments"
        :doctors="doctors"
        :isReady="isInitialized"
        v-model="currentDay"
        @edit="appointmentForm"
        @remove="removeAppointment"
        @create="appointmentForm"
        class="mt-3"
      ></table-day-filter-doctor>

      <table-day-filter-cabinet
        v-if="isCabinetMode"
        :appointments="appointments"
        :cabinets="cabinets"
        :isReady="isInitialized"
        v-model="currentDay"
        @edit="appointmentForm"
        @remove="removeAppointment"
        @create="appointmentForm"
        class="mt-3"
      ></table-day-filter-cabinet>
    </template>
  </base-page>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

import backendApi from '@/gateways/backend-api'
import { DOCTOR_MODE, CABINET_MODE } from '@/components/time_tables/core/core.js'

import AppointmentForm from '@/components/AppointmentForm.vue'
import BasePage from '@/components/base_pages/BasePage.vue'
import ModeSelector from '@/components/time_tables/ModeSelector.vue'
import MonthCalendar from '@/components/MonthCalendar.vue'
import TableDayFilterDoctor from '@/components/time_tables/TableDayFilterDoctor.vue'
import TableDayFilterCabinet from '@/components/time_tables/TableDayFilterCabinet.vue'

moment.locale('ru')

const WORK_DAYS = 6

export default {
  name: 'TableDayPage',
  components: {
    'appointment-form': AppointmentForm,
    'base-page': BasePage,
    'mode-selector': ModeSelector,
    'month-calendar': MonthCalendar,
    'table-day-filter-doctor': TableDayFilterDoctor,
    'table-day-filter-cabinet': TableDayFilterCabinet
  },
  data() {
    return {
      appointmentFormData: {
        id: null,
        day: null,
        time: null,
        doctor: null
      },
      doctors: [],
      cabinets: [],
      appointments: [],
      currentDay: this.$root.currentDay || moment().format('YYYY-MM-DD'),
      weekDays: [],
      isAppointmentsLoaded: false,
      modeSelector: this.$root.modeSelector || '',
      preloaderTimeout: null,
      isPreloader: false
    }
  },
  created() {
    this.init()
  },
  watch: {
    currentDay: 'initCurrentDay',
    isInitialized: 'preloaderDebounce',
    busCreateAppointment: 'appointmentForm'
  },
  computed: {
    ...mapState({
      busCreateAppointment: state => state.bus.busCreateAppointment
    }),
    isInitialized() {
      return this.isAppointmentsLoaded
    },
    isDoctorMode() {
      return this.modeSelector == DOCTOR_MODE
    },
    isCabinetMode() {
      return this.modeSelector == CABINET_MODE
    }
  },
  methods: {
    init() {
      this.initCurrentDay()
      this.loadDoctors()
      this.loadCabinets()
    },
    preloaderDebounce() {
      if (this.isInitialized) {
        clearTimeout(this.preloaderTimeout)
        this.preloaderTimeout = null
        this.isPreloader = false
      } else if (!this.preloaderTimeout) {
        this.preloaderTimeout = setTimeout(() => {
          this.isPreloader = true
        }, 500)
      }
    },
    showError(text) {
      this.$bvToast.toast(text, {
        title: 'Ошибка',
        variant: 'danger',
        solid: true
      })
    },
    weekDayFormat(day) {
      return moment(day, 'YYYY-MM-DD').format('dddd')
    },
    initCurrentDay() {
      this.$root.currentDay = this.currentDay

      this.loadAppointments()

      if (!this.weekDays.includes(this.currentDay)) {
        this.generateWeekDays()
      }
    },
    setCurrentDay(day) {
      this.currentDay = day
    },
    successAppointment() {
      this.$bvModal.hide('appointmentForm')
      this.loadAppointments()
    },
    appointmentForm(data) {
      if (typeof data === 'object') this.appointmentFormData = data
      this.$bvModal.show('appointmentForm')
    },
    removeAppointment(appointment) {
      this.$bvModal
        .msgBoxConfirm('Хотите удалить запись?', {
          title: 'Вы уверены?',
          size: 'sm',
          okVariant: 'danger',
          okTitle: 'Удалить',
          cancelTitle: 'Отмена',
          centered: true,
          noFade: true
        })
        .then(value => {
          if (!value) return

          backendApi
            .delete(`/notifications/${appointment.notification.id}/`)
            .catch(error => {
              this.$bvToast.toast(`Напоминание не удалено! Ошибка: ${error.response.status}`, {
                title: 'Ошибка',
                variant: 'danger',
                solid: true
              })
            })
            .then(() => {
              backendApi
                .delete(`/appointments/${appointment.id}/`)
                .catch(error => {
                  this.$bvToast.toast(`Запись не удалена! Ошибка: ${error.response.status}`, {
                    title: 'Ошибка',
                    variant: 'danger',
                    solid: true
                  })
                })
                .then(() => {
                  this.loadAppointments()
                })
            })
        })
    },
    loadDoctors() {
      backendApi
        .get('/doctors/')
        .then(response => (this.doctors = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить врачей. Ошибка ${error.response.status}`)
        })
    },
    loadCabinets() {
      backendApi
        .get('/cabinets/')
        .then(response => (this.cabinets = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить врачей. Ошибка ${error.response.status}`)
        })
    },
    loadAppointments() {
      this.isAppointmentsLoaded = false
      backendApi
        .get('/appointments', {
          params: {
            start_time__gt: this.currentDay,
            start_time__lt: moment(this.currentDay, 'YYYY-MM-DD')
              .add(1, 'days')
              .format('YYYY-MM-DD')
          }
        })
        .then(response => {
          this.appointments = response.data.results
          this.isAppointmentsLoaded = true
        })
        .catch(error => {
          this.showError(`Не удалось получить записи. Ошибка ${error.response.status}`)
        })
    },
    generateWeekDays() {
      const firstWeekDay = moment(this.currentDay, 'YYYY-MM-DD')
        .startOf('week')
        .format('YYYY-MM-DD')

      this.weekDays = []
      for (let i = 0; i < WORK_DAYS; i++) {
        this.weekDays.push(
          moment(firstWeekDay, 'YYYY-MM-DD')
            .add(i, 'days')
            .format('YYYY-MM-DD')
        )
      }
    }
  }
}
</script>
