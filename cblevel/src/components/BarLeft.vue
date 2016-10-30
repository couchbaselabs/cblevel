<template>
<div>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar dataSources -->
      <ul class="sidebar-menu">
        <li class="header">INDEXES</li>
      </ul>

      <div v-for="(ds, ds_id, ds_index) in dataSources"
           class="dataSource-panel">
        <div class="pull-left image">
          <img src="static/media/couchbase-logo-solid.server.01.png"
               class="img-circle" :alt="ds.kind">
        </div>
        <div class="pull-left info">
          <p>{{ds.kind}}</p>
          <a href="#">
            <i class="fa fa-circle text-success"></i>
            {{ds.description}}
          </a>
        </div>
      </div>

      <!-- Sidebar pages -->
      <ul class="sidebar-menu">
        <li class="header">PAGES</li>
        <template v-for="(page, page_id, page_index) in pages">
          <li>
            <router-link v-bind:to="'/page/'+page_id">
              <i class="fa fa-file-o"></i>
              <span>{{page_id}}</span>
            </router-link>
          </li>
        </template>
        <li>
          <a v-on:click="newPage">
            <i class="fa fa-plus"></i> <span>NEW PAGE</span>
          </a>
        </li>
      </ul>
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</div>
</template>

<script>
export default {
  name: 'barLeft',
  props: ['pages', 'dataSources'],
  methods: {
    newPage () {
      var x = 1 + (this.pages.length || 0)
      while (this.pages['page ' + x]) { x++ }

      var pageName = 'page ' + x
      this.$set(this.pages, pageName, window.makePage())

      this.$router.push('/page/' + pageName)
    }
  }
}
</script>

<style scoped>
.sidebar-menu a.router-link-active {
  color: #fff;
}
</style>
