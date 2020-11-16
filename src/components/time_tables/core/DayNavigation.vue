<template>
  <nav class="d-flex justify-content-between my-3">
    <div :class="{ 'text-muted': !isReady }" class="pointer" @click="prevDay()">
      <font-awesome-icon icon="angle-left" class="mr-2 text-primary"></font-awesome-icon>Предыдущий
      день
    </div>
    <div class="font-weight-bold">{{ title }}</div>
    <div :class="{ 'text-muted': !isReady }" class="pointer" @click="nextDay()">
      Следующий день<font-awesome-icon
        icon="angle-right"
        class="ml-2 text-primary"
      ></font-awesome-icon>
    </div>
  </nav>
</template>

<script>
import moment from 'moment'

moment.locale('ru')

export default {
  name: 'DayNavigation',
  model: {
    prop: 'day',
    event: 'input'
  },
  props: {
    day: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    isReady: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  methods: {
    prevDay() {
      this.newDay(-1)
    },
    nextDay() {
      this.newDay(1)
    },
    newDay(shift) {
      if (!this.isReady) return
      const newDay = moment(this.day, 'YYYY-MM-DD')
        .add(shift, 'day')
        .format('YYYY-MM-DD')
      this.$emit('input', newDay)
    }
  }
}
</script>
