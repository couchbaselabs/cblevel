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

  <barLeft :pages="pages" :dataSources="dataSources"></barLeft>

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
import BarLeft from './BarLeft'
import BarRight from './BarRight'

export default {
  name: 'app',
  components: { BarTop, BarLeft, BarRight },
  data () {
    return {
      pages: {
        'default': window.makePage('a starting page for you')
      },
      dataSources: {
        'default': window.makeDataSource()
      }
    }
  }
}
</script>

<style>
body.skin-blue {
  background: #222d32;
}

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
