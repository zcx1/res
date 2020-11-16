<template>
  <nav class="d-flex justify-content-between my-3">
    <div :class="{ 'text-muted': !isReady }" class="pointer" @click="prevWeek()">
      <font-awesome-icon icon="angle-left" class="mr-2 text-primary"></font-awesome-icon>Предыдущая
      неделя
    </div>
    <div class="font-weight-bold">{{ title }}</div>
    <div :class="{ 'text-muted': !isReady }" class="pointer" @click="nextWeek()">
      Следующая неделя<font-awesome-icon
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
    prop: 'firstWeekDay',
    event: 'input'
  },
  props: {
    firstWeekDay: {
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
    prevWeek() {
      this.newWeek(-1)
    },
    nextWeek() {
      this.newWeek(1)
    },
    newWeek(shift) {
      if (!this.isReady) return
      const newFirstDay = moment(this.firstWeekDay, 'YYYY-MM-DD')
        .add(shift, 'week')
        .format('YYYY-MM-DD')
      this.$emit('input', newFirstDay)
    }
  }
}
</script>
