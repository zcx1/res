<template>
  <base-page @reload="init">
    <template #slot1>
      <div class="mb-3">
        <label>Фамилия</label>
        <input v-model="lastName" type="text" class="form-control" />
      </div>
      <div class="my-3">
        <label>Имя</label>
        <input v-model="firstName" type="text" class="form-control" />
      </div>
      <div class="my-3">
        <label>Отчество</label>
        <input v-model="middleName" type="text" class="form-control" />
      </div>
      <div class="my-3">
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
      <div class="my-3 text-right">
        <button type="button" class="btn btn-primary" @click="getPatients()">
          Найти
        </button>
      </div>
    </template>

    <template #slot2>
      <div class="container ml-0">
        <div class="mb-3">
          <b-modal id="patientForm" title="Пациент" size="md" centered no-fade hide-footer>
            <patient-form
              :id="patientId"
              @patientCreatedUpdated="patientCreatedUpdated"
            ></patient-form>
          </b-modal>

          <b-modal
            id="contractList"
            title="Список документов"
            size="md"
            centered
            no-fade
            hide-footer
          >
            <document-template-list :patientId="patientId"></document-template-list>
          </b-modal>
        </div>

        <page-navigation v-model="page" :count="count" :page-size="pageSize"></page-navigation>
        <patient-list
          :patients="patients"
          @edit="editPatient"
          @contractList="showContractList"
          @remove="removePatient"
          @checkedChange="updateCheckedPatients"
        ></patient-list>
        <page-navigation v-model="page" :count="count" :page-size="pageSize"></page-navigation>
      </div>
    </template>
  </base-page>
</template>

<script>
import { mapState } from 'vuex'

import backendApi from '@/gateways/backend-api'
import { deletePatient } from '@/utils/patient.js'
import { TheMask } from 'vue-the-mask'

import BasePage from '@/components/base_pages/BasePage.vue'
import DocumentTemplateList from '@/components/DocumentTemplateList.vue'
import PageNavigation from '@/components/PageNavigation.vue'
import PatientList from '@/components/patients/PatientList.vue'
import PatientForm from '@/components/patients/PatientForm.vue'

export default {
  name: 'PatientListPage',
  components: {
    'base-page': BasePage,
    'document-template-list': DocumentTemplateList,
    'page-navigation': PageNavigation,
    'patient-list': PatientList,
    'patient-form': PatientForm,
    'the-mask': TheMask
  },
  data() {
    return {
      patients: [],
      lastName: '',
      firstName: '',
      middleName: '',
      phone: '',
      page: 1,
      count: 0,
      pageSize: 20,
      patientId: 0,
      checkedPatients: []
    }
  },
  watch: {
    page: 'getPatients',
    busCreatePatient: 'createPatient',
    busDeletePatient: 'deleteCheckedPatientsConfirm'
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState({
      busCreatePatient: state => state.bus.busCreatePatient,
      busDeletePatient: state => state.bus.busDeletePatient
    })
  },
  methods: {
    init() {
      this.getPatients()
    },
    showError(text) {
      this.$bvToast.toast(text, {
        title: 'Ошибка',
        variant: 'danger',
        solid: true
      })
    },
    getPatients() {
      backendApi
        .get('/patients', {
          params: {
            user__last_name__icontains: this.lastName,
            user__first_name__icontains: this.firstName,
            user__middle_name__icontains: this.middleName,
            user__phone__icontains: this.phone,
            page_size: this.pageSize,
            page: this.page
          }
        })
        .then(response => {
          this.patients = response.data.results
          this.count = response.data.count
        })
        .catch(error => {
          this.showError(`Не удалось получить список пациентов. Ошибка ${error.response.status}`)
        })
    },
    patientCreatedUpdated() {
      this.getPatients()
      this.$bvModal.hide('patientForm')
    },
    createPatient() {
      this.patientId = 0
      this.$bvModal.show('patientForm')
    },
    editPatient(id) {
      this.patientId = id
      this.$bvModal.show('patientForm')
    },
    showContractList(id) {
      this.patientId = id
      this.$bvModal.show('contractList')
    },
    removePatient(id) {
      this.$bvModal
        .msgBoxConfirm('Хотите удалить пациента?', {
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
          deletePatient(id)
            .then(this.getPatients)
            .catch(error => {
              this.showError(
                `Возможно на пациента (${id}) имеются записи к врачу. Ошибка ${error.response.status}`
              )
            })
        })
    },
    updateCheckedPatients(checked) {
      this.checkedPatients = checked
    },
    deleteCheckedPatientsConfirm() {
      this.$bvModal
        .msgBoxConfirm('Хотите удалить всех отмеченных пациентов?', {
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
          this.deleteCheckedPatients()
        })
    },
    deleteCheckedPatients() {
      const id = this.checkedPatients.pop()
      if (id) {
        deletePatient(id)
          .then(this.deleteCheckedPatients)
          .catch(error => {
            if (error.response.status == 500) {
              this.showError(
                `Возможно на пациента (${id}) имеются записи к врачу. Ошибка ${error.response.status}`
              )
            } else {
              this.showError(error.response.status)
            }
            this.deleteCheckedPatients()
          })
        return
      }
      this.getPatients()
    }
  }
}
</script>
