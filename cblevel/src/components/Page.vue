<template>
  <div v-if="page">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        page <i>{{page_id}}</i>
        <small>
          {{page && page.description}}
        </small>
      </h1>

      <div class="page-options">
        <div class="dropdown">
          <a class="dropdown-toggle" aria-expanded="true"
             data-toggle="dropdown" href="#">
            <i class="fa fa-gear"></i> Options <span class="caret"></span>
          </a>
          <ul class="dropdown-menu">
            <li><a v-on:click="pageRename">Rename this page</a></li>
            <li><a v-on:click="pageDescribe">Change this page's description</a></li>
            <li><a v-on:click="pageClone">Clone this page</a></li>
            <li><a v-on:click="pageDelete">Delete this page</a></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Page content -->
    <section class="content">
      <form v-on:submit.prevent="searchGo">
        <div class="input-group">
          <input v-model="searchInput"
                 type="text" class="form-control" placeholder="search..."/>
          <span class="input-group-btn">
            <button type="submit" class="btn btn-flat">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>

      <resultTable v-bind:result="page.search"></resultTable>
    </section>
  </div>

  <div v-else>
    <div class="alert alert-warning">
      <h4><i class="icon fa fa-warning"></i> Error</h4>
      unknown page "{{page_id}}"
    </div>
  </div>
</template>

<script>
import Lazy from 'lazy.js'

import moment from 'moment'

import ResultChart from './ResultChart'
import ResultTable from './ResultTable'

function pageId ($this) {
  return $this.$route.params.page_id
}

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
    key = keyPrefix + key

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

export default {
  name: 'page',
  components: { ResultChart, ResultTable },
  props: ['pages', 'dataSources'],
  data () {
    return {
      searchInput: null // Ephemeral model for the search input control.
    }
  },
  computed: {
    page_id () { return pageId(this) },
    page () { return this.pages[pageId(this)] }
  },
  methods: {
    pageRename (event) {
      var nameNew = window.prompt('Rename Page\nPlease enter a page name:')
      if (nameNew) {
        if (this.pages[nameNew]) {
          window.alert('ERROR: that page name is already taken')
          return
        }

        var name = this.$route.params.page_id
        var page = this.pages[name]

        this.$delete(this.pages, name)
        this.$set(this.pages, nameNew, page)

        this.$router.push('/page/' + nameNew)
      }
    },
    pageDescribe (event) {
      var s = window.prompt('Please enter a page description:')
      if (s) {
        this.pages[this.$route.params.page_id].description = s
      }
    },
    pageClone (event) {
      function cloneName (name) {
        return 'clone of ' + name
      }

      var name = cloneName(pageId(this))
      while (this.pages[name]) { name = cloneName(name) }

      this.$set(this.pages, name,
                JSON.parse(JSON.stringify(this.pages[pageId(this)])))

      this.$router.push('/page/' + name)
    },
    pageDelete (event) {
      if (window.confirm('Are you sure you want to delete this page?')) {
        this.$delete(this.pages, pageId(this))

        for (var name in this.pages) {
          this.$router.push('/page/' + name)
          return
        }

        this.$router.push('/')
      }
    },
    searchGo (event) {
      var page = this.pages[pageId(this)]

      page.search.input = this.searchInput || ''
      page.search.resultId = null
      page.search.err = null

      var dsName = page.dataSourceName || 'default'
      var ds = this.dataSources[dsName]
      if (!ds) {
        window.alert('unknown data source: ' + dsName)
        return
      }

      window.$.ajax({
        type: 'POST',
        url: ds.url,
        data: JSON.stringify({
          fields: ['*'],
          query: {query: page.search.input},
          size: 10000
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (data) => {
          data.results = data.hits
          data.resultsTotal = data.total_hits

          data = analyzeResults(data)

          page.search.resultId = window.resultRegistryAdd(data)
          page.search.err = null
        },
        failure: (err) => {
          page.search.resultId = null
          page.search.err = err
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.searchInput = this.pages[pageId(this)].search.input
    }
  }
}
</script>

<style scoped>
.content-header > .page-options {
  float: right;
  background: transparent;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 12px;
  padding: 7px 5px;
  position: absolute;
  top: 15px;
  right: 10px;
  border-radius: 2px;
}
.content-header > .page-options .dropdown-menu {
  margin-left: -10.5em;
}
.content-header > .page-options a {
  color: #444;
  text-decoration: none;
  display: inline-block;
}
.content-header > .page-options > li > a > .fa,
.content-header > .page-options > li > a > .glyphicon,
.content-header > .page-options > li > a > .ion {
  margin-right: 5px;
}
.content-header > .page-options > li + li:before {
  content: '>\00a0';
}
</style>
