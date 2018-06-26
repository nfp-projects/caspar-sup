import _ from 'lodash'
import Content from './model'

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

  let old = await Content.getSingle(data.graphic.name)

  if (old) {
    await old.destroy()
  }

  let payload = {
    graphic: data.graphic,
    name: data.graphic.name,
    html: html || '',
    css: data.graphic.settings.css || '',
    data: data.data,
    is_deleted: false,
  }

  let content = await Content.create(payload)

  ctx.io.emit('client.display', content.toJSON())

  list(ctx, true)
}

/*
 * Event: 'content.hide'
 *
 * Hide a specific graphic content
 */
export async function hide(ctx, data) {
  let content = await Content.getSingle(data.name)

  if (!content) return

  await content.destroy()

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
  let allContent = await Content.getAll()

  let payload = await Promise.all(allContent.map(item => ({
    name: item.get('name'),
    display: generateDisplayText(item.toJSON()),
  })))

  getSocket(ctx, all).emit('content.list', payload)
}

/*
 * Event: 'content.list'
 * Runs on start of every new connection
 *
 * Send actual graphics of all active graphics
 */
export async function reset(ctx) {
  let allContent = await Content.getAll()

  ctx.socket.emit('client.reset', allContent.toJSON())
}
