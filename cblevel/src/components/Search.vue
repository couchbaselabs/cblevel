<template>
  <div>
    <form v-on:submit.prevent="searchGo" role="form">
      <div class="input-group">
        <input v-model="searchInput"
               type="text" class="form-control"
               placeholder="please enter a search..."/>

        <span class="input-group-btn">
          <button type="submit" class="btn btn-flat">
            <i class="fa fa-search"></i>
          </button>
        </span>
      </div>

      <div class="input-group searchAdvanced" style="width: 90%;">
        <div class="checkbox">
          <label>
            <input v-model="searchAdvanced" type="checkbox"/>
              Show advanced options
          </label>
        </div>

        <transition name="fade">
         <div v-if="searchAdvanced"
              class="row searchAdvanced">
          <div class="col-md-6">
            <div class="box">
              <div class="box-body">
                <div class="form-group">
                  <label class="form-label">
                    Size (integer, max number of results)</label>
                  <input v-model="searchSize"
                         type="text"
                         class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">
                    From (integer, start at result, 0-based)</label>
                  <input v-model="searchFrom"
                         type="text"
                         class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">Fields (strings)</label>
                  <textarea v-model="searchFields"
                            class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Sort</label>
                  <textarea v-model="searchSort"
                            class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Highlight</label>
                  <textarea v-model="searchHighlight"
                            class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Facets</label>
                  <textarea v-model="searchFacets"
                            class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <input v-model="searchExplain" type="checkbox"/> Explain
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-5">
            <pre>{{searchRequest}}</pre>
          </div>
         </div>
        </transition>

        <div>
          <div class="checkbox">
            <label>
              <input v-model="searchExamples" type="checkbox"/>
                Show example searches
            </label>
          </div>

          <transition name="fade">
            <searchExamples v-if="searchExamples"></searchExamples>
          </transition>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Lazy from 'lazy.js'

import moment from 'moment'

import Panel from './Panel'

import SearchExamples from './SearchExamples'

function pageId ($this) {
  return $this.$route.params.page_id
}

// ------------------------------------------------------------

function analyzeResults (data) {
  if (!data || !data.results || data.resultsTotal <= 0) {
    return data
  }

  data.analysis = Lazy(data.results).reduce(function (agg, result) {
    var id = result.id
    var idNum = agg.idToIdNums[id]
    if (idNum === undefined) {
      idNum = agg.ids.length
      agg.ids.push(id)
      agg.idToIdNums[id] = idNum
    }

    return analyzeResultObject(agg, id, idNum, result.fields, '')
  }, { keyInfos: {}, idToIdNums: {}, ids: [] })

  Lazy(data.analysis.keyInfos).each(function (keyInfo, key) {
    keyInfo.valTypeCountsSize = Lazy(keyInfo.valTypeCounts).size()
    keyInfo.valToIdNumsSize = Lazy(keyInfo.valToIdNums).size()
  })

  return data
}

function analyzeResultObject (agg, id, idNum, obj, keyPrefix) {
  agg.keyInfos = agg.keyInfos || {}

  Lazy(obj).each(function (val, key) {
    if (obj instanceof Array) {
      key = keyPrefix
    } else {
      key = keyPrefix + key
    }

    var keyInfo = agg.keyInfos[key] = agg.keyInfos[key] || {
      valTypeCounts: {},
      valToIdNums: {}
    }

    var valType = typeof val
    if (valType === 'string') {
      var t = moment(val, moment.ISO_8601)
      if (t.isValid()) {
        val = t.format()
        valType = 'string.datetime'
      }
    }

    if (key.endsWith('lat')) {
      var lon = obj[key.substring(0, key.length - 3) + 'lon']
      if (lon && valType === typeof lon) {
        valType = valType + '.lat'
      }
    } else if (key.endsWith('lon')) {
      var lat = obj[key.substring(0, key.length - 3) + 'lat']
      if (lat && valType === typeof lat) {
        valType = valType + '.lon'
      }
    }

    if (valType === 'object' && val instanceof Array) {
      analyzeResultObject(agg, id, idNum, val, key + '[]')
      return
    }

    keyInfo.valTypeCounts[valType] = (keyInfo.valTypeCounts[valType] || 0) + 1

    if (valType === 'object') {
      analyzeResultObject(agg, id, idNum, val, key + '.')
      return
    }

    var postings = keyInfo.valToIdNums[val] || []
    postings.push(idNum)
    keyInfo.valToIdNums[val] = postings
  })

  return agg
}

// ------------------------------------------------------------

function autoCreatePanels (resultId, data) {
  var panels = []

  var subPanels = []

  Lazy(data.analysis && data.analysis.keyInfos).each(function (keyInfo, key) {
    if (keyInfo.valTypeCountsSize !== 1) { // Check all the same type.
      return
    }

    if (keyInfo.valTypeCounts['number.lat'] > 0 ||
        keyInfo.valTypeCounts['number.lon'] > 0) {
      return
    }

    var labelMaxLength = 0
    Lazy(keyInfo.valToIdNums).each(function (idNums, val) {
      var n = ('' + val).length
      labelMaxLength = labelMaxLength > n ? labelMaxLength : n
    })
    if (labelMaxLength > 20) {
      return
    }

    if (keyInfo.valToIdNumsSize >= 10) {
      panels.unshift({
        kind: 'resultChart',
        label: 'field: ' + key,
        options: {
          resultChartType: 'bar',
          resultId: resultId,
          key: key
        },
        panels: null
      })
    } else {
      subPanels.push({
        kind: 'resultChart',
        label: 'field: ' + key,
        options: {
          resultChartType: 'doughnut',
          resultId: resultId,
          key: key
        },
        panels: null
      })

      if (subPanels.length >= 3) {
        panels.push({
          kind: 'panel',
          panels: subPanels
        })
        subPanels = []
      }
    }
  })

  if (subPanels.length > 0) {
    panels.push({
      kind: 'panel',
      panels: subPanels
    })
  }

  panels.unshift({ kind: 'resultAnalysis' })
  panels.unshift({ kind: 'resultTable' })

  return panels
}

// ------------------------------------------------------------

export default {
  name: 'page',
  components: { Panel, SearchExamples },
  props: ['pages', 'dataSources'],
  data () {
    return {
      searchInput: null, // Ephemeral model for the search input control.
      searchAdvanced: false,
      searchExamples: false,
      searchSize: 10000,
      searchFrom: 0,
      searchFields: '*',
      searchSort: '[]',
      searchHighlight: '{ "style": null, "fields": [] }',
      searchFacets: '{}',
      searchExplain: false
    }
  },
  computed: {
    page_id () { return pageId(this) },
    page () { return this.pages[pageId(this)] },
    searchRequest () {
      var query = this.searchInput || ''
      if (query.charAt(0) === '{') {
        query = JSON.parse(query)
      } else {
        query = { query: query }
      }

      return {
        query: query,
        size: +this.searchSize || 0,
        from: +this.searchFrom || 0,
        fields: this.searchFields.split(','),
        sort: JSON.parse(this.searchSort) || null,
        highlight: JSON.parse(this.searchHighlight) || null,
        facets: JSON.parse(this.searchFacets) || null,
        explain: this.searchExplain
      }
    }
  },
  methods: {
    searchGo (event) {
      var page = this.pages[pageId(this)]

      delete window.resultRegistry[page.result.resultId]

      page.result.request = this.searchInput || ''
      page.result.resultId = null
      page.result.err = null
      page.panels = []

      var dsName = page.dataSourceName || 'default'
      var ds = this.dataSources[dsName]
      if (!ds) {
        window.alert('unknown data source: ' + dsName)
        return
      }

      window.$.ajax({
        type: 'POST',
        url: ds.url,
        data: JSON.stringify(this.searchRequest),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (data) => {
          data.results = data.hits
          data.resultsTotal = data.total_hits

          data = analyzeResults(data)

          page.result.resultId = window.resultRegistryAdd(data)
          page.result.err = null
          page.panels = autoCreatePanels(page.result.resultId, data)
        },
        failure: (err) => {
          page.result.resultId = null
          page.result.err = err
          page.panels = []
        }
      })
    }
  }
}
</script>

<style scoped>
.searchAdvanced {
  margin-left: 1em;
}
.searchAdvanced .form-control {
  margin-bottom: 10px;
}

.fade-enter-active {
  transition: opacity .5s
}
.fade-enter {
  opacity: 0
}
</style>
