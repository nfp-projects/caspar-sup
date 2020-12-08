const defaults = require('../shared/defaults')
const socket = require('../shared/socket')

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

module.exports = function Module(module) {
  return defaults(module, {
    init: function() {},

    oninit: function(vnode) {
      this._listeners = []
      this.init(vnode)
    },

    _listeners: null,

    _socketOn: function(cb) {
      socket.on('connect', () => cb())

      if (socket.connected) {
        cb()
      }
    },

    _initDragula: function(control, cb) {
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

    on: function(name, cb) {
      this._listeners.push([name, cb])
      socket.on(name, cb)
    },

    remove: function() {},

    onremove: function() {
      this.remove()
      if (!this._listeners) return
      for (let i = 0; i < this._listeners.length; i++) {
        socket.removeListener(this._listeners[0], this._listeners[1])
      }
    },
  })
}
