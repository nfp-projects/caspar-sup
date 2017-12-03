const m = require('mithril')
const Graphic = require('./controller')
const components = require('../components')

const engines = {
  text: require('./engine/text'),
  countdown: require('./engine/countdown'),
  schedule: require('./engine/schedule'),
}

Graphic.view = function(ctrl) {
  graphic = Graphic.vm.graphic

  return m('div', [
    m('h3.container-header', 'Graphic'),
    m('div.container-panel.panel-graphic', 
      !graphic.name && m('p', 'Loading...') ||
      [
        m('a.panel-graphic-settings.button', {
          onclick: Graphic.vm.switchView
        }, Graphic.vm.currentView === 'view' && 'Settings' || 'Control'),
        m('h4', graphic.name),
        components.error(Graphic.vm.error),
        engines[graphic.engine][Graphic.vm.currentView](ctrl, graphic, Graphic.vm),
      ]
    ),
  ])
}
