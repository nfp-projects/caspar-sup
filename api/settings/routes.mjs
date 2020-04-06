import { connect } from '../casparcg/client.mjs'

/*
 * Event: 'settings.all'
 *
 * Request all settings in store
 */
export async function all(ctx) {
  let data = ctx.db.get('settings').value()

  ctx.socket.emit('settings.all', data)
}

/*
 * Event: 'settings.update'
 *
 * Update a single setting value
 *
 * @body {string} [name] - Name of the settings
 * @body {string} [value] - Value of the settings
 */
export async function update(ctx, data) {
  if (!data || data.name == null || data.value == null) {
    ctx.log.warn(data, 'called settings update but no name or value specified, body was:')
    return
  }

  await Settings.setValue(data.name, data.value)

  let output = await Settings.getSettings()
  ctx.io.emit('settings.all', output)

  if (data.name === 'casparcg') {
    connect()
  }
}
