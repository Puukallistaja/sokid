# Sokid
NodeJS websockets implementation. No dependencies.
Duplex binary messaging system for payloads up to 125 bytes.

#### Protocol
```
header   29 bytes
body     96 bytes (3x SHA-256 binary)
-----------------
payload 125 bytes
```

#### Requirements
* Server **Node.js v11**
* Client **Chromium v73+**

Probably works with much wider range of technologies and versions.

#### Install
clone&go

#### Run
* server: ```node server.js```
* client: append the script to HTML (see example)
```
const socket = sokk({

  // config
  uri               : 'ws://localhost:8080',
  debug             : false,
  reconnect         : true,
  reconnectInterval : 2,
  
  // event handlers
  onError   : (error) => {},
  onOpen    : (openEvent) => {},
  onClose   : (closeEvent) => {},
  onMessage : (incomingMessage) => {},

})
```

#### Tests
![Aint nobody got time for that](https://i.ytimg.com/vi/Nh7UgAprdpM/hqdefault.jpg "Aint nobody got time for that")

