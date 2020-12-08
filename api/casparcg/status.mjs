import { currentStatus } from './client.mjs'

export async function casparStatus(ctx) {
  ctx.socket.emit('casparcg.status', currentStatus())
}
