/*
 * Event: 'graphic.all'
 *
 * Request all graphics in store
 */
export async function all(ctx) {
  let data = ctx.db.get('graphics').value()

  ctx.socket.emit('graphic.all', data)
}

/*
 * Event: 'graphic.single'
 *
 * Request a single graphic
 */
export async function single(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic get single but no id specified')
    return
  }

  let graphic = ctx.db.get('graphics').getById(Number(data.id)).value()

  ctx.socket.emit('graphic.single', graphic)
}

/*
 * Event: 'graphic.create'
 *
 * Create a single graphic and emit to all clients.
 *
 * @body {string} engine - Engine for the graphic
 * @body {string} name - Name of graphic
 */
export async function create(ctx, data) {
  data.settings = {}

  if (data.engine === 'countdown') {
    data.settings.html = `<span id="${data.name}-countdown-timer">countdown appears here</span>`
    data.settings.main = '<%- text %> - <%- finished %>'
  }

  let graphics = ctx.db.get('graphics').insert(data)
  let graphic = graphics.last().value()
  await graphics.write()

  ctx.io.emit('graphic.single', graphic)
}

/*
 * Event: 'graphic.remove'
 *
 * Remove a single graphic
 *
 * @body {int} id - Id of the graphic to remove
 */
export async function remove(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic get single but no id specified')
    return
  }

  let graphics = ctx.db.get('graphics')
  let graphic = graphics.removeById(Number(data.id)).value()
  await graphics.write()

  graphic.deleted_at = new Date().getTime()
  graphic.type = 'graphic'

  await ctx.db.get('trash').insert(graphic).write()

  ctx.io.emit('graphic.all', graphics)
}

/*
 * Event: 'graphic.update'
 *
 * Update a single graphic
 *
 * @body {int} id - Id of the graphic to update
 * @body {string} [name] - Name of the graphic
 * @body {string} [engine] - Engine for the graphic
 * @body {object} [settings] - Settings for the graphic, JSON object
 */
export async function update(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic update but no id specified')
    return
  }

  await ctx.db.get('graphics').updateById(Number(data.id), data).write()

  let graphic = ctx.db.get('graphics').getById(Number(data.id)).value()

  ctx.io.emit('graphic.single', graphic)
}
