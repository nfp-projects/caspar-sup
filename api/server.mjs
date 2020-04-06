import Koa from 'koa'
import serve from 'koa-better-serve'
import socket from 'koa-socket'
import * as casparcg from './casparcg/client.mjs'

import lowdb from './db.mjs'
import config from './config.mjs'
import log from './log.mjs'
import onConnection from './routerio.mjs'
import { bunyanLogger, errorHandler } from './middlewares.mjs'

log.info('Server: Opening database db.json')

lowdb().then(function(db) {
  const app = new Koa()
  const io = new socket()

  io.attach(app)

  io.on('connection', onConnection.bind(this, io, db))

  casparcg.initialise(log, db, io)

  app.use(bunyanLogger(log))
  app.use(errorHandler())
  app.use(async (ctx, next) => {
    if (ctx.url === '/') {
      return ctx.redirect('/index.html')
    }
    await next()
  })
  app.use(serve('./public', ''))

  app.listen(config.get('server:port'), err => {
    if (err) return log.fatal(err)
    log.info(`Server is listening on ${config.get('server:port')}`)
  })
}, function(e) {
  log.fatal(e, 'Critical error loading database')
  process.exit(1)
}).catch(function(e) {
  log.fatal(e, 'Critical error starting server')
  process.exit(1)
})
