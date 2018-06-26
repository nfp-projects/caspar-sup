
var currentActiveTimer = null

function pad(n) { return (n < 10) ? ('0' + n) : n }

function timer(name) {
  var days = 0
  var hours = 0
  var mins = 0
  var secs = 0

  var now = new Date()

  var timeElement = document.getElementById(name + '-countdown-timer')

  if (!timeElement) {
    clearInterval(currentActiveTimer)
    currentActiveTimer = null
    return
  }

  var data = timeElement.tag
  var time = data.time
  var difference = (time - now)

  if (difference <= 0) {
    clearInterval(currentActiveTimer)
    currentActiveTimer = null
    timeElement.innerHTML = data.data.finished || ''
    return
  }

  days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1)
  hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) )
  mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1)
  secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1)

  var text = pad(hours) + ':' + pad(mins) + ':' + pad(secs)
  if (days > 0) {
    text = days.toString() + ' dag' + (days > 1 && 'a' || '') + ' ' + text
  }
  timeElement.innerHTML = text
}

module.exports.init = function(data) {
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

  module.exports.update(data)
}

module.exports.update = function(data) {
  var timeElement = document.getElementById(data.graphic.name + '-countdown-timer')
  data.time = new Date(data.data.countdown.replace(' ', 'T'))
  
  if (timeElement) {
    timeElement.tag = data
    timer(data.graphic.name)
    if (currentActiveTimer) {
      clearInterval(currentActiveTimer)
    }
    currentActiveTimer = setInterval(timer.bind(null, data.graphic.name), 1000)
  }
}
