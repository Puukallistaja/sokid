const http = require("http");
const crypto = require("crypto");

http
  .createServer()
  .on("upgrade", (req, socket) => {
    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${crypto
          .createHash("sha1")
          .update(
            req.headers["sec-websocket-key"] +
              "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
          )
          .digest("base64")}`
      ].join("\r\n") + "\r\n\r\n"
    );
  })
  .listen(8080);
