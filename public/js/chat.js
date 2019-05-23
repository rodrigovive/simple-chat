const socket = io();

// socket.on("countUpdated", count => {
//   console.log("The count has been updated!", count);
// });
socket.on("message", text => {
  console.log(text);
});

document.querySelector("#message-form").addEventListener("submit", e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  if (message) {
    socket.emit("sendMessage", message);
  }
});
// document.querySelector("#count").addEventListener("click", e => {
//   console.log("Click");
//   socket.emit("increment");
// });
