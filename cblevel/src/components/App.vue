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
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="static/lib/AdminLTE-2.3.6/dist/img/user2-160x160.jpg"
               class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>Peter Pierce</p>
          <!-- Status -->
          <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
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
    <router-view :pages="pages"></router-view>
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

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Create the tabs -->
    <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
      <li class="active">
        <a href="#control-sidebar-home-tab"
           data-toggle="tab"><i class="fa fa-home"></i></a></li>
      <li>
        <a href="#control-sidebar-settings-tab"
           data-toggle="tab"><i class="fa fa-gears"></i></a></li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <!-- Home tab content -->
      <div class="tab-pane active" id="control-sidebar-home-tab">
        <h3 class="control-sidebar-heading">Recent Activity</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript::;">
              <i class="menu-icon fa fa-birthday-cake bg-red"></i>

              <div class="menu-info">
                <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>
                <p>Will be 23 on April 24th</p>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->

        <h3 class="control-sidebar-heading">Tasks Progress</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript::;">
              <h4 class="control-sidebar-subheading">
                Custom Template Design
                <span class="pull-right-container">
                  <span class="label label-danger pull-right">70%</span>
                </span>
              </h4>
              <div class="progress progress-xxs">
                <div class="progress-bar progress-bar-danger"
                     style="width: 70%"></div>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->
      </div>
      <!-- /.tab-pane -->

      <!-- Settings tab content -->
      <div class="tab-pane" id="control-sidebar-settings-tab">
        <form method="post">
          <h3 class="control-sidebar-heading">General Settings</h3>

          <div class="form-group">
            <label class="control-sidebar-subheading">
              Report panel usage
              <input type="checkbox" class="pull-right" checked>
            </label>
            <p>
              Some information about this general settings option
            </p>
          </div>
          <!-- /.form-group -->
        </form>
      </div>
      <!-- /.tab-pane -->
    </div>
  </aside>
  <!-- /.control-sidebar -->

  <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
  <div class="control-sidebar-bg"></div>
</div>
</template>

<script>
import BarTop from './BarTop'

function makePage (descriptionIn) {
  return {
    description: descriptionIn || 'no page description yet'
  }
}

export default {
  name: 'app',
  components: {
    BarTop
  },
  data () {
    return {
      pages: {
        'default': makePage('a starting page for you')
      }
    }
  },
  methods: {
    newPage () {
      var x = 1 + (this.pages.length || 0)
      while (this.pages['page ' + x]) { x++ }
      this.$set(this.pages, 'page ' + x, makePage())
    }
  }
}
</script>

<style>
</style>
