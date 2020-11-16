<template>
  <nav>
    <ul class="pagination">
      <li class="page-item">
        <a class="page-link" href="#" @click="first()">
          1
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" @click="previous()">
          <font-awesome-icon icon="angle-left"></font-awesome-icon>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link">
          {{ page }}
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" @click="next()">
          <font-awesome-icon icon="angle-right"></font-awesome-icon>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" @click="last()">
          {{ pageCount }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'PageNavigation',
  props: {
    value: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      page: 1
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.count / this.pageSize)
    }
  },
  watch: {
    page: 'pageChanged'
  },
  methods: {
    previous() {
      if (this.page <= 1) return

      this.page--
    },
    next() {
      if (this.page >= this.pageCount) return

      this.page++
    },
    first() {
      this.page = 1
    },
    last() {
      this.page = this.pageCount
    },
    pageChanged() {
      if (this.value == this.page) return

      this.$emit('input', this.page)
    }
  }
}
</script>
