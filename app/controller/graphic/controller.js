const _ = require('lodash')
const m = require('mithril')
const createModule = require('../module')
const socket = require('../../socket')

const Graphic = createModule({
  init: function() {
    this.monitor('graphic', 'graphic.single', {}, m.route.param('id'))
    this.monitor('presets', 'preset.all', [], m.route.param('id'))

    this.currentView = 'view'
    this.current = {}
    this.newProperty = m.prop('')
  },

  updated: function(name, variable, control) {
    if (!control) {
      control = variable
      variable = 'graphic'
    }
    _.set(this[variable], name, control.target.value)

    if (variable === 'graphic') {
      socket.emit('graphic.update', this.graphic)
    }
  },

  addProperty: function() {
    if (!this.newProperty()) {
      this.error = 'Please type in property name'
      return
    }
    if (this.graphic.settings.properties.includes(this.newProperty())) {
      this.error = 'A property with that name already exists'
      return
    }

    this.graphic.settings.properties.push(this.newProperty())
    this.newProperty('')

    if (!this.graphic.settings.main) {
      this.graphic.settings.main = this.graphic.settings.properties[0]
    }

    socket.emit('graphic.update', this.graphic)
  },

  cleanCurrent: function() {
    if (this.graphic.engine === 'countdown') {
      this.current.text = this.graphic.settings.text
      this.current.countdown = this.graphic.settings.countdown
      this.current.finished = this.graphic.settings.finished

      if (!this.current.countdown) {
        this.error = 'Count to had to be defined'
      }
      else {
        let test = new Date(this.current.countdown.replace(' ', 'T'))
        if (!test.getTime()) {
          this.error = 'Count to has to be valid date and time'
        }
      }
    } else {
      this.graphic.settings.properties.forEach(prop => {
        if (!this.current[prop]) {
          this.current[prop] = ''
        }
      })
    }
    if (this.graphic.settings.main &&
        !this.current[this.graphic.settings.main]) {
      this.error = `Property "${this.graphic.settings.main}" cannot be empty`
      return
    }
  },

  addPreset: function() {
    this.error = ''

    this.cleanCurrent()

    if (this.error) return

    socket.emit('preset.add', {
      graphic_id: this.graphic.id,
      values: this.current,
    })
  },

  removePreset: function(preset) {
    socket.emit('preset.remove', preset)
  },

  remove: function() {
    socket.emit('graphic.remove', this.graphic)
    m.route('/')
  },

  displayPreset: function(preset) {
    socket.emit('content.display', {
      graphic: this.graphic,
      data: preset.values,
    })
  },

  displayCurrent: function() {
    this.error = ''

    this.cleanCurrent()

    if (this.error) return

    socket.emit('content.display', {
      graphic: this.graphic,
      data: this.current,
    })
  },

  removeProperty: function(prop) {
    this.graphic.settings.properties.splice(
      this.graphic.settings.properties.indexOf(prop), 1)
    socket.emit('graphic.update', this.graphic)
  },

  switchView: function() {
    if (Graphic.vm.currentView === 'view') {
      Graphic.vm.currentView = 'settings'
      return
    }
    Graphic.vm.currentView = 'view'
  },
})

module.exports = Graphic

require('./view')
