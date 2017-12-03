import _ from 'lodash'

export const active = { }

function getSocket(ctx, all) {
  if (all === true) return ctx.io
  return ctx.socket
}

export function display(ctx, data) {
  let compiled = _.template(data.graphic.settings.html)
  let html = compiled(data.data)

  let payload = {
    graphic: data.graphic,
    html,
    css: data.graphic.settings.css,
    data: data.data,
  }

  active[data.graphic.name] = payload
  ctx.io.emit('client.display', payload)

  list(ctx, true)
}

export function hide(ctx, data) {
  delete active[data.name]

  ctx.io.emit('client.hide', {
    name: data.name,
  })

  list(ctx, true)
}

function generateDisplayText(item) {
  if (item.graphic.engine === 'countdown') {
    return `${item.data[item.graphic.settings.main]} - ${item.data.countdown}`
  }
  return item.data[item.graphic.settings.main]
}

export function list(ctx, all) {
  let payload = Object.keys(active).map(key => ({
    name: active[key].graphic.name,
    display: generateDisplayText(active[key]),
  }))

  getSocket(ctx, all).emit('content.list', payload)
}

export function reset(ctx) {
  ctx.socket.emit('client.reset', _.values(active))
}
