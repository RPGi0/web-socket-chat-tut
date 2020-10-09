const webSocketsServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log("listening on port 8000");

// Spin up server using newly created instance
const wsServer = new webSocketServer({
  httpServer: server,
});

// object to store ALL connected clients
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

// result of making a request to the server
wsServer.on("request", function (request) {
  var userID = getUniqueID();
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  );

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );

  // Triggered when server receives a message from the client
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: ", message.utf8Data);

      // broadcasting message to all connected clients
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log("sent Message to: ", clients[key]);
      }
    }
  });
});
