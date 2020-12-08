const m = require('mithril')
const Module = require('./module')
// const createModule = require('./common/module')
const socket = require('../shared/socket')

const Menu = Module({
  init: function() {
    this.list = []
    this.settings = {}
    this.totalSchedule = 0
    this.status = {
      connected: false,
      playing: false,
      error: '',
    }
    this._socketOn(() => this.socketOpen())
    this.newHost = ''
    this.enableEdit = false
  },

  socketOpen: function() {
    socket.on('graphic.all', (res) => {
      this.list = res
      m.redraw()
    })
    socket.on('graphic.created', (res) => {
      this.list.push(res)
      m.redraw()
    })

    this.on('settings.all', (res) => {
      this.settings = res
      m.redraw()
    })

    this.on('schedule.total', (res) => {
      this.totalSchedule = res.total
      m.redraw()
    })

    this.on('casparcg.status', (res) => {
      this.status = res
      m.redraw()
    })

    socket.emit('graphic.all', {})
    socket.emit('settings.all', {})
    socket.emit('schedule.total', {})
    socket.emit('casparcg.status', {})
  },

  setHost(value) {
    this.newHost = value
    this.enableEdit = true
  },

  saveNewHost() {
    socket.emit('settings.update', {
      name: 'casparhost',
      value: this.newHost,
    })

    this.newHost = ''
    this.enableEdit = false
  },
  view: function() {
    return [
      m(m.route.Link, {
        href: '/',
        class: m.route.get() === '/' && 'active' || '',
      }, `Schedule (${this.totalSchedule})` ),
      m('h4.header.header--space', 'Graphics'),
      this.list.map((item) =>
        m(m.route.Link, {
          href: `/graphic/${item.id}`,
          class: m.route.get() === `/graphic/${item.id}` && 'active' || '',
        }, item.name)
      ),
      m('h5.header.header--space', 'Other'),
      m(m.route.Link, {
        href: '/add',
        class: m.route.get() === '/add' && 'active' || '',
      }, 'Add graphic' ),
      m('h5.header.header--space', 'CasparCG Status'),
      m('input[type=text]', {
        placeholder: 'Host IP',
        value: this.newHost || this.settings.casparhost || '',
        oninput: control => this.setHost(control.target.value),
      }),
      this.enableEdit && m('button', {
        onclick: () => this.saveNewHost(),
      }, 'Connect'),
      m('div.status', {
        class: this.status.connected && 'green',
      }, 'connected'),
      m('div.status', {
        class: this.status.playing && 'green',
      }, 'playing'),
      m('div.status-error', { hidden: !this.status.error }, this.status.error)
    ]
  }
})
module.exports = Menu
