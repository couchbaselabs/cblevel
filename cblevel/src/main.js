import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from './components/App'
import Page from './components/Page'

const routes = [
  { path: '/page/:page_id', component: Page }
]

const router = new VueRouter({
  routes // short for routes: routes
})

window.nextResultRegistryId = 1

window.resultRegistry = {}

window.resultRegistryAdd = function (result) {
  var resultId = window.nextResultRegistryId
  window.nextResultRegistryId++
  window.resultRegistry[resultId] = result
  return resultId
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
