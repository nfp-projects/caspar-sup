const m = require('mithril')
const createModule = require('./module')

const Menu = createModule({
  init: function() {
    this.monitor('list', 'graphic.all', [])
  }
}, function(ctrl) {
  return m('div', [
    m('h3.container-header', 'Graphics'),
    m('div.container-panel.menu', [
      m('ul.menu-list', [
        // m('a', { href: `/`, config: m.route }, 'Home'),
        Menu.vm.list.map((item) =>
          m('li.menu-item', [
            m('a', { href: `/graphic/${item.id}`, config: m.route }, item.name),
          ])
        )
      ]),
      m('a.menu-item-add', { href: '/add', config: m.route }, 'Add graphic' ),
    ]),
  ])
})
module.exports = Menu
