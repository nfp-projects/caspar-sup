
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

  var timeElement = document.getElementById(data.graphic.name + '-countdown-timer')
  var time = new Date(data.data.countdown.replace(' ', 'T'))

  function pad(n) { return (n < 10) ? ('0' + n) : n }

  function timer() {
    var days = 0
    var hours = 0
    var mins = 0
    var secs = 0

    now = new Date()
    difference = (time - now)

    timeElement = document.getElementById(data.graphic.name + '-countdown-timer')

    if (difference < 0 || !timeElement) {
      clearInterval(data.timer)
      if (timeElement) {
        timeElement.innerHTML = data.data.finished || ''
      }
      return
    }

    if (timeElement.tag !== time) {
      clearInterval(data.timer)
      return
    }

    days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
    hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) );
    mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
    secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);

    var text = pad(hours) + ':' + pad(mins) + ':' + pad(secs);
    if (days > 0) {
      text = days.toString() + ' dag' + (days > 1 && 'a' || '') + ' ' + text;
    }
    timeElement.innerHTML = text
  }

  if (timeElement) {
    timeElement.tag = time
    timer()
    data.timer = setInterval(timer, 1000)
  }
}
