import logger from './log.mjs'
import { register } from './io/helper.mjs'
import { contentConnection } from './content/connection.mjs'
import { casparConnection } from './casparcg/connection.mjs'

import * as content from './content/routes.mjs'
import * as engine from './engine/routes.mjs'
import * as graphic from './graphic/routes.mjs'
import * as preset from './preset/routes.mjs'
import * as settings from './settings/routes.mjs'
import * as schedule from './schedule/routes.mjs'

function onConnection(server, db, data) {
  const io = server.socket
  const socket = data.socket
  const log = logger.child({
    id: socket.id,
  })

  let ctx = { io, socket, log, db }

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
