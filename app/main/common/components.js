const m = require('mithril')

exports.error = function(error) {
  if (!error) return null

  return m('div.error-box', error)
}

exports.presetOnlyList = function(module, graphic, title, color = 'green', button = 'Display now', schedule = 'Schedule') {
  return m('div', [
    m('label.graphic-label', title),
    m('div.graphic-presetlist', {
      oncreate: control => module.presetlistInit(control),
    },
      module.presets.map(item =>
        m('div.graphic-preset', {
          key: `preset-${graphic.id}-${item.id}`,
          data: item.id,
        }, [
          m('div.graphic-preset-reorder'),
          m('input[type=text]', {
            readonly: true,
            value: module.mainTemplate(item.values),
          }),
          schedule && m(`button`, {
            onclick: module.schedulePreset.bind(module, item),
          }, schedule) || null,
          m(`button.${color}`, {
            onclick: module.displayPreset.bind(module, item),
          }, button),
          module.displayRemove && m('button.red', {
            onclick: module.removePreset.bind(module, item),
          }, 'Remove') || null,
        ]),
      ),
    ),
    module.presets.length &&
      m('button.red.graphic-presetremove', {
        onclick: () => (module.displayRemove = !module.displayRemove),
      }, 'Remove entries') || null,
  ])
}

exports.presetButtons = function(module, green, blue) {
  return [
    m('div.graphic-presetadd-buttons', [
      green && m('button.green', {
        onclick: module.displayCurrent.bind(module),
      }, green) || null,
      blue && m('button', {
        onclick: module.addPreset.bind(module),
      }, blue) || null,
      m('button', {
        onclick: module.scheduleCurrent.bind(module),
      }, 'Add to schedule'),
    ]),
  ]
}
