var socket = require('./socket')

var engines = {
  text: require('./frontend/text'),
  countdown: require('./frontend/countdown'),
}

var current = []

function display(data) {
  var exists = document.getElementById(data.graphic.name)

  if (exists) {
    exists.tag.remove()
    exists.remove()

    current.splice(current.indexOf(data.graphic.name), 1)
  }
  current.push(data.graphic.name)

  let engine = data.graphic.engine

  if (engines[engine]) {
    engines[engine](data)
  }
}

socket.on('client.display', display)

socket.on('client.hide', function (data) {
  var exists = document.getElementById(data.name)

  if (exists) {
    current.splice(current.indexOf(data.name), 1)

    exists.classList.remove('root-element-display')

    window.setTimeout(function () {
      exists.tag.remove()
      exists.remove()
    }, 1500)
  }
})

socket.on('client.reset', function(data) {
  data.forEach(display)
})
