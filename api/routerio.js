import logger from '../log'
import { register } from './io/helper'
import { contentConnection } from './content/connection'

import * as content from './content/routes'
import * as engine from './engine/routes'
import * as graphic from './graphic/routes'
import * as preset from './preset/routes'

function onConnection(server, data) {
  const io = server.socket
  const socket = data.socket
  const log = logger.child({
    id: socket.id,
  })

  let ctx = { io, socket, log }

  contentConnection(ctx)

  register(ctx, 'content', content)
  register(ctx, 'engine', engine)
  register(ctx, 'graphic', graphic)
  register(ctx, 'preset', preset)
}

export default onConnection
