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
      <div class="box box-default collapsed-box">
        <div class="box-header with-border">
          <h3 class="box-title">Expandable</h3>
          <div class="box-tools pull-right">
            <button type="button" class="btn btn-box-tool" data-widget="collapse">
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <!-- /.box-tools -->
        </div>
        <!-- /.box-header -->
        <div class="box-body" style="display: none;">
           The body of the box
        </div>
        <!-- /.box-body -->
      </div>
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
