import path from 'path'
import { fileURLToPath } from 'url'
import socket from 'socket.io-serveronly'
import nStatic from 'node-static-lib'

import * as casparcg from './casparcg/client.mjs'
import onConnection from './routerio.mjs'

export function run(config, db, log, core, http, orgPort) {
  log.info('Server: Opening database db.json')

  db.defaults({
    graphics: [],
    presets: [],
    playing: [],
    schedule: [],
    settings: {
      casparplayhost: 'localhost:3000',
      casparhost: 'localhost',
    },
    version: 1,
    trash: [],
  })
  .write()
  .then(
    function() { },
    function(e) { log.error(e, 'Error writing defaults to lowdb') }
  )

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const staticRoot = path.join(__dirname,'../public')
  const fileServer = new nStatic.Server(staticRoot)

  const server = http.createServer(function (req, res) {
    const child = log.child({})

    const d1 = new Date().getTime()

    let isFinished = false

    var done = function () {
      if (isFinished) return
      isFinished = true
      var requestTime = new Date().getTime() - d1

      let level = 'debug'
      if (res.statusCode >= 400) {
        level = 'warn'
      }
      if (res.statusCode >= 500) {
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
          if (err.status !== 404) {
            log.error(err, req.url);
          }

          res.writeHead(err.status, err.headers);
          res.end(err.message);
        }
      });
    }).resume()
  })

  const io = new socket(server)
  io.on('connection', onConnection.bind(this, io, db, log))

  casparcg.initialise(log, db, io)

  let port = orgPort || 3000

  return new Promise(function(resolve, reject) {
    server.listen(port, '0.0.0.0', function(err) {
      if (err) {
        return reject(err)
      }
      log.event.info(`Server is listening on ${port} serving files on ${staticRoot}`)
      log.info(`Server is listening on ${port} serving files on ${staticRoot}`)
      resolve()
    })
  })
}
