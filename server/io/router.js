import logger from '../../log'
import { register, newConnection } from './connection'

import * as content from './content/routes'
import * as store from './store/routes'

function onConnection(server, data) {
  const io = server.socket
  const socket = data.socket
  const log = logger.child({
    id: socket.id,
  })

  let ctx = { io, socket, log }

  newConnection(ctx)

  register(ctx, 'content', content)
  register(ctx, 'store', store.updateStore)
}

export default onConnection
