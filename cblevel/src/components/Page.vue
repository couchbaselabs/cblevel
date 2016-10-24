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
    </section>

    <!-- Main content -->
    <section class="content">
      <!-- Your Page Content Here -->

      <div>
        <div class="input-group">
          <input type="text" name="q"
                 class="form-control" placeholder="Search..."/>
          <span class="input-group-btn">
            <button type="submit" name="search"
                    class="btn btn-flat"
                    v-on:click="search">
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
    search (event) {
      // `this` inside methods points to the Vue instance
      console.log('Hello ' + this.name + '!')
      // `event` is the native DOM event
      console.log(event.target.tagName)
    }
  }
}
</script>

<style scoped>
</style>
