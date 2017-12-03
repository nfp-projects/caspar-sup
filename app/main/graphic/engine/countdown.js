const m = require('mithril')
const components = require('../../components')

exports.view = function(ctlr, graphic, vm) {
  return [
    m('label', [
      'Text',
      m('input[type=text]', {
        value: vm.graphic.settings.text || '',
        oninput: vm.updated.bind(vm, 'settings.text'),
      }),
    ]),
    m('label', [
      'Count to (format: "YYYY-MM-DD hh:mm")',
      m('input[type=text]', {
        value: vm.graphic.settings.countdown || '',
        oninput: vm.updated.bind(vm, 'settings.countdown'),
      }),
    ]),
    m('label', [
      'Finished (gets displayed in the countdown upon reaching 0)',
      m('input[type=text]', {
        value: vm.graphic.settings.finished || '',
        oninput: vm.updated.bind(vm, 'settings.finished'),
      }),
    ]),
    components.presetList(vm),
  ]
}

exports.settings = function(cltr, graphic, vm) {
  return [
    m('label', [
      'Name',
      m('input[type=text]', {
        value: graphic.name,
        oninput: vm.updated.bind(vm, 'name'),
      }),
    ]),
    m('label', [
      'HTML (',
          m('a', { href: 'https://lodash.com/docs#template', target: '_blank' }, 'variables'),
          ' available: <%- text %>',
        ')',
      m('p', `<div id="${graphic.name}">`),
      m('textarea', {
        rows: '4',
        oninput: vm.updated.bind(null, 'settings.html'),
        value: graphic.settings.html || '',
      }),
      m('p', `</div>`),
    ]),
    m('label', [
      'CSS',
      m('textarea', {
        rows: '4',
        oninput: vm.updated.bind(null, 'settings.css'),
        value: graphic.settings.css || '',
      })
    ]),
    m('a.panel-graphic-delete.button.alert', {
      onclick: vm.remove.bind(vm),
    }, 'Delete graphic'),
  ]
}

