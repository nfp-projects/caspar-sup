import Settings from '../settings/model'
import { address } from 'ip'
import { CasparCG, AMCP } from 'casparcg-connection'

const timeoutDuration = 60000

let io
let logger

let connection
let casparIsPlaying
let casparIsConnected
let checkTimeout
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
      logger.error('CasparCG: Error', err.message)
    },
    onConnectionStatus: data => {
      casparIsConnected = data.connected

      if (!data.connected) {
        casparIsPlaying = false
        logger.warn('CasparCG: connection closed, retrying in 60 seconds', connection.connected)
        io.emit('casparcg.status', currentStatus())
        if (checkTimeout) clearInterval(checkTimeout)
        checkTimeout = null
      }
    },
    onConnected: async connected => {
      logger.info('CasparCG: connected', connected)
      io.emit('casparcg.status', currentStatus())
      checkClientPlaying(false, true)

      // Run our check on hourly interval
      if (checkTimeout) clearInterval(checkTimeout)
      checkTimeout = setInterval(() => checkClientPlaying(), timeoutDuration * 60)
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

export async function checkClientPlaying(starting = false, first = false) {
  let ip
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    ip = 'localhost'
  } else {
    ip = address()
  }

  // Check if we lost connection while attempting to start playing
  if (!connection.connected) {
    logger.error('CasparCG: Attempted to play but connection was lost')
  }

  try {
    // Check if we're already playing
    let output = await connection.info(1, 100)

    if (output.response.data.status !== 'playing') {
      casparIsPlaying = false

      if (starting) {
        // We are not playing, check to see if we've already attempted
        // to issue a play command and delay trying for a minute
        await new Promise(res => {
          logger.warn('CasparCG: Play did not start playing, retrying in 60 seconds')
          setTimeout(res, timeoutDuration)
        })
      }

      // Send a play command and retry checking again
      logger.info(`CasparCG: Sending play command for ${ip}:3000`)
      await connection.do(new AMCP.CustomCommand(`PLAY 1-100 [HTML] "http://${ip}:3000/client.html" CUT 1 LINEAR RIGHT`))
      return checkClientPlaying(true)
    }

    casparIsPlaying = true

    // We are playing, notify all clients
    io.emit('casparcg.status', currentStatus())
    if (starting || first) {
      logger.info('CasparCG: client is up and playing')
    }
  } catch (e) {
    // Unknown error occured
    casparIsPlaying = true
    logger.error(e, 'CasparCG: Error starting play on client')
    io.emit('casparcg.status', currentStatus(e))
  }
}
