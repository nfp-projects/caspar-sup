const m = require('mithril')
const createModule = require('../common/module')
const components = require('../common/components')
const socket = require('../../socket')
const store = require('../store')

const Add = createModule({
  init: function() {
    this.monitor('engines', 'engine.all', [])
    store.listen('graphic.single', data => {
      if (data.name === this.graphic.name) {
        m.route.set(`/graphic/${data.id}`)
      }
    })
    this.graphic = { }
  },

  updated: function(name, control) {
    this.graphic[name] = control.target.value
  },

  create: function() {
    if (!this.graphic.engine) {
      this.graphic.engine = this.engines[0]
    }
    if (!this.graphic.name) {
      this.error = 'Name cannot be empty'
      return
    }

    socket.emit('graphic.create', this.graphic)
  },

  removing: function() {
    store.unlisten('graphic.single')
  },
}, function() {
  return [
    m('h4.header', 'Add graphic'),
    components.error(this.error),
    m('label', { for: 'create-name' }, 'Name'),
    m('input#create-name[type=text]', {
      oninput: (control) => this.updated('name', control),
    }),
    m('label', { for: 'create-engine' }, 'Engine'),
    m('select', {
      onchange: (control) => this.updated('engine', control),
    }, this.engines.map(engine =>
      m('option', { key: engine, value: engine }, engine)
    )),
    m('input[type=submit]', {
      value: 'Create',
      onclick: () => this.create(),
    }),
  ]
})
module.exports = Add
