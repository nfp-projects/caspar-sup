
module.exports = function(data) {
  var element = document.createElement('div')
  element.innerHTML = data.html
  element.id = data.graphic.name
  element.classList.add('root-element')

  var styleElement = document.createElement('style')
  styleElement.setAttribute('type', 'text/css')
  styleElement.innerHTML = data.css

  element.tag = styleElement

  document.body.appendChild(element)
  document.head.appendChild(styleElement)

  window.setTimeout(function (){
    element.classList.add('root-element-display')
  }, 100)
}
