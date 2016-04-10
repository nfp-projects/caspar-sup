const socket = require('./socket')

socket.on('client.display', (data) => {
  let exists = document.getElementById(data.key)

  if (exists) {
    exists.tag.remove()
    exists.remove()
  }

  let element = document.createElement('div')
  element.innerHTML = data.html
  element.id = data.key
  element.classList.add('root-element')

  let styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.innerHTML = data.css

  element.tag = styleElement

  document.body.appendChild(element)
  document.head.appendChild(styleElement)

  window.setTimeout(() => {
    element.classList.add('root-element-display')
  }, 50)
})

socket.on('client.hide', (data) => {
  let exists = document.getElementById(data.key)

  if (exists) {
    exists.classList.remove('root-element-display')

    window.setTimeout(() => {
      exists.tag.remove()
      exists.remove()
    }, 1500)
  }
})
