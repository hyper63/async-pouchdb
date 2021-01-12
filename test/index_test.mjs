import { default as test } from 'tape'
import { default as createPouchdb } from '../index.mjs'
import pouchdbAdapterMemory from 'pouchdb-adapter-memory'

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
  driver: pouchdbAdapterMemory 
})

test('async-pouchdb', async t => {
  const db = await pouchdb('foo').toPromise()
  const result = await db.info().toPromise()

  t.equals(result.db_name, 'foo')
  t.end()
})
