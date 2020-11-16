<template>
  <div>
    <form @submit.prevent="sendAppointment">
      <div class="form-row">
        <div class="col">
          <label>Услуга:</label>
          <select
            v-model="appointmentData.service"
            class="form-control"
            :class="{ 'is-invalid': serviceIsInvalid }"
          >
            <option v-for="service in services" :key="'service' + service.id" :value="service.url">
              {{ service.name }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Врач:</label>
          <select
            v-model="appointmentData.doctor"
            class="form-control"
            :class="{ 'is-invalid': doctorIsInvalid }"
          >
            <option v-for="doctor in doctors" :key="'doctor' + doctor.user.id" :value="doctor.url">
              {{ getDoctorStr(doctor) }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Кабинет:</label>
          <select
            v-model="appointmentData.cabinet"
            class="form-control"
            :class="{ 'is-invalid': cabinetIsInvalid }"
          >
            <option v-for="cabinet in cabinets" :key="'cabinet' + cabinet.id" :value="cabinet.url">
              {{ getCabinetStr(cabinet) }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row mt-2">
        <div class="col-6">
          <month-calendar v-model="dateStr"></month-calendar>
        </div>
        <div class="col-6">
          <div class="form-row my-2" :class="{ 'text-danger': startTimeIsInvalid }">
            <div class="col">Время начала:</div>
            <div class="col">
              <select-time v-model="startTime"></select-time>
            </div>
          </div>
          <div class="form-row my-2" :class="{ 'text-danger': endTimeIsInvalid }">
            <div class="col">Время окончания:</div>
            <div class="col">
              <select-time v-model="endTime"></select-time>
            </div>
          </div>
          <div class="form-row my-2">
            <div class="col">Напомнить пациенту:</div>
            <div class="col">
              <input v-model="isNotification" type="checkbox" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="col">
          <label>Фамилия</label>
          <input v-model="lastName" type="text" class="form-control" />
        </div>
        <div class="col">
          <label>Имя</label>
          <input v-model="firstName" type="text" class="form-control" />
        </div>
        <div class="col">
          <label>Отчество</label>
          <input v-model="middleName" type="text" class="form-control" />
        </div>
        <div class="col">
          <label>Телефон</label>
          <the-mask
            v-model="phone"
            type="tel"
            class="form-control"
            mask="+7 (###) ###-##-##"
            placeholder="+7 (000) 000-00-00"
            :masked="true"
          />
        </div>
      </div>

      <div class="mt-3">
        <button v-if="findPatientBtn" type="button" class="btn btn-warning" @click="getPatients">
          Найти
        </button>
        <select
          v-if="selectPatient"
          v-model="appointmentData.patient"
          class="form-control"
          :class="{ 'is-invalid': patientIsInvalid }"
        >
          <option v-for="patient in patients" :key="patient.user.id" :value="patient.url">
            {{ getPatientStr(patient) }}
          </option>
        </select>
        <button
          v-if="createPatientBtn"
          type="button"
          class="btn btn-success"
          @click="createPatient"
        >
          Создать
        </button>
      </div>
      <div class="text-right">
        <button
          type="button"
          class="btn btn-success mt-3"
          :disabled="$v.$invalid"
          @click="sendAppointment"
        >
          Записать
        </button>
      </div>
    </form>
    <b-modal id="patientForm" title="Пациент" size="md" centered no-fade hide-footer>
      <patient-form
        :data="patientData"
        @patientCreatedUpdated="patientCreatedUpdated"
      ></patient-form>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { TheMask } from 'vue-the-mask'

import backendApi from '@/gateways/backend-api'
import { getFullName } from '@/utils/user.js'

import MonthCalendar from '@/components/MonthCalendar.vue'
import PatientForm from '@/components/patients/PatientForm.vue'
import SelectTime from '@/components/SelectTime.vue'

export default {
  name: 'AppointmentForm',

  components: {
    'month-calendar': MonthCalendar,
    'patient-form': PatientForm,
    'select-time': SelectTime,
    'the-mask': TheMask
  },

  mixins: [validationMixin],

  props: {
    data: {
      type: Object,
      default() {
        return {
          id: null,
          day: null,
          time: null
        }
      }
    }
  },

  data() {
    return {
      services: [],
      doctors: [],
      cabinets: [],
      patients: [],
      lastName: '',
      firstName: '',
      middleName: '',
      phone: '',
      dateStr: moment().format('YYYY-MM-DD'),
      isCheckedPatient: false,
      startTime: '',
      endTime: '',
      appointmentData: {
        // Использован snake_case т.к. в таком виде данные уходят на бэк
        start_time: '',
        end_time: '',
        service: '',
        doctor: '',
        cabinet: '',
        patient: '',
        url: ''
      },
      responseErrors: {},
      isNotification: true,
      notification: null,
      patientData: {}
    }
  },

  computed: {
    findPatientBtn() {
      return !this.isCheckedPatient
    },

    selectPatient() {
      return this.appointmentData.patient || (this.patients.length && this.isCheckedPatient)
    },

    createPatientBtn() {
      return !this.patients.length && this.isCheckedPatient
    },

    serviceIsInvalid() {
      return this.$v.appointmentData.service.$error || this.responseErrors.hasOwnProperty('service')
    },

    doctorIsInvalid() {
      return this.$v.appointmentData.doctor.$error || this.responseErrors.hasOwnProperty('doctor')
    },

    cabinetIsInvalid() {
      return this.$v.appointmentData.cabinet.$error || this.responseErrors.hasOwnProperty('cabinet')
    },

    patientIsInvalid() {
      return this.$v.appointmentData.patient.$error || this.responseErrors.hasOwnProperty('patient')
    },

    startTimeIsInvalid() {
      return this.$v.startTime.$error || this.responseErrors.hasOwnProperty('start_time')
    },

    endTimeIsInvalid() {
      return this.$v.endTime.$error || this.responseErrors.hasOwnProperty('end_time')
    }
  },

  watch: {
    lastName: 'uncheck',
    firstName: 'uncheck',
    middleName: 'uncheck',
    phone: 'uncheck'
  },

  created() {
    this.getServices()
    this.getDoctors()
    this.getCabinets()
    if (this.data.id) this.getAppointment(this.data.id)
    if (this.data.day) this.dateStr = this.data.day
    if (this.data.time) {
      this.startTime = this.data.time
      this.endTime = moment(this.data.time, 'HH:mm')
        .add(30, 'minutes')
        .format('HH:mm')
    }
    if (this.data.doctor) this.appointmentData.doctor = this.data.doctor
    if (this.data.cabinet) this.appointmentData.cabinet = this.data.cabinet
  },

  validations: {
    appointmentData: {
      service: {
        required
      },
      doctor: {
        required
      },
      cabinet: {
        required
      },
      patient: {
        required
      }
    },
    startTime: {
      required
    },
    endTime: {
      required
    }
  },

  methods: {
    showError(text) {
      this.$bvToast.toast(text, {
        title: 'Ошибка',
        variant: 'danger',
        solid: true
      })
    },

    uncheck() {
      this.isCheckedPatient = false
      this.appointmentData.patient = ''
    },

    getDoctors() {
      backendApi
        .get('/doctors/')
        .then(response => (this.doctors = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить врачей. Ошибка ${error.response.status}`)
        })
    },

    getCabinets() {
      backendApi
        .get('/cabinets/')
        .then(response => (this.cabinets = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить кабинеты. Ошибка ${error.response.status}`)
        })
    },

    getServices() {
      backendApi
        .get('/services/')
        .then(response => (this.services = response.data.results))
        .catch(error => {
          this.showError(`Не удалось получить услуги. Ошибка ${error.response.status}`)
        })
    },

    getAppointment(id) {
      backendApi
        .get(`/appointments/${id}/`)
        .then(response => {
          this.appointmentData.service = response.data.service.url
          this.appointmentData.doctor = response.data.doctor.url
          this.appointmentData.cabinet = response.data.cabinet.url
          this.appointmentData.patient = response.data.patient.url
          this.appointmentData.url = response.data.url
          this.dateStr = moment(response.data.start_time).format('YYYY-MM-DD')
          this.startTime = moment(response.data.start_time).format('HH:mm')
          this.endTime = moment(response.data.end_time).format('HH:mm')
          this.patients.push(response.data.patient)
          this.isCheckedPatient = true
          this.notification = response.data.notification
          this.isNotification = response.data.notification != null
        })
        .catch(error => {
          this.showError(`Не удалось получить запись. Ошибка ${error}`)
        })
    },

    getPatients() {
      backendApi
        .get('/patients', {
          params: {
            user__last_name__icontains: this.lastName,
            user__first_name__icontains: this.firstName,
            user__middle_name__icontains: this.middleName,
            user__phone__icontains: this.phone
          }
        })
        .then(response => {
          this.patients = response.data.results
          this.isCheckedPatient = true
        })
        .catch(error => {
          this.showError(`Не удалось получить пациентов. Ошибка ${error.response.status}`)
        })
    },

    patientCreatedUpdated(patient) {
      this.getPatient(patient.url)
      this.$bvModal.hide('patientForm')
    },

    getPatient(url) {
      backendApi
        .get(url)
        .then(response => {
          this.patients.push(response.data)
          this.appointmentData.patient = response.data.url
          this.isCheckedPatient = true
        })
        .catch(error => {
          this.showError(`Не удалось получить пациента. Ошибка ${error.response.status}`)
        })
    },

    getDoctorStr(doctor) {
      return getFullName(doctor.user)
    },

    getCabinetStr(cabinet) {
      return cabinet.name
    },

    getPatientStr(patient) {
      const { birth_date, phone } = patient.user
      const fullName = getFullName(patient.user)

      const options = []

      if (birth_date) options.push(birth_date)
      if (phone) options.push(phone)

      return `${fullName} ${options.join(' ')}`
    },

    sendAppointment() {
      this.$v.$touch()
      if (this.$v.$error) return
      this.appointmentData.start_time = `${this.dateStr} ${this.startTime}`
      this.appointmentData.end_time = `${this.dateStr} ${this.endTime}`
      this.makeAppointmentThenNotification()
    },
    makeAppointmentThenNotification() {
      if (this.data.id) {
        backendApi
          .put(`/appointments/${this.data.id}/`, this.appointmentData)
          .then(() => {
            this.makeNotification()
            this.successHandler()
          })
          .catch(error => {
            this.showError(`Не удалось отредактировать пациента. Ошибка ${error.response.status}`)
          })
      } else {
        backendApi
          .post('/appointments/', this.appointmentData)
          .then(response => {
            this.appointmentData.url = response.data.url
            this.makeNotification()
            this.successHandler()
          })
          .catch(error => {
            this.showError(`Не удалось создать пациента. Ошибка ${error.response.status}`)
          })
      }
    },
    makeNotification() {
      const notificationData = {
        date: this.appointmentData.start_time,
        type: 'call',
        is_active: true,
        appointment: this.appointmentData.url
      }

      if (this.notification) {
        if (this.isNotification) {
          backendApi.put(`/notifications/${this.notification}/`, notificationData).catch(error => {
            this.showError(`Не удалось создать напоминание. Ошибка ${error.response.status}`)
          })
        } else {
          backendApi.delete(`/notifications/${this.notification}/`).catch(error => {
            this.showError(`Не удалось создать напоминание. Ошибка ${error.response.status}`)
          })
        }
      } else {
        if (this.isNotification) {
          backendApi.post(`/notifications/`, notificationData).catch(error => {
            this.showError(`Не удалось создать напоминание. Ошибка ${error.response.status}`)
          })
        }
      }
    },
    successHandler() {
      this.appointmentData = {
        start_time: '',
        end_time: '',
        service: '',
        doctor: '',
        cabinet: '',
        patient: ''
      }
      this.$emit('success')
    },

    createPatient() {
      this.patientData = {
        user: {
          last_name: this.lastName,
          first_name: this.firstName,
          middle_name: this.middleName,
          phone: this.phone
        }
      }
      this.$bvModal.show('patientForm')
    }
  }
}
</script>
