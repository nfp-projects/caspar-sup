export function register(ctx, name, method) {
  if (typeof(method) === 'object') {
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
