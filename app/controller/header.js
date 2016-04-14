const m = require('mithril')
const createModule = require('./module')
const socket = require('../socket')

const Header = createModule({
  init: function() {
    this.monitor('list', 'content.list', [])
  },

  hide: function(item) {
    socket.emit('content.hide', {
      name: item.name,
    })
  },
}, function(ctrl) {
  return m('div.header', Header.vm.list.length > 0 && [
    m('h3.container-header', 'Currently active'),
    m('ul.header-list', [
      Header.vm.list.map((item, index) =>
        m('li.header-item', { key: 'header-' + index, }, [
          m('a.header-item-hide.button.alert', {
            onclick: Header.vm.hide.bind(Header.vm, item),
          }, 'Hide'),
          m('div.header-item-display', `${item.name} - ${item.display}`),
        ])
      ),
    ]),
  ] || '')
})
module.exports = Header
