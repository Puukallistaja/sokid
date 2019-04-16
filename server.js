const http = require("http");

const { shakeHands, parseMessage, composeMessage } = require("./sokidServer");

http
  .createServer()
  .on("upgrade", (req, socket) => {
    socket
      .on("data", message => {
        let parsedMessage = parseMessage(message)
        try {
          parsedMessage = JSON.parse(parseMessage(message));
        } catch (error) {
          console.log('Invalid JSON')
          console.log(error)
        }
        console.log(parsedMessage);

        if (parsedMessage.msg === "Ping") {
          socket.write(
            composeMessage({
              payload: {
                msg: "Pong!"
              }
            })
          );
        }
      })
      .on("end", () => {
        console.log("end");
      })
      .write(shakeHands(req.headers["sec-websocket-key"]));

    setInterval(() => {
      socket.write(
        composeMessage({
          payload: {
            msg: "Wanna play ping-pong?"
          }
        })
      );
    }, 1000 * 5)
  })
  .listen(8080);
