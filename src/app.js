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
    const { room, username } = getUser(socket.id);

    io.to(room).emit("message", generateMessage({ text: message, username }));
    callback();
  });

  socket.on("sendLocation", (geolocation, callback) => {
    const { room, username } = getUser(socket.id);

    io.to(room).emit(
      "locationMessage",
      generateLocationMessage({ geolocation, username })
    );
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
    socket.join(room);
    socket.emit(
      "message",
      generateMessage({ text: "Welcome!", username: "Admin" })
    );
    socket.broadcast
      .to(room)
      .emit(
        "message",
        generateMessage({ text: `${username} has joined!`, username: "Admin" })
      );

    io.to(room).emit("roomData", { room, users: getUsersInRoom(room) });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      const { room, username } = user;
      io.to(room).emit(
        "message",
        generateMessage({
          text: `${username} has left!`,
          username: "Admin"
        })
      );
      io.to(room).emit("roomData", { room, users: getUsersInRoom(room) });
    }
  });

  //   socket.on("increment", () => {
  //     count++;
  //     // socket.emit('countUpdated', count)
  //     io.emit("countUpdated", count);
  //   });
});

module.exports = server;
