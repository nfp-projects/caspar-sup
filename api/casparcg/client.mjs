import CasparConnection from 'casparcg-connection'

const CasparCG = CasparConnection.CasparCG
const AMCP = CasparConnection.AMCP

const timeoutDuration = 5000

let io
let logger

let connection
let casparIsPlaying
let casparIsConnected
let currentHost

export function initialise(log, db, socket) {
  io = socket.socket
  logger = log
  db = db

  connect(db)
}

export function connect(db) {
  currentHost = db.get('settings').value().casparhost
  casparIsPlaying = false
  casparIsConnected = false
  logger.info('CasparCG: Connectiong to', currentHost + ':' + 5250)

  connection = new CasparCG({
    host: currentHost,
    port: 5250,
    queueMode: 2,
    autoReconnectInterval: timeoutDuration,
    onError: err => {
      logger.error(err, 'CasparCG: Error')
    },
    onConnectionStatus: data => {
      if (casparIsPlaying) return
      casparIsConnected = data.connected

      if (!casparIsConnected) {
        logger.warn(`CasparCG: connection down, retrying in ${timeoutDuration / 1000} seconds`)
        io.emit('casparcg.status', currentStatus())
      }
    },
    onConnected: async connected => {
      if (casparIsPlaying) return
      logger.info('CasparCG: connected', connected)
      if (!casparIsPlaying) {
        startPlaying(db).then()
      } else {
        logger.warn('CasparCG: Stopped from starting play again.')
      }
    },
  })
}

export function currentStatus(e) {
  return {
    connected: casparIsConnected,
    playing: casparIsPlaying,
    error: e,
  }
}

export async function startPlaying(db) {
  let ip = db.get('settings').value().casparplayhost

  // Check if we lost connection while attempting to start playing
  if (!connection.connected) {
    logger.error('CasparCG: Attempted to play but connection was lost')
  }

  let success = false

  try {
    // Send a play command
    let command = `PLAY 1-100 [HTML] "http://${ip}/client.html" CUT 1 LINEAR RIGHT`
    logger.info(`CasparCG Command: ${command}`)
    await connection.do(new AMCP.CustomCommand(command))
    success = true
  } catch (e) {
    // Weird error where it throws an error despite a successful play command on reconnect
    if (e && e.responseProtocol && e.responseProtocol.code >= 200 && e.responseProtocol.code < 300) {
      success = true
    } else {
      logger.error(e, 'CasparCG: Error starting play on client')
    }
  }

  if (success) {
    casparIsPlaying = true

    // We are playing, notify all clients
    io.emit('casparcg.status', currentStatus())
    logger.info('CasparCG: client is up and playing')
    /* console.log(connection)
    for (var key in connection) {
      console.log(key, '=', typeof(connection[key]))
    } */
    connection.autoConnect = false
    // connection.close()
  } else {
    // Unknown error occured
    casparIsPlaying = false
    io.emit('casparcg.status', currentStatus(e))
  }
}
