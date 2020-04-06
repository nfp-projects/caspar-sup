const socket = require('../shared/socket')
const m = require('mithril')

const Status = {
  oninit: function() {
    this.current = []
    this.connected = socket.connected
    this.status = {
      connected: false,
      playing: false,
    }

    socket.on('casparcg.status', data => {
      this.status = data
      m.redraw()
    })
    socket.on('content.list', data => {
      this.current = data
      m.redraw()
    })
    socket.on('connect', () => this.updateConnected(true))
    socket.on('disconnect', () => this.updateConnected(false))
  },

  updateConnected: function(connected) {
    this.connected = connected
    m.redraw()
  },

  hide: function(item) {
    socket.emit('content.hide', {
      name: item.name,
    })
  },

  view: function() {
    return [
      m('header', [
        m('h2', 'Active graphics:'),
        m('div.status', {
          class: this.status.connected && 'green',
        }, 'connected'),
        m('div.status', {
          class: this.status.playing && 'green',
        }, 'playing'),
      ]),
      this.current.map(item =>
        m('div.item', { key: `header-${item.id}` }, [
          m('h3', `${item.name} - ${item.display}`),
          m('button', {
            onclick: () => this.hide(item),
          }, 'Hide'),
        ])
      ),
      this.current.length === 0 && m('div.empty', 'No active graphics') || null,
      !this.connected && m('div.disconnected', `
        Lost connection with server, Attempting to reconnect
      `) || null,
    ]
  },
}

m.mount(document.getElementById('container'), Status)

// var engines = {
//   text: require('./text'),
//   countdown: require('./countdown'),
//   schedule: require('./schedule'),
// }

// function display(data) {
//   var exists = document.getElementById(data.graphic.name)

//   var engine = data.graphic.engine

//   if (exists) {
//     exists.innerHtml = data.html
//     exists.tag.innerHtml = data.css

//     engines[engine].update(data)
//     return
//   }

//   if (engines[engine]) {
//     engines[engine].init(data)
//   }
// }

// socket.on('client.display', display)

// socket.on('client.hide', function (data) {
//   var exists = document.getElementById(data.name)

//   if (exists) {
//     exists.classList.remove('root-element-display')

//     window.setTimeout(function () {
//       exists.tag.remove()
//       exists.remove()
//     }, 1500)
//   }
// })

// socket.on('client.reset', function(data) {
//   data.forEach(display)
// })
