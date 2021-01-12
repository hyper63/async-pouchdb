const pouchdb = require('pouchdb-core')
pouchdb.plugin(require('pouchdb-mapreduce'))
pouchdb.plugin(require('pouchdb-replication'))
pouchdb.plugin(require('pouchdb-find'))

const defaultAdapter = { name: 'http', driver: require('pouchdb-adapter-http')} 

const z = require('zod')
const { compose, curry, ifElse, lensProp, over, prop } = require('ramda')
const { Async, Either, eitherToAsync } = require('crocks')
const { Left, Right } = Either

const asyncify = curry(
  (method, db) => over(
    lensProp(method),
    fn => Async.fromPromise(fn.bind(db)),
    db
  )
)
const schema = z.object({
  name: z.string(),
  driver: z.any()
})

const validate = compose(
  eitherToAsync,
  ifElse(prop('success'), compose(Right, prop('data')), compose(Left, prop('issues'))),
  schema.safeParse
)


module.exports = (adapter=defaultAdapter) => (name, options={}) =>
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

