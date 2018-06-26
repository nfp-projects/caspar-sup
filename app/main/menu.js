const m = require('mithril')
const createModule = require('./common/module')
const socket = require('../socket')

const Menu = createModule({
  init: function() {
    this.monitor('list', 'graphic.all', [])
    this.monitor('settings', 'settings.all', {})
    this.monitor('schedule', 'schedule.total', { total: 0 })
    this.monitor('status', 'casparcg.status', {
      connected: false,
      playing: false,
    })
    this.newHost = ''
    this.enableEdit = false
  },

  setHost(value) {
    this.newHost = value
    this.enableEdit = true
  },

  saveNewHost() {
    socket.emit('settings.update', {
      name: 'casparcg',
      value: this.newHost,
    })

    this.newHost = ''
    this.enableEdit = false
  },
}, function() {
  return [
    m('a', {
      href: '/',
      oncreate: m.route.link,
      class: m.route.get() === '/' && 'active' || '',
    }, `Schedule (${this.schedule.total})` ),
    m('h4.header.header--space', 'Graphics'),
    this.list.map((item) =>
      m('a', {
        href: `/graphic/${item.id}`,
        oncreate: m.route.link,
        class: m.route.get() === `/graphic/${item.id}` && 'active' || '',
      }, item.name)
    ),
    m('h5.header.header--space', 'Other'),
    m('a', {
      href: '/add',
      oncreate: m.route.link,
      class: m.route.get() === '/add' && 'active' || '',
    }, 'Add graphic' ),
    m('h5.header.header--space', 'CasparCG Status'),
    m('input[type=text]', {
      placeholder: 'Host IP',
      value: this.newHost || this.settings.casparcg || '',
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
  ]
})
module.exports = Menu
