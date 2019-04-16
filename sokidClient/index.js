function connect(
  { uri, reconnectInterval } = {
    uri: "ws://localhost:8080",
    reconnectInterval: 10
  }
) {
  const Sokk = new WebSocket(uri);

  Sokk.emit = message => {
    Sokk.send(JSON.stringify({ msg: message }));
  };
  Sokk.onopen = () => {
    console.log("Hands got shook");
    Sokk.emit("Hello");
  };
  Sokk.onclose = x => {
    console.log(arguments);
    console.log("Socket is closing");
  };

  return Sokk;
}
