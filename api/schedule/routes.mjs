import Schedule from './model.mjs'

export async function all(ctx) {
  let graphics = ctx.db.get('graphics')
  let data = ctx.db.get('schedule').forEach(function(s) {
    s.graphic = graphics.getById(s.graphic_id).value()
  }).sortBy('sort').value()
  // let data = await Schedule.getAll({ }, ['graphic'], 'sort')

  ctx.io.emit('schedule.all', data)
  total(ctx)
}

export async function total(ctx) {
  let data = ctx.db.get('schedule').size()

  ctx.io.emit('schedule.total', { total: data })
}

export async function add(ctx, payload) {
  payload.sort = 1

  let schedule = ctx.db.get('schedule')

  let last = schedule.sortBy('sort').last().value()

  if (last) {
    payload.sort = last.sort + 1
  }

  await schedule.insert(payload).write()

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
