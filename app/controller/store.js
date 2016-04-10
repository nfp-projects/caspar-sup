const socket = require('../socket')
const storage = {}
const events = {}

const store = {
  get: function(name) {
    return storage[name]
  },

  set: function(name, value, dontSend) {
    storage[name] = value

    if (dontSend) {
      if (events[name]) {
        events[name]()
      }
      return
    }

    socket.emit('store', {
      name,
      value,
    })
  },

  listen: function(name, caller) {
    events[name] = caller
  },

  unlisten: function(name) {
    delete events[name]
  },
}

socket.on('store', (data) => {
  store.set(data.name, data.value, true)
})

module.exports = store
