const m = require('mithril')
const _ = require('lodash')
const store = require('./store')
const socket = require('../socket')

function createModule(vm, view) {
  let newModule = { }
  let listening = []

  newModule.vm = _.defaults(vm, {
    _init: function() {
      this.error = null
      newModule.vm.init()
    },

    _storeUpdated: function(key, name, id) {
      this[key] = store.get(name, id)
      m.redraw()
    },

    init: function() { },

    monitor: function(key, name, fallback, id) {
      this[key] = store.get(name, id) || fallback || { }

      listening.push(name)

      store.listen(name, this._storeUpdated.bind(this, key, name, id), id)

      socket.emit(name, { id: id })
    },

    onunload: function() {
      listening.forEach((item) => {
        store.unlisten(item)
      })
    },
  })

  newModule.controller = function() {
    newModule.vm._init()

    this.onunload = newModule.vm.onunload
  }

  newModule.view = view

  return newModule
}

module.exports = createModule
