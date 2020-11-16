<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col" class="text-center">
          <input ref="toggleCheckAll" type="checkbox" @click="toggleCheckAll()" />
        </th>
        <th scope="col">№ п/п</th>
        <th scope="col">Фамилия</th>
        <th scope="col">Имя</th>
        <th scope="col">Отчество</th>
        <th scope="col">Телефон</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="patient in patients" :key="patient.url">
        <td class="text-center">
          <input v-model="checkedPatients" type="checkbox" :value="patient.user.id" />
        </td>
        <td>
          {{ patient.user.id }}
        </td>
        <td>{{ patient.user.last_name }}</td>
        <td>{{ patient.user.first_name }}</td>
        <td>{{ patient.user.middle_name }}</td>
        <td>{{ patient.user.phone }}</td>
        <td>
          <div class="d-flex text-secondary">
            <div
              v-b-tooltip.hover
              title="Редактировать"
              class="mr-3"
              @click="edit(patient.user.id)"
            >
              <font-awesome-icon icon="edit"></font-awesome-icon>
            </div>
            <div
              v-b-tooltip.hover
              title="Медицинская карта"
              class="mr-3"
              @click="medicalCard(patient.user.id)"
            >
              <font-awesome-icon icon="book-medical"></font-awesome-icon>
            </div>
            <div
              v-b-tooltip.hover
              title="Документы"
              class="mr-3"
              @click="contractList(patient.user.id)"
            >
              <font-awesome-icon icon="file-contract"></font-awesome-icon>
            </div>
            <div v-b-tooltip.hover title="Удалить" class="mr-3" @click="remove(patient.user.id)">
              <font-awesome-icon icon="trash-alt"></font-awesome-icon>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'PatientList',
  props: {
    patients: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkedPatients: []
    }
  },
  watch: {
    checkedPatients: 'checkedEmit',
    patients: 'initCheckedPatients'
  },
  methods: {
    initCheckedPatients() {
      this.checkedPatients = []
      this.$refs.toggleCheckAll.checked = false
    },
    toggleCheckAll() {
      if (this.checkedPatients.length < this.patients.length) {
        this.checkedPatients = this.patients.map(patient => patient.user.id)
      } else {
        this.checkedPatients = []
      }
    },
    edit(id) {
      this.$emit('edit', id)
    },
    medicalCard(id) {
      this.$root.patientId = id
      this.$router.push('/patients/medical_card')
    },
    contractList(id) {
      this.$emit('contractList', id)
    },
    remove(id) {
      this.$emit('remove', id)
    },
    checkedEmit() {
      this.$emit('checkedChange', this.checkedPatients)
    }
  }
}
</script>
