const m = require('mithril')
const createModule = require('./module')
const components = require('./components')
const socket = require('../socket')

const Add = createModule({
  init: function() {
    this.monitor('engines', 'engine.all', [])
    this.graphic = { }
  },

  updated: function(name, control) {
    this.graphic[name] = control.target.value
  },

  create: function() {
    if (!Add.vm.graphic.engine) {
      Add.vm.graphic.engine = Add.vm.engines[0]
    }
    if (!Add.vm.graphic.name) {
      this.error = 'Name cannot be empty'
      return
    }

    socket.emit('graphic.create', Add.vm.graphic)
  },
}, function(ctrl) {
  return m('div', [
    m('h3.container-header', 'Add graphics'),
    m('div.container-panel.panel-add', [
      components.error(Add.vm.error),
      m('label', [
        'Name',
        m('input[type=text]', {
          oninput: Add.vm.updated.bind(Add.vm, 'name'),
        })
      ]),
      m('label', [
        'Engine',
        m('select', {
          onchange: Add.vm.updated.bind(Add.vm, 'engine'),
        }, Add.vm.engines.map(engine =>
          m('option', { key: engine, value: engine }, engine)
        ))
      ]),
      m('a.button', {
        onclick: Add.vm.create.bind(Add.vm)
      }, 'Create'),
    ]),
  ])
})
module.exports = Add
