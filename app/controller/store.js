const _ = require('lodash')
const socket = require('../socket')
const storage = {}
const events = {}

// Listen on all events
let onevent = socket.onevent

socket.onevent = function(packet) {
  let args = packet.data || []
  onevent.call(this, packet) // original call
  packet.data = ['*'].concat(args)
  onevent.call(this, packet)
}

function genId(name, id) {
  if (id) {
    return `${name}:${id}`
  }
  return name
}

const store = {
  get: function(name, id) {
    return storage[genId(name, id)]
  },

  listen: function(name, caller, id) {
    events[genId(name, id)] = caller
  },

  unlisten: function(name) {
    delete events[name]
    delete storage[name]
  },

  events: events,
  storage: storage,
}

socket.on('*', (event, data) => {
  let name = genId(event, data && data.id)
  if (events[name]) {
    storage[name] = data
    events[name]()
  }
  if (event.contains('single')) {
    let check = event.replace('single', 'all')
    if (events[name]) {
      let index = _.findIndex(storage[check], { id: data.id })
      if (index > -1) {
        storage[check][index] = data
        events[name]()
      }
    }
  }
})


window.store = store

module.exports = store
