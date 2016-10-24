<template>
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        page <i>{{$route.params.page_id}}</i>
        <small>
          {{pages[$route.params.page_id].description}}
        </small>
      </h1>
    </section>

    <!-- Main content -->
    <section class="content">
      <!-- Your Page Content Here -->

      <form action="#" method="get" class="sidebar-form">
        <div class="input-group">
          <input type="text" name="q" class="form-control" placeholder="Search..."/>
          <span class="input-group-btn">
            <button type="submit" name="search"
                    class="btn btn-flat">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: ['pages']
}
</script>

<style scoped>
</style>
