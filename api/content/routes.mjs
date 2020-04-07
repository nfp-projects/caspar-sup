import _ from 'lodash'

export const active = { }

function getSocket(ctx, all) {
  if (all === true) return ctx.io
  return ctx.socket
}

/*
 * Event: 'content.display'
 *
 * Display a specific graphic content
 */
export async function display(ctx, data) {
  let compiled = _.template(data.graphic.settings.html)
  let html = compiled(data.data)

  // let old = await Content.getSingle(data.graphic.name)

  let playing = ctx.db.get('playing')

  let old = playing.find({ name: data.graphic.name }).value()

  if (old) {
    await playing.removeById(old.id).write()
  }

  let payload = {
    graphic: data.graphic,
    name: data.graphic.name,
    html: html || '',
    css: data.graphic.settings.css || '',
    data: data.data,
    is_deleted: false,
  }

  await playing.insert(payload).write()

  ctx.io.emit('client.display', playing.find({ name: data.graphic.name }).value())

  list(ctx, true)
}

/*
 * Event: 'content.hide'
 *
 * Hide a specific graphic content
 */
export async function hide(ctx, data) {
  let playing = ctx.db.get('playing')

  let old = playing.find({ name: data.name }).value()

  if (!old) return

  await playing.removeById(old.id).write()

  ctx.io.emit('client.hide', {
    name: data.name,
  })

  list(ctx, true)
}

function generateDisplayText(item) {
  // if (item.graphic.engine === 'countdown') {
  //   return `${item.data.text} - ${item.data.finished}`
  // }
  try {
    return _.template(item.graphic.settings.main)(item.data)
  } catch (e) {
    return `Error creating display: ${e.message}`
  }
}

/*
 * Event: 'content.list'
 * Runs on start of every new connection
 *
 * Send a name list of all active graphics
 */
export async function list(ctx, all) {
  let allContent = ctx.db.get('playing').value()

  let payload = await Promise.all(allContent.map(function(item) {
    return {
      name: item.name,
      display: generateDisplayText(item),
    }
  }))

  getSocket(ctx, all).emit('content.list', payload)
}

/*
 * Event: 'content.list'
 * Runs on start of every new connection
 *
 * Send actual graphics of all active graphics
 */
export async function reset(ctx) {
  let allContent = ctx.db.get('playing').value()

  ctx.socket.emit('client.reset', allContent)
}
