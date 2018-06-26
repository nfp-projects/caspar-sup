import Koa from 'koa'
import serve from 'koa-better-serve'
import socket from 'koa-socket'
import * as casparcg from './casparcg/client'

import config from '../config'
import log from '../log'
import onConnection from './routerio'
import { bunyanLogger, errorHandler } from './middlewares'

const app = new Koa()
const io = new socket()

io.attach(app)

io.on('connection', onConnection.bind(this, io))

casparcg.initialise(log, io).catch(e => {
  log.error(e, 'Critical error initialising casparcg')
})

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
  if (err) return log.critical(err)
  log.info(`Server is listening on ${config.get('server:port')}`)
})
