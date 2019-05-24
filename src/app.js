const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const publicPathDirectory = path.resolve(process.cwd(), "public");
const Filter = require("bad-words");
const server = http.createServer(app);
const io = socketio(server);
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

const {
  getUser,
  getUsersInRoom,
  removeUser,
  addUser
} = require("./utils/users");
app.use(express.static(publicPathDirectory));

io.on("connection", socket => {
  //   console.log("New Websocket connection");
  //   socket.emit("countUpdated", count);

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Not allow for bad words");
    }

    io.emit("message", generateMessage(message));
    callback("message received");
  });

  socket.on("sendLocation", (geolocation, callback) => {
    io.emit("locationMessage", generateLocationMessage(geolocation));
    callback();
  });

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room
    });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${user.username} has joined!`));

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.io);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`)
      );
    }

    io.emit("message", generateMessage("A user has left!"));
  });

  //   socket.on("increment", () => {
  //     count++;
  //     // socket.emit('countUpdated', count)
  //     io.emit("countUpdated", count);
  //   });
});

module.exports = server;
