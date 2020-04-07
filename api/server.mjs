import socket from 'socket.io-serveronly'
import http from 'http'
import nStatic from 'node-static'
import * as casparcg from './casparcg/client.mjs'

import lowdb from './db.mjs'
import config from './config.mjs'
import log from './log.mjs'
import onConnection from './routerio.mjs'

log.info('Server: Opening database db.json')

lowdb().then(function(db) {
  const fileServer = new nStatic.Server('./public')
  const server = http.createServer(function (req, res) {
    const child = log.child({})

    const d1 = new Date().getTime()

    var done = function () {
      var requestTime = new Date().getTime() - d1

      let level = 'info'
      if (res.status >= 400) {
        level = 'warn'
      }
      if (res.status >= 500) {
        level = 'error'
      }

      child[level]({
        duration: requestTime,
        status: res.statusCode,
      }, `<-- ${req.method} ${req.url}`)
    }
    
    res.addListener('finish', done);
    res.addListener('close', done);

    req.addListener('end', function () {
      if (req.url === '/') {
        res.writeHead(302, { Location: '/index.html' })
        return res.end()
      }

      fileServer.serve(req, res, function (err) {
        if (err) {
          log.error(err);

          res.writeHead(err.status, err.headers);
          res.end(err.message);
        }
      });
    }).resume()
  })

  const io = new socket(server)
  io.on('connection', onConnection.bind(this, io, db))

  casparcg.initialise(log, db, io)

  server.listen(config.get('server:port'), '0.0.0.0', function(err) {
    if (err) {
      log.fatal(err)
      return process.exit(2)
    }
    log.info(`Server is listening on ${config.get('server:port')}`)
  })
}, function(e) {
  log.fatal(e, 'Critical error loading database')
  process.exit(1)
}).catch(function(e) {
  log.fatal(e, 'Critical error starting server')
  process.exit(1)
})
