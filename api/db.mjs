import lowdb from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync.js'
import log from './log.mjs'

let lastId = -1

// Take from https://github.com/typicode/lodash-id/blob/master/src/index.js
// from package lodash-id
const lodashId = {
  // Empties properties
  __empty: function (doc) {
    this.forEach(doc, function (value, key) {
      delete doc[key]
    })
  },

  // Copies properties from an object to another
  __update: function (dest, src) {
    this.forEach(src, function (value, key) {
      dest[key] = value
    })
  },

  // Removes an item from an array
  __remove: function (array, item) {
    var index = this.indexOf(array, item)
    if (index !== -1) array.splice(index, 1)
  },

  __id: function () {
    var id = this.id || 'id'
    return id
  },

  getById: function (collection, id) {
    var self = this
    return this.find(collection, function (doc) {
      if (self.has(doc, self.__id())) {
        return doc[self.__id()] === id
      }
    })
  },

  createId: function (collection, doc) {
    let next = new Date().getTime()
    if (next <= lastId) {
      next = lastId + 1
    }
    lastId = next
    return next
  },

  insert: function (collection, doc) {
    doc[this.__id()] = doc[this.__id()] || this.createId(collection, doc)
    var d = this.getById(collection, doc[this.__id()])
    if (d) throw new Error('Insert failed, duplicate id')
    collection.push(doc)
    return doc
  },

  upsert: function (collection, doc) {
    if (doc[this.__id()]) {
      // id is set
      var d = this.getById(collection, doc[this.__id()])
      if (d) {
        // replace properties of existing object
        this.__empty(d)
        this.assign(d, doc)
      } else {
        // push new object
        collection.push(doc)
      }
    } else {
      // create id and push new object
      doc[this.__id()] = this.createId(collection, doc)
      collection.push(doc)
    }

    return doc
  },

  updateById: function (collection, id, attrs) {
    var doc = this.getById(collection, id)

    if (doc) {
      this.assign(doc, attrs, {id: doc.id})
    }

    return doc
  },

  updateWhere: function (collection, predicate, attrs) {
    var self = this
    var docs = this.filter(collection, predicate)

    docs.forEach(function (doc) {
      self.assign(doc, attrs, {id: doc.id})
    })

    return docs
  },

  replaceById: function (collection, id, attrs) {
    var doc = this.getById(collection, id)

    if (doc) {
      var docId = doc.id
      this.__empty(doc)
      this.assign(doc, attrs, {id: docId})
    }

    return doc
  },

  removeById: function (collection, id) {
    var doc = this.getById(collection, id)

    this.__remove(collection, doc)

    return doc
  },

  removeWhere: function (collection, predicate) {
    var self = this
    var docs = this.filter(collection, predicate)

    docs.forEach(function (doc) {
      self.__remove(collection, doc)
    })

    return docs
  }
}

const adapter = new FileAsync('db.json')

export default function GetDB() {
  return lowdb(adapter)
    .then(function(db) {
      db._.mixin(lodashId)

      db.defaults({
          graphics: [],
          presets: [],
          playing: [],
          schedule: [],
          settings: {
            casparplayhost: 'localhost:3000',
            casparhost: 'host.docker.internal',
          },
          version: 1,
          trash: [],
        })
        .write()
        .then(
          function() { },
          function(e) { log.error(e, 'Error writing defaults to lowdb') }
        )
      
      return db
    })
}
