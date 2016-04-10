const m = require('mithril')
const socket = require('../socket')
const store = require('./store')

const Content = { }

Content.vm = (function() {
  let vm = {}

  vm.storeUpdated = function() {
    vm.content = store.get('content') || {}
    m.redraw()
  }

  vm.init = function() {
    vm.content = store.get('content') || {}
    store.listen('content', vm.storeUpdated)
  }

  vm.onunload = function() {
    store.unlisten('content')
  }

  vm.updated = function(name, control) {
    vm.content[name] = control.target.value
    store.set('content', vm.content)
  }

  vm.display = function() {
    socket.emit('content.display', vm.content)
  }

  vm.hide = function() {
    socket.emit('content.hide')
  }

  return vm
})()

Content.controller = function() {
  Content.vm.init()

  this.onunload = Content.vm.onunload
}

Content.view = function() {
  return m('div', [
    m('h3', 'Content'),
    m('div', { class: 'row' }, [
      m('div', { class: 'small-12 columns' }, [
        m('label', [
          'HTML (use <%- name %> and <%- title %> for values)',
          m('textarea', {
            rows: '4',
            oninput: Content.vm.updated.bind(null, 'html'),
            value: Content.vm.content.html || '',
          })
        ]),
      ]),
      m('div', { class: 'small-12 columns' }, [
        m('label', [
          'CSS',
          m('textarea', {
            rows: '4',
            oninput: Content.vm.updated.bind(null, 'css'),
            value: Content.vm.content.css || '',
          })
        ]),
      ]),
      m('div', { class: 'small-12 columns' }, [
        m('label', [
          'Name',
          m('input[type=text]', {
            oninput: Content.vm.updated.bind(null, 'name'),
            value: Content.vm.content.name || '',
          })
        ]),
      ]),
      m('div', { class: 'small-12 columns' }, [
        m('label', [
          'Title',
          m('input[type=text]', {
            oninput: Content.vm.updated.bind(null, 'title'),
            value: Content.vm.content.title || '',
          })
        ]),
      ]),
      m('a.button', {
        onclick: Content.vm.display
      }, 'Display'),
      m('a.button.alert', {
        onclick: Content.vm.hide
      }, 'Hide'),
    ]),
  ])
}

module.exports = Content
