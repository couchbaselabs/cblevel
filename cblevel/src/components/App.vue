<template>
<div>
  <!-- Main Header -->
  <header class="main-header">
    <!-- Logo -->
    <a href="index.html" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>cb</b>l</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>cb</b>level</span>
    </a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <barTop></barTop>
    </nav>
  </header>

  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar dataSources -->
      <ul class="sidebar-menu">
        <li class="header">DATA SOURCES</li>
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

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <router-view :pages="pages" :dataSources="dataSources"></router-view>
  </div>
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <footer class="main-footer">
    <!-- To the right -->
    <div class="pull-right hidden-xs">
      cblevel - a couchbaselabs project
    </div>

    <!-- To the left -->
    <span>
      <strong>
        Copyright &copy; 2016
        <a href="http://www.couchbase.com">Couchbase</a>.
      </strong>
      All rights reserved.
    </span>
  </footer>

  <barRight></barRight>
</div>
</template>

<script>
import BarTop from './BarTop'
import BarRight from './BarRight'

function makePage (descriptionIn) {
  return {
    description: descriptionIn || 'no page description yet',
    dataSourceName: null,
    result: {
      request: null,
      resultId: null,
      err: null
    }
  }
}

export default {
  name: 'app',
  components: { BarTop, BarRight },
  data () {
    return {
      pages: {
        'default': makePage('a starting page for you')
      },
      dataSources: {
        'default': {
          url: '/api/index/bs0/query',
          kind: 'Couchbase',
          description: 'FTS index / bs0'
        }
      }
    }
  },
  methods: {
    newPage () {
      var x = 1 + (this.pages.length || 0)
      while (this.pages['page ' + x]) { x++ }

      var pageName = 'page ' + x
      this.$set(this.pages, pageName, makePage())

      this.$router.push('/page/' + pageName)
    }
  }
}
</script>

<style>
.sidebar-menu a.router-link-active {
  color: #fff;
}

.dataSource-panel {
  position: relative;
  width: 100%;
  padding: 10px;
  overflow: hidden;
}
.dataSource-panel:before,
.dataSource-panel:after {
  content: " ";
  display: table;
}
.dataSource-panel:after {
  clear: both;
}
.dataSource-panel > .image > img {
  width: 100%;
  max-width: 45px;
  height: auto;
}
.dataSource-panel > .info {
  padding: 5px 5px 5px 15px;
  line-height: 1;
  position: absolute;
  left: 55px;
}
.dataSource-panel > .info > p {
  font-weight: 600;
  margin-bottom: 9px;
  color: #b8c7ce;
}
.dataSource-panel > .info > a {
  text-decoration: none;
  padding-right: 5px;
  margin-top: 3px;
  font-size: 11px;
}
.dataSource-panel > .info > a > .fa,
.dataSource-panel > .info > a > .ion,
.dataSource-panel > .info > a > .glyphicon {
  margin-right: 3px;
}
</style>
