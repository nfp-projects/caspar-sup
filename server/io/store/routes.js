import Store from './model'

export async function updateStore(ctx, data) {
  let item = await Store.getSingle(data.name)

  item.set('value', data.value)

  await item.save()

  ctx.socket.broadcast.emit('store', item.toJSON())
}
