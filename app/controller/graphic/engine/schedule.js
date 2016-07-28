const m = require('mithril')
const components = require('../../components')

exports.view = function(ctlr, graphic, vm) {
  if (!graphic.settings.properties) {
    graphic.settings.properties = []
  }
  if (!graphic.settings.textfields) {
    graphic.settings.textfields = []
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
    graphic.settings.textfields.map((prop, index) =>
      m('label', { key: index }, [
        prop,
        m('textarea', {
          rows: '6',
          oninput: vm.updated.bind(vm, prop, 'current'),
          value: vm.current[prop] || '',
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
          ', ',
          graphic.settings.textfields.map(prop =>
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
    /* -------- Simple Properties -------- */
    m('label', 'Simple Properties'),
    m('label', [
      'Main',
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
    /* -------- Simple Properties List -------- */
    m('label', 'List'),
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
    /* -------- Text Properties -------- */
    m('label', 'Text Fields'),
    m('div', [
      graphic.settings.textfields.map((prop, index) =>
        m('.row', { key: 'add-prop-' + index }, [
          m('div', { class: 'small-10 columns panel-graphic-property-item' },
            m('input[type=text]', {
              readonly: true,
              value: prop,
            })
          ),
          m('div', { class: 'small-2 columns' },
            m('a.panel-graphic-property-remove.button.alert', {
              onclick: vm.removeDataField.bind(vm, 'textfields', prop),
            }, 'Remove')
          )
        ])
      ),
    ]),
    m('.row', [
      m('div', { class: 'small-10 columns panel-graphic-property-item' },
        m('input[type=text]', {
          value: vm.newTextField(),
          oninput: m.withAttr('value', vm.newTextField),
        })
      ),
      m('div', { class: 'small-2 columns' },
        m('a.panel-graphic-property-add.button', {
          onclick: vm.addTextField.bind(vm),
        }, 'Add')
      ),
    ]),
    /* -------- Delete -------- */
    m('a.panel-graphic-delete.button.alert', {
      onclick: vm.remove.bind(vm),
    }, 'Delete graphic'),
  ]
}
