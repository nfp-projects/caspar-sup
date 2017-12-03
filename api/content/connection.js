import { reset, list } from './routes'

export async function contentConnection(ctx) {
  ctx.log.info('Got new socket connection')

  list(ctx)
  reset(ctx)
}
