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

window.makeDataSource = function (kind, sourceName) {
  return window.dataSourceKinds[kind || 'Couchbase FTS'].factory(sourceName)
}

window.dataSourceKinds = {
  'Couchbase FTS': {
    factory: function (ftsIndexName) {
      ftsIndexName = ftsIndexName || defaultFTSIndexName()

      return {
        url: '/api/index/' + ftsIndexName + '/query',
        kind: 'Couchbase FTS',
        description: ftsIndexName
      }
    }
  }
}

function defaultFTSIndexName () {
  return window.locationHashStartGet('ftsIndexName') ||
         window.locationHashStartGet('indexName') ||
         'unknown-FTS-index'
}

window.locationHashStart = window.location.hash || '' // "#/foo?x=y,a=b"

window.locationHashStartGet = function (key) {
  var a = window.locationHashStart.split('?') // ["#/foo", "x=y,a=b"]
  var q = a[a.length - 1].split(',')
  for (var i = 0; i < q.length; i++) {
    var kv = q[i].split('=')
    if (kv[0] === key) {
      return kv[1]
    }
  }

  return null
}

/* eslint-disable no-new */
window.mainVue = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
