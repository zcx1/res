<template>
  <div class="d-table h-100 w-100">
    <div class="d-table-cell align-middle">
      <div :style="loaderStyle" class="cssload-loader mx-auto">
        <div :style="borderBottom" class="cssload-inner cssload-one"></div>
        <div :style="borderBottom" class="cssload-inner cssload-two"></div>
        <div :style="borderBottom" class="cssload-inner cssload-three"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyPreloader',
  props: {
    size: {
      type: String,
      default() {
        return '10'
      }
    },
    color: {
      type: String,
      default() {
        return '#888'
      }
    }
  },
  computed: {
    loaderStyle() {
      const size = Number(this.size)
      return `width: ${size}rem; height: ${size}rem;`
    },
    borderBottom() {
      const border = Number(this.size) / 50
      const color = this.color
      return `border-bottom: ${border}rem solid ${color};`
    }
  }
}
</script>

<style scoped>
.cssload-loader {
  position: relative;
}

.cssload-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  left: 0;
  top: 0;
}

.cssload-inner.cssload-one {
  animation: cssload-rotate-one 1s linear infinite;
}

.cssload-inner.cssload-two {
  animation: cssload-rotate-two 1s linear infinite;
}

.cssload-inner.cssload-three {
  animation: cssload-rotate-three 1s linear infinite;
}

@keyframes cssload-rotate-one {
  0% {
    -webkit-transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes cssload-rotate-two {
  0% {
    -webkit-transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes cssload-rotate-three {
  0% {
    -webkit-transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>
