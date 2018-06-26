import Graphic from './model'

/*
 * Event: 'graphic.all'
 *
 * Request all graphics in store
 */
export async function all(ctx) {
  let data = await Graphic.getAll()

  ctx.socket.emit('graphic.all', data.toJSON())
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

  let graphic = await Graphic.getSingle(data.id)

  ctx.socket.emit('graphic.single', graphic.toJSON())
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
  data.is_deleted = false

  if (data.engine === 'countdown') {
    data.settings.html = `<span id="${data.name}-countdown-timer">countdown appears here</span>`
    data.settings.main = '<%- text %> - <%- finished %>'
  }

  let graphic = await Graphic.create(data)
  
  ctx.io.emit('graphic.single', graphic.toJSON())
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

  let graphic = await Graphic.getSingle(data.id)
  graphic.set({ is_deleted: true })
  await graphic.save()

  let output = await Graphic.getAll()
  ctx.io.emit('graphic.all', output.toJSON())
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

  let graphic = await Graphic.getSingle(data.id)

  graphic.set(data)

  await graphic.save()

  ctx.io.emit('graphic.single', graphic.toJSON())
}
