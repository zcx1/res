<template>
  <base-page :isPreloader="isPreloader" @reload="init">
    <template #slot1>
      <month-calendar v-model="currentDay"></month-calendar>
      <hr />
      <mode-selector v-model="modeSelector" class="my-3" />
      <doctor-filter v-if="isDoctorMode" v-model="docFilter" :doctors="doctors"></doctor-filter>
      <cabinet-filter
        v-if="isCabinetMode"
        v-model="cabFilter"
        :cabinets="cabinets"
      ></cabinet-filter>
    </template>

    <template #slot2>
      <b-modal id="appointmentForm" title="Запись на прием" size="lg" centered no-fade hide-footer>
        <appointment-form
          :data="appointmentFormData"
          @success="successAppointment"
        ></appointment-form>
      </b-modal>

      <table-week-filter-doctor
        v-if="isDoctorMode"
        :docFilter="docFilter"
        :appointments="appointments"
        :weekDays="weekDays"
        :isReady="isInitialized"
        v-model="firstWeekDay"
        @edit="appointmentForm"
        @remove="removeAppointment"
        @create="appointmentForm"
      ></table-week-filter-doctor>

      <table-week-filter-cabinet
        v-if="isCabinetMode"
        :cabFilter="cabFilter"
        :appointments="appointments"
        :weekDays="weekDays"
        :isReady="isInitialized"
        v-model="firstWeekDay"
        @edit="appointmentForm"
        @remove="removeAppointment"
        @create="appointmentForm"
      ></table-week-filter-cabinet>
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
import DoctorFilter from '@/components/time_tables/DoctorFilter.vue'
import CabinetFilter from '@/components/time_tables/CabinetFilter.vue'
import ModeSelector from '@/components/time_tables/ModeSelector.vue'
import MonthCalendar from '@/components/MonthCalendar.vue'
import TableWeekFilterDoctor from '@/components/time_tables/TableWeekFilterDoctor.vue'
import TableWeekFilterCabinet from '@/components/time_tables/TableWeekFilterCabinet.vue'

moment.locale('ru')

const WORK_DAYS = 6

export default {
  name: 'TableWeekPage',
  components: {
    'appointment-form': AppointmentForm,
    'base-page': BasePage,
    'doctor-filter': DoctorFilter,
    'cabinet-filter': CabinetFilter,
    'mode-selector': ModeSelector,
    'month-calendar': MonthCalendar,
    'table-week-filter-doctor': TableWeekFilterDoctor,
    'table-week-filter-cabinet': TableWeekFilterCabinet
  },
  data() {
    return {
      appointmentFormData: {
        id: null,
        day: null,
        time: null,
        doctor: null,
        cabinet: null
      },
      appointments: [],
      currentDay: this.$root.currentDay || moment().format('YYYY-MM-DD'),
      firstWeekDay: '',
      weekDays: [],
      docFilter: this.$root.docFilter || [],
      doctors: [],
      cabFilter: this.$root.cabFilter || [],
      cabinets: [],
      isAppointmentsLoaded: false,
      modeSelector: this.$root.modeSelector || '',
      preloaderTimeout: null,
      isPreloader: false
    }
  },
  watch: {
    firstWeekDay: 'getWeek',
    currentDay: 'changeCurrentDay',
    isInitialized: 'preloaderDebounce',
    busCreateAppointment: 'appointmentForm'
  },
  created() {
    this.init()
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
      this.setFirstWeekDay()
      this.getWeek()
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
    setFirstWeekDay() {
      this.firstWeekDay = moment(this.currentDay, 'YYYY-MM-DD')
        .startOf('week')
        .format('YYYY-MM-DD')
    },
    changeCurrentDay() {
      this.$root.currentDay = this.currentDay
      this.setFirstWeekDay()
      this.init()
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
    },
    loadDoctors() {
      backendApi.get('/doctors/').then(response => {
        this.doctors = response.data.results
        if (!this.docFilter.length) this.docFilter = this.doctors.slice(0, 1)
      })
    },
    loadCabinets() {
      backendApi.get('/cabinets/').then(response => {
        this.cabinets = response.data.results
        if (!this.cabFilter.length) this.cabFilter = this.cabinets.slice(0, 1)
      })
    },
    loadAppointments() {
      this.isAppointmentsLoaded = false
      const beginDate = this.weekDays[0]
      const endDate = moment(this.weekDays[this.weekDays.length - 1], 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD')
      backendApi
        .get('/appointments', {
          params: {
            start_time__gt: beginDate,
            start_time__lt: endDate
          }
        })
        .then(response => {
          this.appointments = response.data.results
          this.isAppointmentsLoaded = true
        })
    },
    generateWeekDays() {
      this.weekDays = []
      for (let i = 0; i < WORK_DAYS; i++) {
        this.weekDays.push(
          moment(this.firstWeekDay, 'YYYY-MM-DD')
            .add(i, 'days')
            .format('YYYY-MM-DD')
        )
      }
    },
    getWeek() {
      this.generateWeekDays()
      this.loadAppointments()
    }
  }
}
</script>
