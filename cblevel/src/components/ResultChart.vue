<template>
  <div>
    <canvas></canvas>
  </div>
</template>

<script>
import Lazy from 'lazy.js'

import colorbrewer from 'colorbrewer'

import chartjs from 'chart.js'

window.chartRegistry = {}

function makeChart (chartEl, options) {
  var result = window.resultRegistry[options.resultId]
  if (!result || !result.analysis || !result.analysis.keyInfos) {
    return
  }

  var keyInfo = result.analysis.keyInfos[options.key]
  if (!keyInfo || !keyInfo.valToIdNums) {
    return
  }

  var labels = []
  var data = []

  Lazy(keyInfo.valToIdNums).each(function (idNums, val) {
    labels.push(val)
    data.push(idNums.length)
  })

  var backgroundColor = []
  for (var i = 0; i < labels.length; i++) {
    backgroundColor[i] = colorbrewer.GnBu[9][i % 9]
  }

  var chartOptions = {
    type: options.resultChartType,
    data: {
      labels: labels,
      datasets: [{
        label: 'count',
        data: data,
        backgroundColor: backgroundColor
      }]
    }
  }

  window.chartRegistry[chartEl.id] = new chartjs.Chart(chartEl, chartOptions)
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
