export async function all(ctx) {
  let graphics = ctx.db.get('graphics')
  let data = ctx.db.get('schedule').forEach(function(s) {
    s.graphic = graphics.getById(s.graphic_id).value()
  }).sortBy('sort').value()

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
  let schedule = ctx.db.get('schedule')

  schedule.forEach(function(item) {
    schedule.updateById(Number(item.id), { sort: item.sort })
  })

  await schedule.write()

  await all(ctx)
}

export async function remove(ctx, payload) {
  let schedule = ctx.db.get('schedule')
  let schedItem = schedule.removeById(Number(payload.id)).value()
  await schedule.write()

  schedItem.deleted_at = new Date().getTime()
  schedItem.type = 'schedule'

  await ctx.db.get('trash').insert(schedItem).write()

  await all(ctx)
}
