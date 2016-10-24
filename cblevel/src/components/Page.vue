<template>
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        page {{$route.params.page_id}}
        <small>Optional description</small>
      </h1>
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
