function sokk(config = {
  uri: 'ws://localhost:8080',
  reconnect: true,
  reconnectInterval: 2,
  onOpen: () => {
    console.log("Socket connected")
    config.reconnectInterval = 2
  },
  onClose: message => {
    console.log("Socket closing")
    console.log(message)
    if (config.reconnect) {
      const reconnect = () => {
        setTimeout(() => {
          reconnectInterval = reconnectInterval * 2;
          link = connect(uri)
        }, 1000 * reconnectInterval)
      }
      reconnect()
    }
  }
}) {
  // general tools
  const aPipe = (...fs) => input => fs.reduce((chain, func) => chain.then(func), Promise.resolve(input));
  
  // specialized tools
  const normalizeMessage = msg => {
    if (msg) {
      return Array.isArray(msg) ? msg : [msg]
    } else throw Error('Cannot normalize empty message')
  }
  const encodeString = async str => {
    if (str && typeof str === 'string') {
      return await new TextEncoder().encode(JSON.stringify(str))
    } else throw Error('Parameter should be string')
  }
  const calculateHash = async byteArray => await crypto.subtle.digest('SHA-256', byteArray)
  const applyView = arrayBuffer => new Uint8Array(arrayBuffer)
  
  // dataflows
  const makePayloadBody = aPipe(
    encodeString,
    calculateHash,
    applyView,
  )
  
  const composePayload = payloadBody => {
    const payload = new Uint8Array(125)
    const payloadHeader = new Uint8Array(29)

    payload.set(payloadHeader)
    payloadBody.forEach((typeArray, ix) => {
      payload.set(typeArray, ix * 32 + payloadHeader.length)
    })

    return payload
  }


  let socket
  return {
    connect() {
      socket = new WebSocket(config.uri)
      socket.binaryType = "arraybuffer"
      socket.onopen = config.onOpen
      socket.onclose = config.onClose
    },
    async send(message) {
      console.log(socket)
      try {
        socket.send(
          composePayload(await Promise.all(
            normalizeMessage(message).map(x =>
              makePayloadBody(x))))
        )
      } catch (error) {
        console.log(error)
      }
    }
  }
}