import _ from 'lodash'
import knex from 'knex'
import bookshelf from 'bookshelf'

import config from '../config'
import log from '../log'

let host = config.get('knex:connection')

log.info(host, 'Connecting to DB')

const client = knex(config.get('knex'))

// Check if we're running tests while connected to
// potential production environment.
/* istanbul ignore if  */
if (config.get('NODE_ENV') === 'test' &&
    config.get('knex:connection:database') !== 'test' ||
    config.get('knex:connection:connection')) {
  // There is an offchance that we're running tests on
  // production database. Exit NOW!
  log.error('Critical: potentially running test on production enviroment. Shutting down.')
  process.exit(1)
}

let shelf = bookshelf(client)

// Helper method to create models
shelf.createModel = (attr, opts) => {
  // Create default attributes to all models
  let attributes = _.defaults(attr, {
    /**
     * Initialize a new instance of model. This does not get called when
     * relations to this model is being fetched though.
     */
    initialize() {
      this.on('fetching', this.checkFetching)
    },

    /**
     * Event handler when fetch() is called. This gets called for both
     * when getSingle() or just manual fetch() is called as well as
     * when relation models through belongsTo() resources get fetched.
     *
     * @param {Model} model - The model instance if fetch() was used. For
     *                        belongsTo this is the relation model thingy.
     * @param {Array} columns - Array of columns to select if fetch() was used.
     *                          Otherwise this is null.
     * @param {Object} options - Options for the fetch. Includes the query
     *                           builder object.
     */
    checkFetching(model, columns, options) {
      options.query.where({ is_deleted: false })
    },
  })

  // Create default options for all models
  let options = _.defaults(opts, {
    /**
     * Create new model object in database.
     *
     * @param {Object} data - The values the new model should have
     * @return {Model} The resulted model
     */
    create(data) {
      return this.forge(data).save()
    },

    getSingle(id, withRelated = [], require = true) {
      let where = { id: Number(id) || 0 }

      return this.query({ where })
        .fetch({ require, withRelated })
    },

    getAll(where = {}, withRelated = []) {
      where.is_deleted = false

      return this.query({ where })
        .fetchAll({ withRelated })
    },
  })

  return shelf.Model.extend(attributes, options)
}

export default shelf
