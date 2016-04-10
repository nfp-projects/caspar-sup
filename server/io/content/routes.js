import _ from 'lodash'

export function display(ctx, data) {
  let compiled = _.template(data.html)
  let html = compiled(data)

  ctx.io.emit('client.display', {
    key: 'content',
    html,
    css: data.css,
  })
}

export function hide(ctx) {
  ctx.io.emit('client.hide', {
    key: 'content',
  })
}
