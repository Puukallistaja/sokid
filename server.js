const http = require("http");
const util = require('util')
const crypto = require("crypto")

const { shakeHands, parseMessage, composeMessage } = require("./sokidServer");

try {
  http
    .createServer()
    .on("upgrade", (req, socket) => {
      console.log("Establishing socket connection")
      socket
        .on("data", async message => {
          console.log(message)
          const messageParsed = parseMessage(message);
          console.log(messageParsed.debug)
          
          socket.write(composeMessage({
            payload: {
              "a": Buffer.from(messageParsed.a),
              "b": Buffer.from(messageParsed.b),
              "c": Buffer.from(crypto.createHash("sha256")
                                     .update(JSON.stringify("1"))
                                     .digest()),
              "d":crypto.createHash("sha256")
                      .update(JSON.stringify("1"))
                      .digest('base64')
            }
          }));
        })
        .on("end", (x) => {
          console.log("=======================================");
          console.log("end");
        })
        .write(shakeHands(req.headers["sec-websocket-key"]));
    })
    .listen(8080);
} catch (error) {
  console.log(error)
}
