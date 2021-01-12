# async-pouchdb

asyncPouchdb is a library that converts the pouchdb api functions into Async Monads 
using the `crocks` module. An Async Monad is an Algerbraic Data Type that manages 
asynchronous function calls in a lazy deterministic way. 

## What is pouchdb? 

check out https://pouchdb.com

## What is crocks?

check out https://crocks.dev

## Install

``` sh
npm install async-pouchdb
```

## Usage in NodeJS

``` js
import { default as createPouchdb } from 'async-pouchdb'
const pouchdb = createPouchdb()
const db = await pouchdb('http://localhost:5984/db').toPromise()
db.allDocs()
  .fork(
    err => console.log(err),
    result => console.log(result)
  )
```

## Options

The default driver is `http`, but you can use other pouchdb drivers as well.

When attaching a driver, it is important to provide both the name of the driver and 
the plugin function. `{ name, driver }`.

## websql example

``` js
import { default as createPouchdb } from 'async-pouchdb'
import pouchdbAdapterNodeWebsql from 'pouchdb-adapter-node-websql'

const pouchdb = createPouchdb({ 
  name: 'websql', 
  driver: pouchdbAdapterNodeWebsql 
})

const db = await pouchdb('foo.db').toPromise()
db.allDocs()
  .fork(
    err => console.log(err),
    result => console.log(result)
  )
```

## memory example


``` js
import { default as createPouchdb } from 'async-pouchdb'
import pouchdbAdapterMemory from 'pouchdb-adapter-memory'

const createPouchdb = require('async-pouchdb')
const pouchdb = createPouchdb({ 
  name: 'memory', 
  driver: pouchdbAdapterMemory 
})
const db = await pouchdb('foo.db').toPromise()

db.allDocs()
  .fork(
    err => console.log(err),
    result => console.log(result)
  )
```

## LICENSE 

MIT

## CONTRIBUTIONS

Welcome

## ACKNOWLEDGEMENTS

* NodeJS - https://nodejs.org
* PouchDB - https://pouchdb.com
* Crocks - https://crocks.dev

## MAINTAINERS

* Tom Wilson - hyper63, LLC
