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
        </div>
        <!-- /.box-header -->

        <div v-if="!page.search.err && !page.search.result"
             class="box-body">
          <div class="overlay">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>

        <div v-if="page.search.err"
             class="alert alert-error">
          <h4><i class="icon fa fa-warning"></i> Error</h4>
          search error: {{page.search.err}}
        </div>

        <div v-if="page.search.result && page.search.result.results.length <= 0"
             class="box-body">
          no results
        </div>

        <div v-if="page.search.result && page.search.result.results.length > 0"
             class="box-body table-responsive no-padding">
          <table class="table table-hover">
            <tbody>
            <tr>
              <th>ID</th>
              <th>Shard</th>
              <th>Score</th>
              <th>Fields</th>
            </tr>
            <tr v-for="x in page.search.result.results">
              <td>{{x.id}}</td>
              <td>{{x.index}}</td>
              <td>{{x.score}}</td>
              <td>{{x.fields}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
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
function pageId ($this) {
  return $this.$route.params.page_id
}

export default {
  name: 'page',
  props: ['pages', 'dataSources'],
  data () {
    return { searchInput: null }
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
      page.search.result = null
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
          page.search.result = data
        },
        failure: (err) => { page.search.err = err }
      })
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
  margin-left: -6.5em;
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
