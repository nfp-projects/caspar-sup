import logger from '../log'
import { register } from './io/helper'
import { contentConnection } from './content/connection'
import { casparConnection } from './casparcg/connection'

import * as content from './content/routes'
import * as engine from './engine/routes'
import * as graphic from './graphic/routes'
import * as preset from './preset/routes'
import * as settings from './settings/routes'
import * as schedule from './schedule/routes'

function onConnection(server, data) {
  const io = server.socket
  const socket = data.socket
  const log = logger.child({
    id: socket.id,
  })

  let ctx = { io, socket, log }

  contentConnection(ctx)
  casparConnection(ctx)

  register(ctx, 'content', content)
  register(ctx, 'engine', engine)
  register(ctx, 'graphic', graphic)
  register(ctx, 'preset', preset)
  register(ctx, 'settings', settings)
  register(ctx, 'schedule', schedule)
}

export default onConnection
