const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const publicPathDirectory = path.resolve(process.cwd(), "public");

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicPathDirectory));

io.on("connection", socket => {
  //   console.log("New Websocket connection");
  socket.emit("message", "welcome");
  //   socket.emit("countUpdated", count);
  socket.on("sendMessage", message => {
    io.emit("message", message);
    console.log("message is", message);
  });

  //   socket.on("increment", () => {
  //     count++;
  //     // socket.emit('countUpdated', count)
  //     io.emit("countUpdated", count);
  //   });
});

module.exports = server;
