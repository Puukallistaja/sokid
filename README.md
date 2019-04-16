#Sokid
NodeJS websockets implementation. No dependencies.

#### Purpose
Sokid is a duplex JSON messaging library. 
Its main purpose is to give basic overview on how to implement websockets.
Sokid uses array methods to traverse and modify buffers, to keep 

#### Requirements
##### Server
Node.js v10+
##### Client
Chrome browser v73+

Probably works with much wider range of technologies and versions, but is not tested.

#### Installation
Nothing to install

#### Run
```node server.js```

#### Test
```node ./test/circular.test.js```

#### Limitations
*Sokid* is written to showcase a very barebones WebSocket implementation. It is not meant to be fast nor optimized and it does not chase wide browser compatibility. It is close to being the minimum required to move data using websockets.
* Payload max 125 bytes (almost a full tweet)

#### Features
+ Connect
- Disconnect
- Reconnect
+ Recieve messages
+ Decode messages
+ Send messages
- Channels (but why even?)