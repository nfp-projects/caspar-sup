const _ = require('lodash')
const socket = require('../socket')
const storage = {}
const events = {}

// Listen on all events
let onevent = socket.onevent
let disconnected = false

socket.onevent = function(packet) {
  let args = packet.data || []
  onevent.call(this, packet) // original call
  packet.data = ['*'].concat(args)
  onevent.call(this, packet)
}

socket.on('disconnect', () => {
  disconnected = true
})

socket.on('connect', () => {
  if (disconnected) {
    Object.keys(events).forEach(event => {
      let name = event
      let id = null
      if (event.indexOf(':') > 0) {
        name = event.split(':')[0]
        id = Number(event.split(':')[1])
      }
      socket.emit(name, { id: id })
    })
  }
  disconnected = false
})

function genId(name, id) {
  if (id) {
    return `${name}:${id}`
  }
  return name
}

const store = {
  getId: function(name, id) {
    return genId(name, id)
  },

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
  let id = data && data.id

  let name = genId(event, id)

  if (events[name]) {
    storage[name] = data
    events[name]()
  }
  if (event.indexOf('single') >= 0) {
    let check = event.replace('single', 'all')
    if (events[check]) {
      let index = _.findIndex(storage[check], { id: data.id })
      if (index > -1) {
        storage[check][index] = data
        events[check]()
      } else {
        storage[check].push(data)
        events[check]()
      }
    }
  }
})


window.store = store

module.exports = store
