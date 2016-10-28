<template>
<div>
  <div v-if="result.request" class="box">
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

    <div v-if="!result.err && !result.resultId"
         class="box-body">
      <div class="overlay">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
    </div>

    <div v-if="result.err"
         class="alert alert-error">
      <h4><i class="icon fa fa-warning"></i> Error</h4>
      search error: {{result.err}}
    </div>

    <div v-if="result.resultId && results.results.length <= 0"
         class="box-body">
      no results
    </div>

    <div v-if="result.resultId && results.results.length > 0"
         class="box-body">
      <div>{{results.analysis}}</div>
    </div>

    <div v-if="result.resultId && results.results.length > 0"
         class="box-body table-responsive no-padding">
      <table class="table table-hover">
        <tbody>
        <tr>
          <th>ID</th>
          <th>Fields</th>
        </tr>
        <tr v-for="x in results.results">
          <td>{{x.id}}</td>
          <td>{{x.fields}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'resultTable',
  props: ['result'],
  computed: {
    results () {
      return window.resultRegistry[this.result.resultId]
    }
  }
}
</script>

<style scoped>
</style>
