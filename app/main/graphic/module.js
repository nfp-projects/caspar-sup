const _ = require('lodash')
const m = require('mithril')
const createModule = require('../common/module')
const socket = require('../../shared/socket')
const view = require('./view')
const dragula = require('dragula')

const Graphic = createModule({
  init: function(vnode) {
    this.fetchData(vnode)
  },

  onupdate: function(vnode) {
    this.fetchData(vnode)
  },

  fetchData: function(vnode) {
    if (this.currentId === vnode.attrs.id) return

    if (this.currentId && this.currentId !== vnode.attrs.id) {
      this.unmonitor('graphic.single', this.currentId)
      this.unmonitor('preset.all', this.currentId)
    }

    this.currentId = vnode.attrs.id

    this.monitor(
      'graphic',
      'graphic.single',
      {},
      vnode.attrs.id,
      () => this.recheckTemplate()
    )
    this.monitor('presets', 'preset.all', [], vnode.attrs.id)

    this.currentView = 'view'
    this.current = {}
    this.displayRemove = false
    this.newProperty = ''
    this.newTextField = ''
    this.mainTemplateString = ''
    this.mainTemplateError = ''
    this.mainTemplate = _.template('')
  },

  recheckTemplate: function() {
    if (this.graphic.settings.main !== this.mainTemplateString) {
      this.mainTemplateError = ''
      this.mainTemplateString = this.graphic.settings.main

      try {
        this.mainTemplate = _.template(this.mainTemplateString)
      } catch (e) {
        this.mainTemplateError = `Invalid template: ${e.message}`
      }
    }
  },

  updated: function(name, variable, cont) {
    let target = variable
    let control = cont

    if (!control) {
      control = variable
      target = 'graphic'
    }
    _.set(this[target], name, control.target.value)

    this.recheckTemplate()

    if (target === 'graphic') {
      socket.emit('graphic.update', this.graphic)
    }
  },

  addDataField: function(type, name) {
    if (!name) {
      return 'Please type in proper name'
    }

    if (this.graphic.settings[type].includes(name)) {
      return 'A property with that name already exists'
    }

    this.graphic.settings[type].push(name)

    socket.emit('graphic.update', this.graphic)

    return null
  },

  addProperty: function() {
    this.error = this.addDataField('properties', this.newProperty)

    if (!this.error) {
      this.newProperty = ''

      if (!this.graphic.settings.main) {
        this.graphic.settings.main = `<%- ${ this.graphic.settings.properties[0] } %>`
        this.recheckTemplate()
        socket.emit('graphic.update', this.graphic)
      }
    }
  },

  addTextField: function() {
    this.error = this.addDataField('textfields', this.newTextField)

    if (!this.error) {
      this.newTextField = ''
    }
  },

  removeDataField: function(type, name) {
    this.graphic.settings[type].splice(
      this.graphic.settings[type].indexOf(name), 1)

    if (type === 'properties' && this.graphic.settings.properties.length === 0) {
      this.graphic.settings.main = ''
      this.recheckTemplate()
    }

    socket.emit('graphic.update', this.graphic)
  },

  removeProperty: function(prop) {
    this.removeDataField('properties', prop)
  },

  presetlistInit: function(control) {
    this.initDragula(control, (source, target) => {
      let dragOldIndex = _.findIndex(this.presets, { id: Number(source.getAttribute('data')) })
      let targetOldIndex = this.presets.length - 1
      if (target) {
        targetOldIndex = _.findIndex(this.presets, { id: Number(target.getAttribute('data')) })
      }

      this.presets.splice(targetOldIndex, 0, this.presets.splice(dragOldIndex, 1)[0])

      this.presets.forEach((item, i) => {
        item.sort = i + 1
      })

      socket.emit('preset.patch', this.presets)
    })
  },

  cleanCurrent: function() {
    if (this.graphic.engine === 'countdown') {
      this.current.text = this.graphic.settings.text
      this.current.countdown = this.graphic.settings.countdown
      this.current.finished = this.graphic.settings.finished

      if (!this.current.countdown) {
        this.error = '"Count to" needs to be defined'
      } else {
        let test = new Date(this.current.countdown.replace(' ', 'T'))
        if (!test.getTime()) {
          this.error = '"Count to" has to be valid date and time'
        }
      }
    } else {
      this.graphic.settings.properties.forEach(prop => {
        if (!this.current[prop]) {
          this.current[prop] = ''
        }
      })
    }
  },

  addPreset: function() {
    this.error = ''

    this.cleanCurrent()

    if (this.error) return

    if (this.graphic.engine === 'countdown') {
      this.current.countdown = null
    }

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
    m.route.set('/')
  },

  displayPreset: function(preset) {
    if (this.graphic.engine === 'countdown') {
      this.graphic.settings.text = preset.values.text
      this.graphic.settings.finished = preset.values.finished
      socket.emit('graphic.update', this.graphic)
      return
    }

    socket.emit('content.display', {
      graphic: this.graphic,
      data: preset.values,
    })
  },

  schedulePreset: function(preset) {
    socket.emit('schedule.add', {
      graphic_id: this.graphic.id,
      values: preset.values,
    })
  },

  scheduleCurrent: function() {
    this.error = ''

    this.cleanCurrent()

    if (this.error) return

    socket.emit('schedule.add', {
      graphic_id: this.graphic.id,
      values: this.current,
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

  switchView: function() {
    if (this.currentView === 'view') {
      this.currentView = 'settings'
    } else {
      this.currentView = 'view'
    }
  },

  changeViewTitle: function() {
    if (this.currentView === 'view') {
      return 'Settings'
    }
    return 'Control'
  },
}, view)

module.exports = Graphic
