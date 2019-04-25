# Sokid
NodeJS websockets implementation. No dependencies.
Duplex binary messaging system for payloads up to 125 bytes.

#### Protocol
header 29 bytes

payload 96 bytes (3x SHA-256 binary)

#### Requirements
* Server **Node.js v11**
* Client **Chromium v73+**

Probably works with much wider range of technologies and versions.

#### Install
clone&go

#### Run
* server: ```node server.js```
* client: just append the script to HTML (see example)
```
const socket = sokk({
  uri: 'ws://localhost:8080',
  debug: true,
  reconnect: true,
  reconnectInterval: 2,
  onError(error) {},
  onOpen(openEvent) {},
  onClose(closeEvent) {},
  onMessage(incomingMessage) {},
})
socket.connect()
```

#### Tests
Aint nobody got time fo that
