<template>
  <div v-if="page">
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

    <section class="content">
      <search v-bind:pages="pages"
              v-bind:dataSources="dataSources"></search>

      <panel v-if="page.panels"
             v-bind:page="page"
             v-bind:panels="page.panels"></panel>
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
import Panel from './Panel'

import Search from './Search'

function pageId ($this) {
  return $this.$route.params.page_id
}

// ------------------------------------------------------------

export default {
  name: 'page',
  components: { Panel, Search },
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
    }
  },
  watch: {
    '$route' (to, from) {
      var page = this.pages[pageId(this)]
      if (page && page.result) {
        this.searchInput = page.result.request
      }
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
