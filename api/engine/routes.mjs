
/*
 * Event: 'engine.all'
 *
 * Return all supported graphic engines.
 */
export function all(ctx) {
  ctx.socket.emit('engine.all', ['text', 'countdown'])
}
