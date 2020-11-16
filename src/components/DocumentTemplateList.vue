<template>
  <div>
    <div v-for="document in documentTemplateList" :key="'documentTemplate' + document.id">
      <a :href="getDocumentUrl(document.id)" target="_blank">{{ document.name }}</a>
    </div>
  </div>
</template>

<script>
import backendApi from '@/gateways/backend-api'
import backendURL from '@/gateways/backend-url.js'

export default {
  name: 'DocumentTemplateList',
  props: {
    patientId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      documentTemplateList: []
    }
  },
  created() {
    this.getDocumentTemplateList()
  },
  methods: {
    getDocumentTemplateList() {
      backendApi
        .get('/document_template/')
        .then(response => (this.documentTemplateList = response.data.results))
        .catch(error => {
          this.showError(
            `Не удалось получить список шаблонов документов. Ошибка ${error.response.status}`
          )
        })
    },
    getDocumentUrl(id) {
      return `${backendURL}/documents/download/${id}/${this.patientId}/`
    }
  }
}
</script>
