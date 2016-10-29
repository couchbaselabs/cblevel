<template>
  <div>
    <canvas></canvas>
  </div>
</template>

<script>
import chartjs from 'chart.js'

window.chartRegistry = {}

function makeChart (chartEl, options) {
  window.chartRegistry[chartEl.id] = new chartjs.Chart(chartEl, options)
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
    chartEl.className = 'chart_' + this.options.type

    makeChart(chartEl, this.options)
  },
  beforeDestroy () {
    var chartEl = this.$el.firstElementChild
    var chart = window.chartRegistry[chartEl.id]
    if (chart) {
      chart.destroy()
      delete window.chartRegistry[chartEl.id]
    }
  }
}
</script>

<style>
.chart_doughnut {
  min-width: 100px;
  min-height: 100px;
}

.chart_bar {
  max-height: 300px;
}
</style>
