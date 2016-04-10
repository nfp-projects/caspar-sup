import _ from 'lodash'
import nconf from 'nconf'
const pckg = require('./package.json')

// Helper method for global usage.
nconf.inTest = () => nconf.get('NODE_ENV') === 'test'

// Config follow the following priority check order:
// 1. Arguments
// 2. package.json
// 3. Enviroment variables
// 4. config/config.json
// 5. default settings


// Load arguments as highest priority
nconf.argv()


// Load package.json for name and such
let project = _.pick(pckg, ['name', 'version', 'description', 'author', 'license', 'homepage'])


// If we have global.it, there's a huge chance
// we're in test mode so we force node_env to be test.
if (typeof global.it === 'function') {
  project.NODE_ENV = 'test'
}


// Load overrides as second priority
nconf.overrides(project)


// Load enviroment variables as third priority
nconf.env()


// Load any overrides from the appropriate config file
let configFile = 'config/config.json'

if (nconf.get('NODE_ENV') === 'test') {
  configFile = 'config/config.test.json'
}


nconf.file('main', configFile)

// Load defaults
nconf.file('default', 'config/config.default.json')


// Final sanity checks
/* istanbul ignore if  */
if (typeof global.it === 'function' & !nconf.inTest()) {
  // eslint-disable-next-line no-console
  console.log('Critical: potentially running test on production enviroment. Shutting down.')
  process.exit(1)
}
module.exports = nconf
