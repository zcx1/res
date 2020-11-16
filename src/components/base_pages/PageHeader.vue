<template>
  <header class="mb-4 pb-3">
    <b-navbar toggleable="md" type="dark" variant="dark" class="p-0 fixed-top">
      <div class="btn text-white header-icon" @click="$router.go(-1)">
        <font-awesome-icon icon="angle-left"></font-awesome-icon>
      </div>
      <div class="btn text-white header-icon" @click="$router.go(1)">
        <font-awesome-icon icon="angle-right"></font-awesome-icon>
      </div>
      <div class="btn text-white header-icon" @click="$emit('reload')">
        <font-awesome-icon icon="redo"></font-awesome-icon>
      </div>
      <b-navbar-nav>
        <b-nav-item to="/week/" active-class="active bg-primary" exact>
          <div class="px-2">
            Расписание на неделю
          </div>
        </b-nav-item>
        <b-nav-item to="/day/" active-class="active bg-primary" exact>
          <div class="px-2">
            Расписание на день
          </div>
        </b-nav-item>
        <b-nav-item to="/patients/" active-class="active bg-primary">
          <div class="px-2">
            Пациенты
          </div>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="m-auto">
        <span v-if="isRouteIn(['TableWeekPage', 'TableDayPage'])">
          <button class="btn btn-warning py-0 mx-1" @click="createAppointment">
            <font-awesome-icon icon="plus"></font-awesome-icon> Запись
          </button>
        </span>
        <span v-if="isRouteIn(['TableDayPage'])">
          <a class="btn btn-info py-0 mx-1" href="/printday" target="_blank">
            <font-awesome-icon icon="print"></font-awesome-icon> Печать
          </a>
        </span>
        <span v-if="isRouteIn(['PatientListPage'])">
          <button class="btn btn-warning py-0 mx-1" @click="createPatient">
            <font-awesome-icon icon="plus"></font-awesome-icon> Создать
          </button>
          <button class="btn btn-danger py-0 mx-1" @click="deletePatient">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon> Удалить
          </button>
        </span>
        <span v-if="isRouteIn(['MedicalCardPage'])">
          <button class="btn btn-warning py-0 mx-1" @click="createMedicalCard">
            <font-awesome-icon icon="plus"></font-awesome-icon> Создать
          </button>
          <button class="btn btn-success py-0 mx-1" @click="saveMedicalCard">
            Сохранить
          </button>
        </span>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <user-widget></user-widget>
          </template>
          <b-dropdown-item to="/login/">Выход</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav>
        <time-widget></time-widget>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

<script>
import {
  BUS_CREATE_APPOINTMENT,
  BUS_CREATE_PATIENT,
  BUS_DELETE_PATIENT,
  BUS_CREATE_MEDICAL_CARD,
  BUS_SAVE_MEDICAL_CARD
} from '@/store/actions/bus.js'

import TimeWidget from './TimeWidget.vue'
import UserWidget from '@/components/UserWidget.vue'

export default {
  name: 'PageHeader',
  components: {
    'user-widget': UserWidget,
    'time-widget': TimeWidget
  },
  methods: {
    isRouteIn(routeNames) {
      return this.$route.matched.some(({ name }) => routeNames.includes(name))
    },
    createAppointment() {
      this.$store.dispatch(BUS_CREATE_APPOINTMENT)
    },
    createPatient() {
      this.$store.dispatch(BUS_CREATE_PATIENT)
    },
    deletePatient() {
      this.$store.dispatch(BUS_DELETE_PATIENT)
    },
    createMedicalCard() {
      this.$store.dispatch(BUS_CREATE_MEDICAL_CARD)
    },
    saveMedicalCard() {
      this.$store.dispatch(BUS_SAVE_MEDICAL_CARD)
    }
  }
}
</script>
