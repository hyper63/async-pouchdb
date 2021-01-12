const test = require('tape')

const createPouchdb = require('../')

/*
 * default driver is http
 *
const pouchdb = createPouchdb() 

 */

/*
 * sqlite3 driver
 *
const pouchdb = createPouchdb({
  name: 'websql',
  driver: require('pouchdb-adapter-node-websql')
})
*/

// memory driver
const pouchdb = createPouchdb({
  name: 'memory',
  driver: require('pouchdb-adapter-memory')
})

test('async-pouchdb', async t => {
  const db = await pouchdb('foo').toPromise()
  const result = await db.info().toPromise()

  t.equals(result.db_name, 'foo')
  t.end()
})
