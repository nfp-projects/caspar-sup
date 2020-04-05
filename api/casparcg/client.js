import Settings from '../settings/model'
import { CasparCG, AMCP } from 'casparcg-connection'

const timeoutDuration = 5000

let io
let logger

let connection
let casparIsPlaying
let casparIsConnected
let currentHost

export async function initialise(log, socket) {
  io = socket.socket
  logger = log

  return connect()
}

export async function connect() {
  currentHost = await Settings.getValue('casparcg')
  casparIsPlaying = false
  casparIsConnected = false
  logger.info('CasparCG: Connectiong to', currentHost + ':' + 5250)

  if (connection && connection.close) {
    await connection.close()
  }

  connection = new CasparCG({
    host: currentHost,
    port: 5250,
    queueMode: 2,
    autoReconnectInterval: timeoutDuration,
    onError: err => {
      logger.error(err, 'CasparCG: Error')
    },
    onConnectionStatus: data => {
      casparIsConnected = data.connected

      if (!casparIsConnected) {
        logger.warn(`CasparCG: connection down, retrying in ${timeoutDuration / 1000} seconds`)
        io.emit('casparcg.status', currentStatus())
      }
    },
    onConnected: async connected => {
      logger.info('CasparCG: connected', connected)
      if (!casparIsPlaying) {
        startPlaying().then()
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

export async function startPlaying() {
  let ip = 'localhost'

  // Check if we lost connection while attempting to start playing
  if (!connection.connected) {
    logger.error('CasparCG: Attempted to play but connection was lost')
  }

  let success = false

  try {
    // Send a play command
    let command = `PLAY 1-100 [HTML] "http://${ip}:3000/client.html" CUT 1 LINEAR RIGHT`
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
  } else {
    // Unknown error occured
    casparIsPlaying = false
    io.emit('casparcg.status', currentStatus(e))
  }
}
