import serve from 'koa-static'
import Koa from 'koa'
import socket from 'koa-socket'
import config from '../config'
import log from '../log'
import router from './io/router'
import { bunyanLogger, errorHandler } from './middlewares'

const app = new Koa()
const io = new socket()

io.attach(app)

io.on('connection', router.bind(this, io))

app.use(bunyanLogger(log))
app.use(errorHandler())
app.use(serve('public'))

app.listen(config.get('server:port'))
