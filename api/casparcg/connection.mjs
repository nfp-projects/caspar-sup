import { currentStatus } from './client.mjs'

export async function casparConnection(ctx) {
  ctx.socket.emit('casparcg.status', currentStatus())
}
