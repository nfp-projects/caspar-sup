import Preset from './model'

export async function all(ctx, payload) {
  let id = Number(payload.graphic_id || payload.id)

  let data = await Preset.getAll({ graphic_id: id })

  ctx.io.emit(`preset.all:${id}`, data.toJSON())
}

export async function add(ctx, payload) {
  payload.is_deleted = false
  payload.sort = 1

  let last = await Preset.query(q => {
    q.where({ graphic_id: payload.graphic_id })
    q.orderBy('sort', 'desc')
    q.limit(1)
  }).fetch({ require: false })

  if (last) {
    payload.sort = last.get('sort') + 1
  }

  await Preset.create(payload)

  await all(ctx, payload)
}

export async function remove(ctx, payload) {
  let preset = await Preset.getSingle(payload.id)

  preset.set('is_deleted', true)

  await preset.save()

  await all(ctx, payload)
}
