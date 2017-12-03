const m = require('mithril')

exports.error = function(error) {
  if (!error) return null

  return m('div.error-box', error)
}

exports.presetOnlyList = function(vm) {
  return [
    m('label', 'Presets'),
    m('ul.panel-graphic-preset', vm.presets.map((item, index) =>
      m('li', { key: index }, [
        m('.row', { key: index }, [
          m('div', { class: 'small-8 columns panel-graphic-property-item' },
            m('input[type=text]', {
              readonly: true,
              value: item.values[graphic.settings.main],
            })
          ),
          m('div', { class: 'small-4 columns' },
            [
              m('a.panel-graphic-preset-remove.button.success', {
                onclick: vm.displayPreset.bind(vm, item),
              }, 'Display'),
              m('a.panel-graphic-preset-remove.button.alert', {
                onclick: vm.removePreset.bind(vm, item),
              }, 'X')
            ]
          ),
        ])
      ])
    ))
  ]
}

exports.presetButtons = function(vm) {
  return [
    m('a.panel-graphic-preset-add.button', {
      onclick: vm.addPreset.bind(vm),
    }, 'Save Preset'),
    m('a.panel-graphic-display.success.button', {
      onclick: vm.displayCurrent.bind(vm),
    }, 'Display Live'),
  ]
}

exports.presetList = function(vm) {
  return [
    m('a.panel-graphic-preset-add.button', {
      onclick: vm.addPreset.bind(vm),
    }, 'Save Preset'),
    m('a.panel-graphic-display.success.button', {
      onclick: vm.displayCurrent.bind(vm),
    }, 'Display Live'),
    m('label', 'Presets'),
    m('ul.panel-graphic-preset', vm.presets.map((item, index) =>
      m('li', { key: index }, [
        m('.row', { key: index }, [
          m('div', { class: 'small-8 columns panel-graphic-property-item' },
            m('input[type=text]', {
              readonly: true,
              value: item.values[graphic.settings.main],
            })
          ),
          m('div', { class: 'small-4 columns' },
            [
              m('a.panel-graphic-preset-remove.button.success', {
                onclick: vm.displayPreset.bind(vm, item),
              }, 'Display'),
              m('a.panel-graphic-preset-remove.button.alert', {
                onclick: vm.removePreset.bind(vm, item),
              }, 'X')
            ]
          ),
        ])
      ])
    ))
  ]
}
