<template>
  <div>
    <div class="btn-group w-100">
      <div
        class="btn w-50"
        :class="{ 'btn-primary': isDoctor, 'btn-secondary': !isDoctor }"
        @click="newValue(doctor)"
      >
        врачи
      </div>
      <div
        class="btn w-50"
        :class="{ 'btn-primary': isCabinet, 'btn-secondary': !isCabinet }"
        @click="newValue(cabinet)"
      >
        кабинеты
      </div>
    </div>
  </div>
</template>

<script>
import { DOCTOR_MODE, CABINET_MODE } from './core/core.js'

export default {
  name: 'ModeSelector',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      doctor: DOCTOR_MODE,
      cabinet: CABINET_MODE,
      localValue: this.$root.modeSelector || ''
    }
  },
  created() {
    if (!this.localValue) this.newValue(this.cabinet)
  },
  computed: {
    isDoctor() {
      return this.localValue == this.doctor
    },
    isCabinet() {
      return this.localValue == this.cabinet
    }
  },
  watch: {
    value: 'updateValue'
  },
  methods: {
    updateValue() {
      if (this.value != this.localValue) this.localValue = this.value
    },
    newValue(mode) {
      if (this.localValue == mode) return
      this.localValue = mode
      this.$root.modeSelector = this.localValue
      this.$emit('input', this.localValue)
    }
  }
}
</script>
