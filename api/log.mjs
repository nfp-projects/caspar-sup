import bunyan from 'bunyan-lite'
import defaults from './defaults.mjs'
import config from './config.mjs'

// Clone the settings as we will be touching
// on them slightly.
let settings = defaults(config.get('bunyan'), null)

// Replace any instance of 'process.stdout' with the
// actual reference to the process.stdout.
for (let i = 0; i < settings.streams.length; i++) {
  if (settings.streams[i].stream === 'process.stdout') {
    settings.streams[i].stream = process.stdout
  }
}

// Create our logger.
const logger = bunyan.createLogger(settings)

export default logger
