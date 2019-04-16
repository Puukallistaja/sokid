const http = require("http");

const { shakeHands, parseMessage, composeMessage } = require("./sokidServer");

http
  .createServer()
  .on("upgrade", (req, socket) => {
    socket
      .on("data", message => {
        console.log(parseMessage(message));

        socket.write(
          composeMessage({
            ping: false,
            payload: {
              hey: "Wanna play ping pong?"
            }
          })
        );
      })
      .on("end", () => {
        console.log("end");
      })
      .write(shakeHands(req.headers["sec-websocket-key"]));
  })
  .listen(8080);
