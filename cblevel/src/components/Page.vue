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
      <div>
        <div class="input-group">
          <input type="text" name="q"
                 class="form-control" placeholder="Search..."/>
          <span class="input-group-btn">
            <button type="submit" name="search"
                    class="btn btn-flat"
                    v-on:click="pageSearch">
              <i class="fa fa-search"></i>
            </button>
          </span>
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
export default {
  name: 'page',
  props: ['pages'],
  computed: {
    page_id () { return this.$route.params.page_id },
    page () { return this.pages[this.$route.params.page_id] }
  },
  methods: {
    pageRename (event) {
      var name = window.prompt('Rename Page\nPlease enter a page name:')
      if (name) {
        if (this.pages[name]) {
          window.alert('ERROR: that page name is already taken')
          return
        }
        var namePrev = this.$route.params.page_id
        var page = this.pages[namePrev]
        delete this.pages[namePrev]
        this.pages[name] = page

        this.$router.push('/page/' + name)
      }
    },
    pageClone (event) {
      function cloneName (name) {
        return 'clone of ' + name
      }

      var pageName = cloneName(this.$route.params.page_id)
      while (this.pages[cloneName]) { pageName = cloneName(pageName) }
      this.$set(this.pages, pageName,
                JSON.parse(JSON.stringify(this.pages[this.$route.params.page_id])))

      this.$router.push('/page/' + pageName)
    },
    pageDelete (event) {
      if (window.confirm('Are you sure you want to delete this page?')) {
        delete this.pages[this.$route.params.page_id]

        for (var name in this.pages) {
          this.$router.push('/page/' + name)
          return
        }

        this.$router.push('/')
      }
    },
    pageSearch (event) {
      // `this` inside methods points to the Vue instance
      console.log('Hello ' + this.name + '!')
      // `event` is the native DOM event
      console.log(event.target.tagName)
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
