<template>
  <span class="text-center text-light px-3">
    {{ date }}
    <span class="h3 ml-2 h-100 align-middle">
      {{ time }}
    </span>
  </span>
</template>

<script>
import moment from 'moment'
moment.locale('ru')

export default {
  name: 'TimeWidget',
  data() {
    return {
      time: undefined,
      date: undefined,
      intervalId: undefined
    }
  },
  created() {
    this.updateTime()
    this.intervalId = setInterval(this.updateTime, 1000)
  },
  methods: {
    updateTime() {
      const t = moment()
      const time = t.format('HH:mm')
      const date = t.format('dddd, D MMMM')
      if (this.time != time) this.time = time
      if (this.date != date) this.date = date
    }
  }
}
</script>
