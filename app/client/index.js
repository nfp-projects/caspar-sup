var socket = require('../socket')

var engines = {
  text: require('./text'),
  countdown: require('./countdown'),
  schedule: require('./schedule'),
}

function display(data) {
  var exists = document.getElementById(data.graphic.name)

  var engine = data.graphic.engine

  if (exists) {
    exists.innerHtml = data.html
    exists.tag.innerHtml = data.css

    engines[engine].update(data)
    return
  }

  if (engines[engine]) {
    engines[engine].init(data)
  }
}

socket.on('client.display', display)

socket.on('client.hide', function (data) {
  var exists = document.getElementById(data.name)

  if (exists) {
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
