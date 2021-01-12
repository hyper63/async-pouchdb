import pouchdb from 'pouchdb-core'
import pouchdbMapreduce from 'pouchdb-mapreduce'
import pouchdbReplication from 'pouchdb-replication'
import pouchdbFind from 'pouchdb-find'
import pouchdbAdapterHttp from 'pouchdb-adapter-http'

import ramda from 'ramda'
import Async from 'crocks/Async/index.js'
import Either from 'crocks/Either/index.js'
import eitherToAsync from 'crocks/Async/eitherToAsync.js'
import zod from 'zod'

const { compose, curry, ifElse, lensProp, over, prop, set } = ramda

// initialize plugins
pouchdb.plugin(pouchdbMapreduce)
pouchdb.plugin(pouchdbReplication)
pouchdb.plugin(pouchdbFind)

const defaultAdapter = { name: 'http', driver: pouchdbAdapterHttp } 

const { Left, Right } = Either

const asyncify = curry(
  (method, db) => over(
    lensProp(method),
    fn => Async.fromPromise(fn.bind(db)),
    db
  )
)
const schema = zod.object({
  name: zod.string(),
  driver: zod.any()
})

const validate = compose(
  eitherToAsync,
  ifElse(prop('success'), compose(Right, prop('data')), compose(Left, prop('issues'))),
  schema.safeParse
)


export default (adapter=defaultAdapter) => (name, options={}) =>
  Async.of(adapter)
    .chain(validate)
    .map(a => a ? pouchdb.plugin(a.driver) : pouchdb) // add adapter if exists
    .map(pouchdb => pouchdb(name, { ...options, adapter: adapter.name}))
    .map(asyncify('info'))
    .map(asyncify('allDocs'))
    .map(asyncify('post'))
    .map(asyncify('get'))
    .map(asyncify('put'))
    .map(asyncify('remove'))
    .map(asyncify('bulkDocs'))
    .map(asyncify('find'))
    .map(asyncify('createIndex'))
    .map(asyncify('explain'))
    .map(asyncify('deleteIndex'))
    .map(asyncify('getIndexes'))

