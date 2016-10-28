<template>
  <div class="box">
    <canvas></canvas>
  </div>
</template>

<script>
import chartjs from 'chart.js'

function makeChart (chartEl, options) {
  return new chartjs.Chart(chartEl, options)
}

window.nextChartId = 1

export default {
  name: 'resultChart',
  props: ['options'],
  data () {
    return { elId: null }
  },
  mounted () {
    var chartElId = 'chart_' + window.nextChartId
    window.nextChartId++

    var chartEl = this.$el.firstElementChild
    chartEl.id = chartElId

    makeChart(chartEl, this.options)
  }
}
</script>

<style scoped>
</style>
