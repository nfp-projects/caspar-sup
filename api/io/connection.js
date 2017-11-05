import _ from 'lodash'

import { reset, list } from './content/routes'

export function register(ctx, name, method) {
  if (_.isPlainObject(method)) {
    Object.keys(method).forEach(key => {
      register(ctx, [name, key].join('.'), method[key])
    })
    return
  }

  ctx.socket.on(name, async (data) => {
    ctx.log.info('Got event', name)

    try {
      await method(ctx, data)
    }
    catch (error) {
      ctx.log.error(error, `Error processing ${name}`)      
    }
  })
}

export async function newConnection(ctx) {
  ctx.log.info('Got new socket connection')

  list(ctx)
  reset(ctx)
}
