<template>
  <div class="form-row">
    <div class="col">
      <select v-model="hour" class="form-control">
        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
      </select>
    </div>
    :
    <div class="col">
      <select v-model="minute" class="form-control">
        <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectTime',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hour: '',
      minute: '',
      hours: ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
      minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
    }
  },
  computed: {
    timeStr() {
      if (this.hour && this.minute) {
        return `${this.hour}:${this.minute}`
      }
      return ''
    }
  },
  watch: {
    timeStr: 'updateTime',
    value: 'updateValue'
  },
  mounted() {
    this.updateValue()
  },
  methods: {
    updateTime() {
      this.$emit('input', this.timeStr)
    },
    updateValue() {
      ;[this.hour, this.minute] = this.value.split(':')
    }
  }
}
</script>
