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

  <div v-if="result.resultId && results.results.length > 0"
       class="box">
    <div class="box-body no-padding resultTable">
      <table v-if="results.analysis"
            v-on:click="resultClick"
             class="table">
        <tbody>
        <tr>
          <th style="width: 10px">Field</th>
          <th>Type Counts</th>
          <th>#&nbsp;Unique Values</th>
          <th>Value Postings</th>
        </tr>
        <tr v-for="(keyInfo, key) in results.analysis.keyInfos"">
          <td>{{key}}</td>
          <td class="box-body">
            <div v-for="(count, valType) in keyInfo.valTypeCounts">
               {{valType}}: {{count}}
            </div>
          </td>
          <td>{{keyInfo.valToIdNumsSize}}</td>
          <td>
            <div class="postings">{{keyInfo.valToIdNums}}</div>
          </td>
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
  props: ['page'],
  computed: {
    result () {
      return this.page.result
    },
    results () {
      return window.resultRegistry[this.result.resultId]
    }
  },
  methods: {
    resultClick (event) {
      var range
      if (document.caretPositionFromPoint) {
        range = window.document.caretPositionFromPoint(event.clientX, event.clientY)
      } else if (document.caretRangeFromPoint) {
        range = window.document.caretRangeFromPoint(event.clientX, event.clientY)
      } else {
        return
      }

      if (range &&
          range.startContainer === range.endContainer &&
          range.startContainer.nodeType === 3 && /* TEXT-NODE */
          range.startContainer.textContent &&
          range.startContainer.parentNode.className === 'postings') {
        var textContent = range.startContainer.textContent
        var startOffset = range.startOffset
        while (startOffset > 0) {
          var c = textContent.charAt(startOffset - 1)
          if (c < '0' || c > '9') {
            break
          }
          startOffset--
        }
        var sel = textContent.substring(startOffset, startOffset + 99)
                             .split(/[\s,]/)[0]
        var docNum = +sel
        if (sel === '' + docNum) {
          var docNumEl = window.document.getElementById('docNum_' + docNum)
          if (docNumEl) {
            docNumEl.scrollIntoView()
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.resultTable {
  max-height: 30em;
  overflow: auto;
}
.resultTable td .postings {
  max-height: 20em;
  overflow: auto;
}
</style>
