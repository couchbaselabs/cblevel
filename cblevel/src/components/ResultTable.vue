<template>
  <div v-if="result.request">
    <div class="box-header">
      <h3 class="box-title">{{result.request}}</h3>

      <span v-if="result.resultId"
            class="pull-right-container">
        <small class="label pull-right bg-green">
          {{results.results.length}} of
          {{results.resultsTotal}}
        </small>
      </span>
    </div>
    <!-- /.box-header -->

    <div v-if="result.err"
         class="alert alert-error">
      <h4><i class="icon fa fa-warning"></i> Error</h4>
      request error: {{result.err}}
    </div>

    <div v-if="result.resultId && results.results.length <= 0"
         class="box-body">
      no results
    </div>

    <div v-if="result.resultId && results.results.length > 0"
         class="box-body table-responsive no-padding resultTable">
      <table class="table table-hover">
        <tbody>
        <tr>
          <th>#</th>
          <th>Doc ID</th>
          <th>Fields</th>
        </tr>
        <tr v-for="(x, docNum) in results.results"
            v-bind:id="'docNum_'+docNum">
          <td>#{{docNum}}:</td>
          <td>{{x.id}}</td>
          <td>{{x.fields}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'resultTable',
  props: ['page'],
  computed: {
    result () {
      return this.page.result
    },
    results () {
      return window.resultRegistry[this.result.resultId]
    }
  }
}
</script>

<style scoped>
.resultTable {
  max-height: 30em;
  overflow: auto;
}
</style>
