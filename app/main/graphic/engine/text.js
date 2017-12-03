const m = require('mithril')
const components = require('../../components')

exports.view = function(ctlr, graphic, vm) {
  if (!graphic.settings.properties) {
    graphic.settings.properties = []
  }
  if (graphic.settings.properties.length === 0) {
    return [
      m('p', 'No properties have been defined.'),
      m('p', 'Click settings to create and define properties to display.'),
    ]
  }
  return [
    components.presetOnlyList(vm),
    graphic.settings.properties.map((prop, index) =>
      m('label', { key: index }, [
        prop,
        m('input[type=text]', {
          value: vm.current[prop] || '',
          oninput: vm.updated.bind(vm, prop, 'current'),
        }),
      ])
    ),
    components.presetButtons(vm),
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
          ' available: ',
          graphic.settings.properties.map(prop =>
            `<%- ${prop} %>`
          ).join(', '),
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
    m('label', [
      'Main property',
      m('select', {
        onchange: vm.updated.bind(vm, 'settings.main'),
      }, graphic.settings.properties.map((prop, index) =>
        m('option', {
          key: 'prop-list-' + index,
          value: prop,
          selected: prop === graphic.settings.main,
        }, prop)
      ))
    ]),
    m('label', 'Properties'),
    m('div', [
      graphic.settings.properties.map((prop, index) =>
        m('.row', { key: 'add-prop-' + index }, [
          m('div', { class: 'small-10 columns panel-graphic-property-item' },
            m('input[type=text]', {
              readonly: true,
              value: prop,
            })
          ),
          m('div', { class: 'small-2 columns' },
            m('a.panel-graphic-property-remove.button.alert', {
              onclick: vm.removeProperty.bind(vm, prop),
            }, 'Remove')
          )
        ])
      ),
    ]),
    m('.row', [
      m('div', { class: 'small-10 columns panel-graphic-property-item' },
        m('input[type=text]', {
          value: vm.newProperty(),
          oninput: m.withAttr('value', vm.newProperty),
        })
      ),
      m('div', { class: 'small-2 columns' },
        m('a.panel-graphic-property-add.button', {
          onclick: vm.addProperty.bind(vm),
        }, 'Add')
      ),
    ]),
    m('a.panel-graphic-delete.button.alert', {
      onclick: vm.remove.bind(vm),
    }, 'Delete graphic'),
  ]
}
