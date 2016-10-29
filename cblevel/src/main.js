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

window.makePage = function (descriptionIn) {
  return {
    description: descriptionIn || 'no page description yet',
    dataSourceName: null,
    result: {
      request: null,
      resultId: null,
      err: null
    },
    panels: []
  }
}

window.locationHashStart = window.location.hash || ''

window.makeDataSource = function () {
  var indexName = null

  var a = window.locationHashStart.split('?') // ["#/foo", "x=y,a=b"]
  var q = a[a.length - 1].split(',')
  for (var i = 0; i < q.length; i++) {
    var kv = q[i].split('=')
    if (kv[0] === 'indexName') {
      indexName = kv[1]
    }
  }

  indexName = indexName || 'default'

  return {
    url: '/api/index/' + indexName + '/query',
    kind: 'Couchbase',
    description: 'FTS index / ' + indexName
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
