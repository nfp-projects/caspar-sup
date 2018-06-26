const m = require('mithril')
const components = require('../../common/components')

exports.view = function(module, graphic) {
  return [
    m('div.graphic-presetadd', [
      m('h3.graphic-presetadd-header', 'Start countdown'),

      m('label', { for: `countdown-text` }, 'Text'),
      m(`input#countdown-text[type=text]`, {
        value: graphic.settings.text || '',
        oninput: module.updated.bind(module, 'settings.text'),
      }),

      m('label', { for: `countdown-countdown` }, 'Count to (format: "YYYY-MM-DD hh:mm")'),
      m(`input#countdown-countdown[type=text]`, {
        value: graphic.settings.countdown || '',
        oninput: module.updated.bind(module, 'settings.countdown'),
      }),

      m('label', { for: `countdown-finished` }, 'Finished (gets displayed in the countdown upon reaching 0)'),
      m(`input#countdown-finished[type=text]`, {
        value: graphic.settings.finished || '',
        oninput: module.updated.bind(module, 'settings.finished'),
      }),
      components.presetButtons(module, 'Display live now', 'Add to template'),
    ]),
    components.presetOnlyList(module, graphic, 'Templates', '', 'Fill top', ''),
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
      ' available: <%- text %>)',
    ]),
    m('p.graphic-helper', `<div id="${graphic.name}">`),
    m('textarea#graphic-html', {
      rows: '4',
      oninput: module.updated.bind(module, 'settings.html'),
      value: graphic.settings.html || '',
    }),
    m('p.graphic-helper.bottom', `</div>`),

    // CSS
    m('label.graphic-label', { for: 'graphic-css' }, 'Graphic CSS'),
    m('p.graphic-helper', '<style type="text/css">'),
    m('textarea#graphic-css', {
      rows: '4',
      oninput: module.updated.bind(module, 'settings.css'),
      value: graphic.settings.css || '',
    }),
    m('p.graphic-helper.bottom', '</style>'),

    // Main display template
    m('label.graphic-label', { for: 'graphic-main' }, [
      'Graphic control display template (',
      m('a', { href: 'https://lodash.com/docs#template', target: '_blank' }, 'variables'),
      ' available: <%- text %>, <%- countdown %>, <%- finished %>)',
    ]),
    m('input#graphic-main[type=text]', {
      value: graphic.settings.main,
      oninput: module.updated.bind(module, 'settings.main'),
    }),
    components.error(module.mainTemplateError),

    // Remove
    m('button.red.graphic-delete', {
      onclick: module.remove.bind(module),
    }, 'Delete graphic'),
  ]
}

