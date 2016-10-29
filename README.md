cblevel is a explorer for dynamic FTS indexes.

Setup instructions...

    git clone https://github.com/couchbaselabs/cblevel.git

    cd cblevel/cblevel

Next, edit the config/index.js => 'dev' => 'proxyTable' entry to point
to your Couchbase Server's FTS port.  For example, the FTS port will
often be 8094.

Next, in your Couchbase Server, create an FTS index with...

    "index_dynamic": true
    "store_dynamic": true

The default mapping in your FTS index should also be dynamic=true.

Next, use npm install to bring in all the dependencies...

    npm install

Next, start the cblevel nodeJS server, like...

    npm run dev

Finally, in your web browser, visit...

    http://localhost:8080/#/page/default?indexName=$YOUR_FTS_INDEX_NAME

----
License: Apache 2.0
