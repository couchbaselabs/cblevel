<template>
<div>
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      Page Header {{$route.params.page_id}}
      <small>Optional description</small>
    </h1>
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> Level</a></li>
      <li class="active">Here</li>
    </ol>
  </section>

  <!-- Main content -->
  <section class="content">
    <!-- Your Page Content Here -->
  </section>
</div>
</template>

<script>
export default {
  name: 'page',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
</style>
