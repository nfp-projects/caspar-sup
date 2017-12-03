import Graphic from './model'

export async function all(ctx) {
  let data = await Graphic.getAll()

  ctx.io.emit('graphic.all', data.toJSON())
}

export async function single(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic get single but no id specified')
    return
  }

  let graphic = await Graphic.getSingle(data.id)

  ctx.io.emit('graphic.single', graphic.toJSON())
}

export async function create(ctx, data) {
  data.settings = {}
  data.is_deleted = false

  if (data.engine === 'countdown') {
    data.settings.html = `<span id="${data.name}-countdown-timer">countdown appears here</span>`
    data.settings.main = 'text'
  }

  await Graphic.create(data)
  
  await all(ctx)
}

export async function remove(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic get single but no id specified')
    return
  }

  let graphic = await Graphic.getSingle(data.id)
  graphic.set({ is_deleted: true })
  await graphic.save()

  await all(ctx)
}

export async function update(ctx, data) {
  if (!data || !data.id) {
    ctx.log.warn('called graphic update but no id specified')
    return
  }

  let graphic = await Graphic.getSingle(data.id)

  graphic.set(data)

  await graphic.save()

  await single(ctx, data)
}
