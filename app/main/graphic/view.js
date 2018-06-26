const m = require('mithril')
const components = require('../common/components')

const engines = {
  text: require('./engine/text'),
  countdown: require('./engine/countdown'),
  schedule: require('./engine/schedule'),
}

module.exports = function() {
  let graphic = this.graphic
  let currentView = graphic.engine && engines[graphic.engine][this.currentView] || null

  return [
    m('h4.header', 'Graphic'),
    m('header', [
      m('h3', graphic.name),
      m('button', {
        onclick: () => this.switchView(),
      }, this.changeViewTitle()),
    ]),
    components.error(this.error),
    !currentView && m('p', 'Loading...')
                  || currentView(this, graphic),
  ]
}
