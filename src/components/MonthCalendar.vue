<template>
  <div>
    <div class="text-center">
      <div class="btn-group">
        <div v-b-tooltip.hover title="Предыдущий год" class="btn pointer" @click="prev('year')">
          <font-awesome-icon icon="angle-double-left"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Предыдущий месяц" class="btn pointer" @click="prev('month')">
          <font-awesome-icon icon="angle-left"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Текущий месяц" class="btn pointer" @click="now()">
          <font-awesome-icon icon="circle"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Следующий месяц" class="btn pointer" @click="next('month')">
          <font-awesome-icon icon="angle-right"></font-awesome-icon>
        </div>
        <div v-b-tooltip.hover title="Следующий год" class="btn pointer" @click="next('year')">
          <font-awesome-icon icon="angle-double-right"></font-awesome-icon>
        </div>
      </div>
      <div class="text-capitalize">
        {{ label }}
      </div>
    </div>
    <table class="table table-borderless table-sm text-center m-0">
      <thead>
        <tr>
          <th
            v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
            :key="day + calendar.__ob__.dep.id"
          >
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in calendar" :key="week.__ob__.dep.id">
          <td
            v-for="day in week"
            :key="day.digit"
            :class="{
              'bg-transparency text-muted': !day.active,
              'bg-primary text-white': dateStr == day.dateStr
            }"
          >
            <div v-if="day.active" class="pointer" @click="getDay(day.dateStr)">
              {{ day.digit }}
            </div>
            <div v-else>
              {{ day.digit }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('ru')

const DATE_FORMAT = 'YYYY-MM-DD'

export default {
  name: 'MonthCalendar',
  props: {
    value: {
      type: String,
      default() {
        return moment().format(DATE_FORMAT)
      }
    }
  },
  data() {
    return {
      current: null,
      label: '',
      calendar: [],
      dateStr: ''
    }
  },
  watch: {
    value() {
      this.dateStr = this.value
      this.getCalendar(this.value)
    }
  },
  created() {
    if (!this.value) this.value = moment().format(DATE_FORMAT)
    this.dateStr = this.value
    this.getCalendar(this.value)
  },
  methods: {
    getCalendar(current) {
      this.current = moment(current, DATE_FORMAT)
      this.label = this.current.format('MMMM YYYY')

      const month = this.current.month()
      const firstDayCurrMonth = moment(this.current.startOf('month'))
      const weekDay = firstDayCurrMonth.weekday()
      const firstDayCalendar = moment(firstDayCurrMonth.subtract(weekDay, 'days'))

      const calendar = []
      let new_day = firstDayCalendar
      for (let i = 1; i <= 6; i++) {
        const week = []
        for (let j = 1; j <= 7; j++) {
          const day = {
            digit: new_day.date(),
            active: new_day.month() == month,
            dateStr: new_day.format(DATE_FORMAT)
          }
          week.push(day)
          new_day = new_day.add(1, 'days')
        }
        calendar.push(week)
      }
      this.calendar = calendar
    },
    getDay(dateStr) {
      if (!this.value) {
        this.dateStr = dateStr
      }
      this.$emit('input', dateStr)
    },
    prev(interval) {
      this.getCalendar(this.current.subtract(1, interval))
    },
    now() {
      this.getCalendar(moment())
    },
    next(interval) {
      this.getCalendar(this.current.add(1, interval))
    }
  }
}
</script>

<style scoped>
td:hover {
  background-color: #f8f9fa;
}
</style>
