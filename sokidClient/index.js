function sokk({
  uri = 'ws://localhost:8080',
  debug = false,
  reconnect = true,
  reconnectInterval = 2,
  onError = (error) => {},
  onOpen = (openEvent) => {},
  onClose = (closeEvent) => {},
  onMessage = (incomingMessage) => {},
}) {

  // general tools
  const pipe = (...fs) => fs.reduceRight((f, g) => (...xs) => f(g(...xs)))
  const aPipe = (...fs) => input => fs.reduce((x, f) => x.then(f), Promise.resolve(input));
  
  // specialized tools
  const normalizeMessage = msg => {
    if (msg) {
      return Array.isArray(msg) ? msg.slice(0, 3) : [msg]
    } else throw Error('Cannot normalize empty message')
  }
  const encodeString = async str => {
    if (str && typeof str === 'string') {
      return await new TextEncoder().encode(JSON.stringify(str))
    } else throw Error('Expected string as a parameter.')
  }
  const calculateHash = async byteArray => await crypto.subtle.digest('SHA-256', byteArray)
  const applyView = arrayBuffer => new Uint8Array(arrayBuffer)
  const composePayload = payloadBody => {
    const payload = new Uint8Array(125)
    const payloadHeader = new Uint8Array(29)
    payload.set(payloadHeader)
    payloadBody.forEach((typeArray, ix) => {
      payload.set(typeArray, ix * 32 + payloadHeader.length)
    })
    return payload
  }
  
  function connectSocket() {
    const  sokk = new WebSocket(uri)
           sokk.binaryType = "arraybuffer"
    return sokk
  }

  function addEventHandlersToSocket(sokk) {
    sokk.onopen = (openEvent) => {
      if (debug) {
        console.log("Socket connected.")
        console.log(openEvent)
      }
      reconnectInterval = 2
  
      if (typeof onOpen === 'function') {
        onOpen(openEvent)
      }
    }
  
    sokk.onclose = (closeEvent) => {
      if (debug) {
        console.log("Socket closing.")
        console.log(closeEvent)
      }
      
      if (reconnect) {
        const reconnect = () => {
          setTimeout(() => {
            if (debug) { console.log('Trying to reconnect.') }
            try {
              reconnectInterval = reconnectInterval * 1.2;
              socket = startSocket()
            } catch (error) {
              console.log(error)
            }
          }, 1000 * reconnectInterval)
        }
        reconnect()
      }
  
      if (typeof onClose === 'function') {
        onClose(closeEvent)
      }
    }
  
    sokk.onmessage = message => {
      if (debug) {
        console.log('Socket received a message.')
        console.log(message)
      }
  
      if (typeof onMessage === 'function') {
        onMessage(message)
      }
    }
  
    sokk.onerror = error => {
      if (debug) {
        console.log('Socket received an error.')
        console.log(error)
      }
  
      if (typeof onError === 'function') {
        onError(error)
      }
    }

    return sokk
  }

  // dataflows
  const makePayloadBody = aPipe(
    encodeString,
    calculateHash,
    applyView,
  )
  const startSocket = pipe(
    connectSocket,
    addEventHandlersToSocket,
  )
  
  let socket = startSocket()

  return {
    async send(message) {
      try {
        socket.send(
          composePayload(await Promise.all(
            normalizeMessage(message).map(x =>
              makePayloadBody(x))))
        )
      } catch (error) {
        console.log(error)
      }
    },
  }
}