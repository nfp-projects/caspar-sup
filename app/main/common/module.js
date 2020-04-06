const m = require('mithril')
const _ = require('lodash')
const store = require('../store')
const socket = require('../../shared/socket')
const dragula = require('dragula')

function createModule(component, view) {
  let newModule = { }

  newModule = _.defaults(component, {
    oninit: function(vnode) {
      this.error = null
      this.listening = []
      this.init(vnode)
    },

    _storeUpdated: function(key, name, id, cb) {
      this[key] = store.get(name, id)
      if (cb) cb(store.get(name, id))
      m.redraw()
    },

    init: function() { },

    removing: function() { },

    monitor: function(key, name, fallback, id, cb) {
      this[key] = store.get(name, id) || fallback || { }

      this.listening.push(store.getId(name, id))

      store.listen(name, this._storeUpdated.bind(this, key, name, id, cb), id)

      socket.emit(name, { id: id })
    },

    unmonitor: function(name, id) {
      store.unlisten(store.getId(name, id))
      this.listening.splice(this.listening.indexOf(store.getId(name, id)), 1)
    },

    initDragula: function(control, cb) {
      let dragContainer = document.getElementById('dragcontainer')
      let out = dragula([control.dom], {
        mirrorContainer: dragContainer,
        invalid: el => el.className !== 'graphic-preset-reorder'
                    && el.className !== 'graphic-preset',
      })
      out.on('dragend', () => {
        if (is_touch_device()) {
          document.body.style.cssText = ''
          window.scroll(0, document.body.data)
        }
      })
      out.on('drag', () => {
        if (is_touch_device()) {
          document.body.data = window.scrollY
          document.body.style.cssText = `position: fixed; left: 0; right: 0; overflow: hidden; top: -${window.scrollY}px;`
          dragContainer.style.marginTop = `${document.body.data}px`
        }
      })
      out.on('drop', (a, b, c, d) => {
        cb(a, d)
      })
    },

    onremove: function() {
      this.listening.forEach((item) => {
        store.unlisten(item)
      })
      this.removing()
    },

    view: view,
  })

  return newModule
}

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
// LOL
function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  var mq = function(query) {
    return window.matchMedia(query).matches
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
}

module.exports = createModule
