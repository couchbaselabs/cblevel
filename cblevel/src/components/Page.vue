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
      <form v-on:submit.prevent="pageSearch">
        <div class="input-group">
          <input type="text" class="form-control"
                 placeholder="Search..."
                 v-model="searchInput"/>
          <span class="input-group-btn">
            <button type="submit" class="btn btn-flat"
                    v-on:click="pageSearch">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>

      <div v-if="page.search.input" class="box">
        <div class="box-header">
          <h3 class="box-title">{{page.search.input}}</h3>

          <span v-if="searchResult"
                class="pull-right-container">
            <small class="label pull-right bg-green">
              {{searchResult.results.length}} of
              {{searchResult.resultsTotal}}
            </small>
          </span>
        </div>
        <!-- /.box-header -->

        <div v-if="!searchErr && !searchResult"
             class="box-body">
          <div class="overlay">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>

        <div v-if="searchErr"
             class="alert alert-error">
          <h4><i class="icon fa fa-warning"></i> Error</h4>
          search error: {{searchErr}}
        </div>

        <div v-if="searchResult && searchResult.results.length <= 0"
             class="box-body">
          no results
        </div>

        <div v-if="searchResult && searchResult.results.length > 0"
             class="box-body">
          <div>{{searchResult.analysis}}</div>
        </div>

        <div v-if="searchResult && searchResult.results.length > 0"
             class="box-body table-responsive no-padding">
          <table class="table table-hover">
            <tbody>
            <tr>
              <th>ID</th>
              <th>Fields</th>
            </tr>
            <tr v-for="x in searchResult.results">
              <td>{{x.id}}</td>
              <td>{{x.fields}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <charts></charts>
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

import Charts from './Charts'

function pageId ($this) {
  return $this.$route.params.page_id
}

function analyzeResult (data) {
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

    return analyzeResultObject(agg, id, idNum, result.fields)
  }, { keyMetas: {}, idToIdNums: {}, ids: [] })

  return data
}

function analyzeResultObject (agg, id, idNum, obj) {
  return Lazy(obj).keys().reduce(function (agg, key) {
    agg.keyMetas = agg.keyMetas || {}

    var keyMeta = agg.keyMetas[key] = agg.keyMetas[key] || {
      typeCounts: {},
      valCounts: {}
    }

    var val = obj[key]

    var valType = typeof val
    if (valType === 'string') {
      var t = moment(val, moment.ISO_8601)
      if (t.isValid()) {
        val = t.format()
        valType = 'string.datetime'
      }
    }

    keyMeta.typeCounts[valType] = (keyMeta.typeCounts[valType] || 0) + 1
    keyMeta.valCounts[val] = (keyMeta.valCounts[val] || 0) + 1

    return agg
  }, agg)
}

export default {
  name: 'page',
  components: {
    Charts
  },
  props: ['pages', 'dataSources'],
  data () {
    return {
      searchInput: null,
      searchResult: null,
      searchErr: null
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
    pageSearch (event) {
      var page = this.pages[pageId(this)]

      page.search.input = this.searchInput || ''

      page.search.resultId = null
      page.search.err = null

      this.searchResult = null
      this.searchErr = null

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

          page.search.resultId = window.resultRegistryAdd(data)
          page.search.err = null

          this.searchResult = analyzeResult(JSON.parse(JSON.stringify(data)))
          this.searchErr = null
        },
        failure: (err) => {
          page.search.resultId = null
          page.search.err = err

          this.searchResult = null
          this.searchErr = err
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
