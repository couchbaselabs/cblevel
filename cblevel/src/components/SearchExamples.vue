<template>
  <div class="searchExamples box">
   <div class="box-body row">
     <dl class="col-md-4">
       <dt>fuzzy</dt>
       <dd>{ "term": "<i>internet</i>",
  "prefix_length": <i>5</i>,
  "fuzziness": <i>1</i>,
  "field": "<i>fieldName</i>" }</dd>
       <dt>term</dt>
       <dd>{ "term": "<i>hello</i>",
  "field": "<i>fieldName</i>" }</dd>
       <dt>match</dt>
       <dd>{ "match": "<i>internet</i>",
  "field": "<i>fieldName</i>",
  "analyzer": "<i>analyzerName</i>",
  "prefix": <i>5</i>,
  "fuzziness": <i>1</i>,
  "operator": OPERATOR }

OPERATOR: <i>0</i> = OR, <i>1</i> = AND</dd>
       <dt>match phrase</dt>
       <dd>{ "match_phrase": "<i>lazy dog</i>",
  "field": "<i>fieldName</i>",
  "analyzer": "<i>analyzerName</i>" }</dd>
       <dt>boolean</dt>
       <dd>{ "must": { &hellip; },
  "must_not": { &hellip; },
  "should": { &hellip; } }</dd>
     </dl>
     <dl class="col-md-4">
       <dt>phrase</dt>
       <dd>{ "terms": [ "<i>lazy</i>", "<i>dog</i>" ],
  "field": "<i>fieldName</i>" }</dd>
       <dt>conjuncts (AND)</dt>
       <dd>{ "conjuncts": { &hellip; } }

<i>+the +lazy +dog</i></dd>
       <dt>disjuncts (OR)</dt>
       <dd>{ "disjuncts": { &hellip; },
  "min": <i>0</i> }

<i>the lazy dog</i></dd>
       <dt>query string</dt>
       <dd>{ "query": "<i>the lazy dog</i>" }</dd>
       <dt>numeric range</dt>
       <dd>{ "min": <i>10</i>, "max": <i>99</i>,
  "inclusive_min": <i>false</i>,
  "inclusive_max": <i>false</i>,
  "field": "<i>fieldName</i>" }</dd>
       <dt>date range</dt>
       <dd>{ "start": <i>"2001-10-09T10:20:30-08:00</i>",
  "end": "<i>2016-10-31</i>",
  "inclusive_start": <i>false</i>,
  "inclusive_end": <i>false</i>,
  "field": "<i>fieldName</i>" }</dd>
     </dl>
     <dl class="col-md-4">
       <dt>prefix</dt>
       <dd>{ "prefix": "<i>inter</i>",
  "field": "<i>fieldName</i>" }</dd>
       <dt>regexp</dt>
       <dd>{ "regexp": "<i>inter.+</i>",
  "field": "<i>fieldName</i>" }</dd>
       <dt>wildcard</dt>
       <dd>{ "wildcard": "<i>inter*</i>",
  "field": "<i>fieldName</i>" }</dd>
       <dt>match all</dt>
       <dd>{ "match_all": {} }</dd>
       <dt>match none</dt>
       <dd>{ "match_none": {} }</dd>
       <dt>doc ids</dt>
       <dd>{ "ids": [ "<i>docId1</i>", &hellip; ] }</dd>
     </dl>
   </div>
  </div>
</template>

<script>
export default {
  name: 'searchExamples'
}
</script>

<style scoped>
.searchExamples {
  margin-left: 2em;
}
.searchExamples dd {
  font-family: monospace;
  font-size: 9pt;
  white-space: pre;
}
.searchExamples dd+dt {
  margin-top: .8em;
}
</style>
