const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const publicPathDirectory = path.resolve(process.cwd(), "public");
const Filter = require("bad-words");
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require("./utils/messages");
app.use(express.static(publicPathDirectory));

io.on("connection", socket => {
  //   console.log("New Websocket connection");
  socket.emit("message", generateMessage("welcome"));
  //   socket.emit("countUpdated", count);
  socket.broadcast.emit("message", generateMessage("User has joined"));

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Not allow for bad words");
    }

    io.emit("message", generateMessage(message));
    callback("message received");
  });

  socket.on("sendLocation", (geolocation, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(geolocation)
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });

  //   socket.on("increment", () => {
  //     count++;
  //     // socket.emit('countUpdated', count)
  //     io.emit("countUpdated", count);
  //   });
});

module.exports = server;
