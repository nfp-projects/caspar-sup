export async function all(ctx, payload) {
  let id = Number(payload.graphic_id || payload.id)

  let data = ctx.db.get('presets').filter({ graphic_id: id }).value()

  ctx.io.emit(`preset.all:${id}`, data || [])
}

export async function add(ctx, payload) {
  payload.sort = 1

  let presets = ctx.db.get('presets')

  let last = presets.sortBy('sort').last().value()

  if (last) {
    payload.sort = last.sort + 1
  }

  payload.graphic_id = Number(payload.graphic_id)

  await presets.insert(payload).write()

  await all(ctx, payload)
}

export async function patch(ctx, payload) {
  let presets = ctx.db.get('presets')

  payload.forEach(function(item) {
    presets.updateById(Number(item.id), { sort: item.sort })
  })

  await presets.write()

  await all(ctx, payload[0])
}

export async function remove(ctx, payload) {
  let presets = ctx.db.get('presets')
  let preset = presets.removeById(Number(payload.id)).value()
  await presets.write()

  preset.deleted_at = new Date().getTime()
  preset.type = 'preset'

  await ctx.db.get('trash').insert(preset).write()

  await all(ctx, payload)
}
