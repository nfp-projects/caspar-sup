import log from './api/log.mjs'

// Run the database script automatically.
log.info('Starting server.')

import('./api/server.mjs').catch((error) => {
  log.error(error, 'Error while starting server')
  process.exit(1)
})
