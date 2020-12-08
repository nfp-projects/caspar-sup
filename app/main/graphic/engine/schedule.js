const m = require('mithril')
const components = require('../../common/components')

exports.view = function(module, graphic) {
  if (!graphic.settings.properties) {
    graphic.settings.properties = []
  }
  if (graphic.settings.properties.length === 0) {
    return [
      m('p.settings-empty', `
        No properties have been defined.
        This graphic needs properties to be defined before usage.
        Click the settings button to define the properties for this graphic.
      `),
      m('button.settings-empty-button', {
        onclick: () => module.switchView(),
      }, module.changeViewTitle()),
    ]
  }
  return [
    m('div.graphic-presetadd', [
      m('h3.graphic-presetadd-header', 'Create preset/display graphic'),
      graphic.settings.properties.map((prop, index) => m.fragment({ key: `prop-${index}` }, [
        m('label', { for: `preset-add-${index}` }, prop),
        m(`input#preset-add-${index}[type=text]`, {
          value: module.current[prop] || '',
          oninput: module.updated.bind(module, prop, 'current'),
        }),
      ])),
      components.presetButtons(module, 'Display live now', 'Add to preset list'),
    ]),
    components.presetOnlyList(module, graphic, 'Presets'),
  ]
}

exports.settings = function(module, graphic) {
  return [
    // Name
    m('label.graphic-label', { for: 'graphic-name' }, 'Graphic ID'),
    m('input#graphic-name[type=text]', {
      value: graphic.name,
      oninput: module.updated.bind(module, 'name'),
    }),

    // HTML
    m('label.graphic-label', { for: 'graphic-html' }, [
      'Graphic HTML (',
      m('a', { href: 'https://lodash.com/docs#template', target: '_blank' }, 'variables'),
      ' available: ',
      graphic.settings.properties.map(prop =>
        `<%- ${prop} %>`
      ).join(', '),
      ')',
    ]),
    m('p.graphic-helper', `<div id="${graphic.name}">`),
    m('textarea#graphic-html', {
      rows: '4',
      oninput: module.updated.bind(null, 'settings.html'),
      value: graphic.settings.html || '',
    }),
    m('p.graphic-helper.bottom', `</div>`),

    // CSS
    m('label.graphic-label', { for: 'graphic-css' }, 'Graphic CSS'),
    m('p.graphic-helper', '<style type="text/css">'),
    m('textarea#graphic-css', {
      rows: '4',
      oninput: module.updated.bind(null, 'settings.css'),
      value: graphic.settings.css || '',
    }),
    m('p.graphic-helper.bottom', '</style>'),

    // Main display template
    m('label.graphic-label', { for: 'graphic-main' }, [
      'Graphic control display template (',
      m('a', { href: 'https://lodash.com/docs#template', target: '_blank' }, 'variables'),
      ' available: ',
      graphic.settings.properties.map(prop =>
        `<%- ${prop} %>`
      ).join(', '),
      ')',
    ]),
    m('input#graphic-main[type=text]', {
      value: graphic.settings.main,
      oninput: module.updated.bind(module, 'settings.main'),
    }),

    // Property list
    m('label.graphic-label', 'Properties'),
    graphic.settings.properties.map((prop, index) =>
      m('div.graphic-property', { key: `prop-${index}` }, [
        m('input[type=text]', {
          readonly: true,
          value: prop,
        }),
        m('button.red', {
          onclick: module.removeProperty.bind(module, prop),
        }, 'Remove'),
      ]),
    ),
    graphic.settings.properties.length === 0 && m('p.graphic-empty', 'No properties exist yet.') || [],

    // Add a new property
    m('label.graphic-label', { for: 'graphic-newproperty' }, 'Add new graphic property'),
    m('div.graphic-property', [
      m('input#graphic-newproperty[type=text]', {
        value: module.newProperty,
        oninput: (control) => { module.newProperty = control.target.value },
      }),
      m('button', {
        onclick: module.addProperty.bind(module),
      }, 'Add'),
    ]),
    components.error(module.mainTemplateError),

    // Remove
    m('button.red.graphic-delete', {
      onclick: module.remove.bind(module),
    }, 'Delete graphic'),
  ]
}
