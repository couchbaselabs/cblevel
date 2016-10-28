<template>
  <div>
    <div class="box">
      <div class="chart"></div>
    </div>
  </div>
</template>

<script>
import colorbrewer from 'colorbrewer'

// (_optional_) define color function or array for bubbles: [ColorBrewer](http://colorbrewer2.org/)
// .colors(colorbrewer.RdYlGn[9])
console.log(colorbrewer)

function makeCharts () {
}

export default {
  name: 'charts',
  mounted () {
    makeCharts()
  }
}
</script>

<style scoped>
</style>
