const m = require('mithril')
const createModule = require('./common/module')
const socket = require('../shared/socket')

const Header = createModule({
  init: function() {
    this.currentLength = 0
    this.updateMargin = false
    this.connected = socket.connected
    this.monitor('list', 'content.list', [], null, () => this.checkChanged())

    socket.on('connect', () => {
      this.connected = true
      m.redraw()
    })
    socket.on('disconnect', () => {
      this.connected = false
      m.redraw()
    })
  },

  hide: function(item) {
    socket.emit('content.hide', {
      name: item.name,
    })
  },

  onupdate: function() {
    if (!this.updateMargin) return
    this.updateMargin = false

    let header = document.getElementById('header')
    let container = document.getElementById('container')

    container.style.marginTop = `${ header.clientHeight - 1}px`
  },

  checkChanged: function() {
    if (this.currentLength === this.list.length) return
    this.currentLength = this.list.length
    this.updateMargin = true
  },
}, function() {
  return [
    this.list.length > 0 && [
      m('h4', 'Active graphics'),
      this.list.map(item =>
        m('div.item', { key: `header-${item.id}` }, [
          m('h3', `${item.name} - ${item.display}`),
          m('button.red', {
            onclick: () => this.hide(item),
          }, 'Hide'),
        ])
      ),
    ] || null,
    !this.connected && m('div.disconnected', `
      Lost connection with server, Attempting to reconnect
    `) || null,
  ]
})
module.exports = Header
