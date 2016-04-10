const m = require('mithril')

const Menu = {
  controller: function() {
    return {}
  },

  view: function(ctrl) {
    return m('div', [
      m('h3', 'Menu'),
      m('ul', [
        m('li', [
          m('a', { href: '/', config: m.route }, 'Home'),
        ]),
        m('li', [
          m('a', { href: '/content', config: m.route }, 'Content'),
        ])
      ]),
    ])
  },
}

module.exports = Menu
