<template>
  <div>
    <div v-if="kind && kind != 'panel'"
         class="box">
      <div v-if="label"
           class="box-header">
        <h4 class="box-title">{{label}}</h4>
      </div>

      <resultAnalysis v-if="kind == 'resultAnalysis'"
                      v-bind:page="page"
                      v-bind:options="options"></resultAnalysis>
      <resultChart v-if="kind == 'resultChart'"
                   v-bind:page="page"
                   v-bind:options="options"></resultChart>
      <resultTable v-if="kind == 'resultTable'"
                   v-bind:page="page"
                   v-bind:options="options"></resultTable>
    </div>

    <div v-bind:class="{ 'row': kind == 'panel' }">
      <div v-for="subPanel in panels"
           v-bind:class="{ 'col-lg-4': kind == 'panel' }">
        <panel v-bind:page="page"
               v-bind:kind="subPanel.kind"
               v-bind:label="subPanel.label"
               v-bind:options="subPanel.options"
               v-bind:panels="subPanel.panels"></panel>
      </div>
    </div>
  </div>
</template>

<script>
import ResultAnalysis from './ResultAnalysis'
import ResultChart from './ResultChart'
import ResultTable from './ResultTable'

export default {
  name: 'panel',
  components: {
    ResultAnalysis,
    ResultChart,
    ResultTable
  },
  props: ['page', 'kind', 'label', 'options', 'panels']
}
</script>
