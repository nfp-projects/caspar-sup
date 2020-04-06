import log from './api/log.mjs'
import setup from './api/setup.mjs'

// Run the database script automatically.
log.info('Running database integrity scan.')

setup().then(() => {
  import('./api/server.mjs')
}).catch((error) => {
  log.error(error, 'Error while preparing database')
  process.exit(1)
})
