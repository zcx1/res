import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login/',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/',
    name: 'MainPage',
    component: () => import('@/views/MainPage.vue')
  },
  {
    path: '/week/',
    name: 'TableWeekPage',
    component: () => import('@/views/TableWeekPage.vue')
  },
  {
    path: '/day/',
    name: 'TableDayPage',
    component: () => import('@/views/TableDayPage.vue')
  },
  {
    path: '/printday/',
    name: 'TableDayPrintPage',
    component: () => import('@/views/TableDayPrintPage.vue')
  },
  {
    path: '/patients/',
    name: 'PatientListPage',
    component: () => import('@/views/PatientListPage.vue')
  },
  {
    path: '/patients/medical_card/',
    name: 'MedicalCardPage',
    component: () => import('@/views/MedicalCardPage.vue')
  },
  {
    path: '/test/',
    name: 'TestPage',
    component: () => import('@/views/TestPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
