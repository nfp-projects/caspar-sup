import net from 'net'
import parser from 'p3x-xml2json'

let io
let logger
let currentHost
let client
let db

let queue = []
let reconnectInterval = 1000
let isReconnecting = false
let connected = false
let playing = false
let lastError = ''

function startReconnecting() {
  connected = false
  playing = false
  if (queue.length) {
    queue.splice(0, queue.length)
  }
  if(isReconnecting !== false) return
  reconnectInterval = Math.min(reconnectInterval * 1.5, 1000 * 60 * 5)
  isReconnecting = setTimeout(connect, reconnectInterval)
}

function clearReconnect() {
  if(isReconnecting === false) return
  clearTimeout(isReconnecting)
  isReconnecting = false
}

export function queueCommand(command) {
  return new Promise((res, rej) => {
    if (isReconnecting) {
      return rej(new Error('CasparCG is not connected, unable to play command'))
    }
    let request = {
      command: command,
      res: res,
      rej: rej,
      started: new Date(),
      finished: null,
      timeout: null,
    }
    queue.push(request)

    request.timeout = setTimeout(function() {
      if (request.finished) return
      queue.splice(queue.indexOf(request), 1)
      rej(new Error(`CasparCGCommand "${command}" timed out after 15 seconds`))
    }, 15000)

    logger.info('CasparCG Command:', command)
    client.write(command + '\r\n')
  })
}

export async function checkPlaying(db, io, wasSuccess) {
  if (!connected) return
  let path = `http://${db.get('settings.casparplayhost').value()}/client.html`

  try {
    logger.info('CasparCG: Checking if already playing')
    let res = await queueCommand('INFO 1-100')
    if (res.body.channel
        && res.body.channel.stage
        && res.body.channel.stage.layer
        && res.body.channel.stage.layer.layer_100
        && res.body.channel.stage.layer.layer_100.foreground
        && res.body.channel.stage.layer.layer_100.foreground.file
        && res.body.channel.stage.layer.layer_100.foreground.file.path === path) {
      logger.info('CasparCG: Player is playing')
      playing = true
      lastError = ''
      io.emit('casparcg.status', currentStatus())
      return
    }
    if (wasSuccess) {
      logger.warn(res.body, 'CasparCG: Playing was marked as succeeded but could not verify it')
      playing = true
      lastError = 'Sending play command succeeded but was unable to verify'
      io.emit('casparcg.status', currentStatus())
      return
    }

    playing = false
    lastError = 'Sending play command'
    io.emit('casparcg.status', currentStatus())
    logger.info(res.body, 'CasparCG: Sending play command')
    res = await queueCommand(`PLAY 1-100 [HTML] "${path}" CUT 1 LINEAR RIGHT`)
    return setTimeout(function() {
      checkPlaying(db, io, true).then()
    }, 300)
  } catch (err) {
    playing = false
    lastError = `CasparCG: Error checking if playing: ${err.message}. Checking again in 5seconds`
    logger.error(err, 'CasparCG: Error checking if playing')
    io.emit('casparcg.status', currentStatus())
  }

  return setTimeout(function() {
    checkPlaying(db, io, false).then()
  }, 5000)
}

export function initialise(log, database, ioOrg) {
  io = ioOrg
  logger = log
  db = database

  client = new net.Socket()
  client.setEncoding('utf8')

  client.on('connect', function () {
    clearReconnect()
    connected = true
    lastError = ''
    reconnectInterval = 1000
    logger.info('CasparCG: Connected to server')
    io.emit('casparcg.status', currentStatus())
    checkPlaying(db, io, false).then()
    // client.write('INFO 1-100\r\n');
  })
  
  client.on('data', function (data) {
    let request = null

    if (queue.length > 0) {
      request = queue[0]
      queue.splice(0, 1)
    }

    if (!request) {
      return logger.warn({ data }, 'Received unknown response with no command')
    }

    let status
    let splitted
    let header
    let body
    let parsed

    try {
      splitted = data.split('\n')
      header = splitted[0].replace('\r', '')
      status = Number(header.split(' ')[0])
      body = splitted.slice(1)
      parsed = JSON.parse(parser.toJson(body.join('\n')))
    } catch (err) {
      return request.rej(err)
    }

    request.finished = new Date()
    clearTimeout(request.timeout)
    if (status && status < 300) {
      request.res({
        status: status,
        header: header,
        body: parsed || {},
        raw: data
      })
    } else {
      request.err({
        status: status,
        header: header,
        body: parsed || {},
        raw: data
      })
    }
  })
  
  client.on('error', function (err) {
    lastError = 'CasparCG TCP Error: ' + err.code + ', retrying in ' + Math.round(reconnectInterval / 1000) + ' sec'
    logger.warn(lastError)
    io.emit('casparcg.status', currentStatus())
    startReconnecting()
  })
  client.on('close', function() {
    startReconnecting()
  })
  client.on('end', function() {
    startReconnecting()
  })

  connect()
}

export function connect() {
  clearReconnect()
  currentHost = db.get('settings').value().casparhost
  lastError = 'CasparCG: Connecting to ' + currentHost + ':' + 5250
  logger.info(lastError)
  io.emit('casparcg.status', currentStatus())

  client.connect({
    port: 5250,
    host: currentHost
  })
}

export function currentStatus(e) {
  return {
    connected: connected,
    playing: playing,
    error: lastError,
  }
}

export function sendCommand(command) {
  return new Promise(function(res, rej) {

  })
}
/*
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
    for (let key in connection) {
      console.log(key, '=', typeof(connection[key]))
    } 
    connection.autoConnect = false
    // connection.close()
  } else {
    // Unknown error occured
    casparIsPlaying = false
    io.emit('casparcg.status', currentStatus(e))
  }
}*/
