const http = require("http");
const crypto = require("crypto")

const { shakeHands, parseMessage, composeMessage } = require("./sokidServer");

try {
  http
    .createServer()
    .on("upgrade", (req, socket) => {
      console.log("Establishing socket connection")
      socket
        .on("data", async message => {
          console.log('Icoming message')
          const messageParsed = parseMessage(message);
          
          if (messageParsed.debug) {
            console.log(messageParsed.debug)
          } else {
            console.log(messageParsed)
            return
          }
          
          const [a, b, c] = ["Hups", "Tups", "Lups"]
            .map(duck => Buffer.from(crypto.createHash("sha256")
                               .update(JSON.stringify(duck))
                               .digest()))

          socket.write(composeMessage({
            payload: { a, b, c, }
          }));
        })
        .on("end", (x) => {
          console.log("=======================================");
          console.log("Connection closed");
        })
        .write(shakeHands(req.headers["sec-websocket-key"]));
    })
    .listen(8080);
} catch (error) {
  console.log(error)
}
