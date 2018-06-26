import Schedule from './model'

export async function all(ctx) {
  let data = await Schedule.getAll({ }, ['graphic'], 'sort')

  ctx.io.emit('schedule.all', data.toJSON())
  total(ctx)
}

export async function total(ctx) {
  let data = await Schedule.getAll({ }, ['graphic'], 'sort')

  ctx.io.emit('schedule.total', { total: data.length })
}

export async function add(ctx, payload) {
  payload.is_deleted = false
  payload.sort = 1

  let last = await Schedule.query(q => {
    q.orderBy('sort', 'desc')
    q.limit(1)
  }).fetch({ require: false })

  if (last) {
    payload.sort = last.get('sort') + 1
  }

  await Schedule.create(payload)

  await all(ctx)
}

export async function patch(ctx, payload) {
  await Promise.all(payload.map(async item => {
    let scheduleItem = await Schedule.getSingle(item.id)

    scheduleItem.set({ sort: item.sort })

    await scheduleItem.save()
  }))

  await all(ctx)
}

export async function remove(ctx, payload) {
  let scheduleItem = await Schedule.getSingle(payload.id)

  await scheduleItem.destroy()

  await all(ctx)
}
