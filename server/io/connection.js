import _ from 'lodash'
import Store from './store/model'

export function register(ctx, name, method) {
  if (_.isPlainObject(method)) {
    Object.keys(method).forEach(key => {
      register(ctx, [name, key].join('.'), method[key])
    })
    return
  }

  ctx.socket.on(name, async (data) => {
    if (name !== 'store') {
      ctx.log.info(`Got event ${name}`)
    }

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

  let data = await Store.getAll()

  data.forEach(item =>
    ctx.socket.emit('store', item.toJSON())
  )
}
