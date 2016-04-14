
export function all(ctx) {
  ctx.socket.emit('engine.all', ['text', 'countdown'])
}
