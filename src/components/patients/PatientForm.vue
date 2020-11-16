<template>
  <div>
    <div class="my-3">
      <label>Фамилия</label>
      <input
        v-model="patient.user.last_name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': lastNameIsInvalid }"
      />
    </div>
    <div class="my-3">
      <label>Имя</label>
      <input v-model="patient.user.first_name" type="text" class="form-control" />
    </div>
    <div class="my-3">
      <label>Отчество</label>
      <input v-model="patient.user.middle_name" type="text" class="form-control" />
    </div>
    <div class="my-3">
      <label>Телефон</label>
      <the-mask
        v-model="patient.user.phone"
        type="tel"
        class="form-control"
        mask="+7 (###) ###-##-##"
        placeholder="+7 (000) 000-00-00"
        :masked="true"
      />
    </div>
    <div class="my-3">
      <label>Пол</label>
      <select v-model="patient.user.gender" class="form-control">
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </select>
    </div>
    <div class="my-3">
      <label>Дата рождения</label>
      <input v-model="patient.user.birth_date" type="date" class="form-control" />
    </div>
    <div class="my-3">
      <label>Адрес</label>
      <input v-model="patient.user.address" type="address" class="form-control" />
    </div>
    <div class="my-3">
      <label>Паспорт</label>
      <div class="form-check">
        <div>
          <label>серия</label>
          <the-mask
            v-model="json['Паспорт']['Серия']"
            type="text"
            class="form-control series d-inline mx-3"
            mask="####"
            placeholder="0000"
          />
          <label>номер</label>
          <the-mask
            v-model="json['Паспорт']['Номер']"
            type="text"
            class="form-control number d-inline mx-3"
            mask="######"
            placeholder="000000"
          />
        </div>
        <label>выдан</label>
        <input v-model="json['Паспорт']['Выдан']" type="text" class="form-control" />
        <label>дата</label>
        <input v-model="json['Паспорт']['Дата']" type="date" class="form-control" />
        <label>код подразделения</label>
        <the-mask
          v-model="json['Паспорт']['Код подразделения']"
          type="text"
          class="form-control"
          mask="###-###"
          placeholder="000-000"
          :masked="true"
        />
      </div>
    </div>
    <div class="my-3">
      <label>ИНН</label>
      <the-mask
        v-model="json['ИНН']"
        type="text"
        class="form-control"
        mask="############"
        placeholder="000000000000"
      />
    </div>
    <div class="my-3">
      <label>СНИЛС</label>
      <the-mask
        v-model="json['СНИЛС']"
        type="text"
        class="form-control"
        mask="###-###-### ##"
        placeholder="000-000-000 00"
        :masked="true"
      />
    </div>
    <div class="my-3 text-right">
      <button type="button" class="btn btn-success" :disabled="$v.$invalid" @click="sendPatient()">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { TheMask } from 'vue-the-mask'

import backendApi from '@/gateways/backend-api.js'
import { getClearDict } from '@/utils/json.js'
import { createPatient, updatePatient } from '@/utils/patient.js'

export default {
  name: 'PatientForm',
  components: {
    'the-mask': TheMask
  },
  mixins: [validationMixin],
  props: {
    id: {
      type: Number,
      default() {
        return 0
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      patient: {},
      json: {}
    }
  },
  computed: {
    lastNameIsInvalid() {
      return this.$v.patient.user.last_name.$invalid
    }
  },
  created() {
    this.initPatient()
    this.initJson()
    if (this.id) this.getPatient(this.id)
  },
  validations: {
    patient: {
      user: {
        last_name: {
          required
        }
      }
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
    initPatient() {
      const user = 'user' in this.data ? this.data.user : {}
      this.patient = {
        patient: '',
        user: {
          last_name: 'last_name' in user ? user.last_name : '',
          first_name: 'first_name' in user ? user.first_name : '',
          middle_name: 'middle_name' in user ? user.middle_name : '',
          phone: 'phone' in user ? user.phone : '',
          birth_date: null,
          gender: null,
          address: ''
        }
      }
    },
    initJson() {
      const json = this.patient.user.json ? JSON.parse(this.patient.user.json) : {}
      const passport = 'Паспорт' in json ? json['Паспорт'] : {}
      this.json = {
        Паспорт: {
          Серия: 'Серия' in passport ? json['Паспорт']['Серия'] : '',
          Номер: 'Номер' in passport ? json['Паспорт']['Номер'] : '',
          Выдан: 'Выдан' in passport ? json['Паспорт']['Выдан'] : '',
          Дата: 'Дата' in passport ? json['Паспорт']['Дата'] : '',
          'Код подразделения':
            'Код подразделения' in passport ? json['Паспорт']['Код подразделения'] : ''
        },
        ИНН: 'ИНН' in json ? json['ИНН'] : '',
        СНИЛС: 'СНИЛС' in json ? json['СНИЛС'] : ''
      }
    },
    sendPatient() {
      this.$v.$touch()

      if (this.$v.$error) return

      this.patient.user.json = JSON.stringify(getClearDict(this.json))

      if (this.id) {
        updatePatient(this.patient)
          .then(response => {
            this.successHandler(response.data)
          })
          .catch(error => {
            this.showError(`Не удалось обновить пациента. Ошибка ${error.response.status}`)
          })
      } else {
        createPatient(this.patient)
          .then(response => {
            this.successHandler(response.data)
          })
          .catch(error => {
            this.showError(`Не удалось создать пациента. Ошибка ${error.response.status}`)
          })
      }
    },
    successHandler(patient) {
      this.initPatient()
      this.$emit('patientCreatedUpdated', patient)
    },
    getPatient(id) {
      backendApi
        .get(`/patients/${id}/`)
        .then(response => {
          this.patient = response.data
          this.initJson()
        })
        .catch(error => {
          this.showError(`Не удалось получить запись. Ошибка ${error.response.status}`)
        })
    }
  }
}
</script>
<style scoped>
input.series {
  width: 4rem;
}
input.number {
  width: 5rem;
}
</style>
