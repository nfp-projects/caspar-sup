import { currentStatus } from './client'

export async function casparConnection(ctx) {
  ctx.socket.emit('casparcg.status', currentStatus())
}
