'use strict'
require('babel-register')

let log = require('./log').default

// Run the database script automatically.
log.info('Running database integrity scan.')
let setup = require('./script/setup')

setup().then(() => {
  require('./api/server')
}).catch((error) => {
  log.error(error, 'Error while preparing database')
  process.exit(1)
})
