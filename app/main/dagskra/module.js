const _ = require('lodash')
const m = require('mithril')
const createModule = require('../common/module')
const socket = require('../../shared/socket')

const Dagskra = createModule({
  init: function() {
    this.error = ''
    this.displayRemove = false
    this.monitor('schedule', 'schedule.all', [])
  },

  scheduleListInit: function(control) {
    this.initDragula(control, (source, target) => {
      let dragOldIndex = _.findIndex(this.schedule, { id: Number(source.getAttribute('data')) })
      let targetOldIndex = this.schedule.length - 1
      if (target) {
        targetOldIndex = _.findIndex(this.schedule, { id: Number(target.getAttribute('data')) })
      }

      this.schedule.splice(targetOldIndex, 0, this.schedule.splice(dragOldIndex, 1)[0])

      this.schedule.forEach((item, i) => {
        item.sort = i + 1
      })

      socket.emit('schedule.patch', this.schedule)
    })
  },

  displaySchedule: function(item) {
    socket.emit('content.display', {
      graphic: item.graphic,
      data: item.values,
    })
  },

  removeSchedule: function(item) {
    socket.emit('schedule.remove', item)
  },
}, function() {
  this.schedule.forEach(item => {
    if (!item.cachedDisplay) {
      try {
        item.cachedDisplay = _.template(item.graphic.settings.main || '')(item.values)
      } catch (e) {
        item.cachedDisplay = `ERROR WITH TEMPLATE: ${e.message}`
      }
      item.cachedDisplay = `[${item.graphic.name}] ${item.cachedDisplay}`
    }
  })
  return [
    m('h4.header', 'Schedule'),
    m('div.graphic-presetlist', {
      oncreate: control => this.scheduleListInit(control),
    },
      this.schedule.map(item =>
        m('div.graphic-preset', {
          key: `preset-${item.id}`,
          data: item.id,
        }, [
          m('div.graphic-preset-reorder'),
          m('input[type=text]', {
            readonly: true,
            value: item.cachedDisplay,
          }),
          m(`button.green`, {
            onclick: () => this.displaySchedule(item),
          }, 'Display'),
          this.displayRemove && m('button.red', {
            onclick: () => this.removeSchedule(item),
          }, 'Remove') || null,
        ]),
      ),
    ),
    this.schedule.length
      && m('button.red.graphic-presetremove', {
          onclick: () => (this.displayRemove = !this.displayRemove),
        }, 'Remove entries')
      || m('div.schedule-empty', 'Schedule is empty'),
  ]
})
module.exports = Dagskra
