<template>
  <base-page @reload="init">
    <template #slot1>
      Пациент:
      <patient-info v-if="patient" :patient="patient" @showForm="showPatientForm"></patient-info>
      <b-modal id="patientForm" title="Пациент" size="md" centered no-fade hide-footer>
        <patient-form :id="patientId" @patientCreatedUpdated="patientCreatedUpdated"></patient-form>
      </b-modal>
      <hr />
      Документы:
      <document-template-list :patientId="patientId"></document-template-list>
      <hr />
      Медицинские карты:
      <b-modal
        id="medicalCardCreateForm"
        title="Создание медицинской карты"
        size="lg"
        centered
        no-fade
        hide-footer
      >
      </b-modal>
    </template>

    <template #slot2> </template>
  </base-page>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'

import backendApi from '@/gateways/backend-api'

import BasePage from '@/components/base_pages/BasePage.vue'
import DocumentTemplateList from '@/components/DocumentTemplateList.vue'
import PatientForm from '@/components/patients/PatientForm.vue'
import PatientInfo from '@/components/patients/PatientInfo.vue'

moment.locale('ru')

export default {
  name: 'CardPage',
  components: {
    'base-page': BasePage,
    'document-template-list': DocumentTemplateList,
    'patient-form': PatientForm,
    'patient-info': PatientInfo
  },
  data() {
    return {
      patient: null,
      patientId: this.$root.patientId,
      medicalCardId: 0,
      medicalCardList: []
    }
  },
  watch: {
    busCreateMedicalCard: 'medicalCardForm'
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState({
      busCreateMedicalCard: state => state.bus.busCreateMedicalCard
    })
  },
  methods: {
    init() {
      this.getPatient()
      this.getMedicalCardList()
    },
    setMedicalCardId(id) {
      this.medicalCardId = id
    },
    medicalCardForm() {
      this.$bvModal.show('medicalCardCreateForm')
    },
    getPatient() {
      backendApi
        .get(`/patients/${this.patientId}/`)
        .then(response => {
          this.patient = response.data
        })
        .catch(error => {
          this.showError(`Не удалось получить пациента. Ошибка ${error.response.status}`)
        })
    },
    medicalCardCreated() {
      this.$bvModal.hide('medicalCardCreateForm')
      this.getMedicalCardList()
    },
    getMedicalCardList() {
      backendApi
        .get('/patients/medical_card/', {
          params: {
            patient__user_id: this.patientId
          }
        })
        .then(response => (this.medicalCardList = response.data.results))
        .catch(error => {
          this.showError(
            `Не удалось получить список медицинских карт. Ошибка ${error.response.status}`
          )
        })
    },
    showPatientForm() {
      this.$bvModal.show('patientForm')
    },
    patientCreatedUpdated() {
      this.$bvModal.hide('patientForm')
      this.getPatient()
    }
  }
}
</script>
