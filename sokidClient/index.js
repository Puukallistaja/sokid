export default function connect({
  uri,
  reconnectInterval, 
} = {
  // default configuration
  uri: 'ws://localhost:8080',
  reconnectInterval: 10,
}) {
  function makePayload(length) {
    let keys = {}
    for (let i = 65; i <= 90; ++i) {
      keys[String.fromCharCode(i)] = i
    }
    return keys
  }
  
  const Sokk = new WebSocket(uri)
  
  Sokk.onopen = () => {
    console.log('Hands got shook')
    Sokk.send(JSON.stringify(makePayload()).repeat(1))}
  Sokk.onmessage = msg => {
    console.log('Received: ' + msg.data)
  }
  Sokk.onclose = x => {
    console.log('Socket is closing')
    console.log('Trying to reconnect')
    setInterval(() => {
      connect({uri})
    }, 1000 * reconnectInterval)
  }

  return Sokk
}