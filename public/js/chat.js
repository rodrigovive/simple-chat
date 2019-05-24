const socket = io();

// socket.on("countUpdated", count => {
//   console.log("The count has been updated!", count);
// });

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messagesDiv = document.querySelector("#messages");

// Templates

const messageTemplates = document.querySelector("#message-template").innerHTML;

const locationTemplates = document.querySelector("#location-template")
  .innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("message", ({ text: message, createdAt }) => {
  const html = Mustache.render(messageTemplates, {
    message,
    createdAt: moment(createdAt).format("h:mm a")
  });

  $messagesDiv.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url, createdAt) => {
  const html = Mustache.render(locationTemplates, {
    url,
    createdAt: moment(createdAt).format("h:mm a")
  });

  $messagesDiv.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  if (message) {
    $messageFormButton.setAttribute("disabled", "disabled");

    socket.emit("sendMessage", message, error => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();

      if (error) {
        return console.log(error);
      }
      console.log("Message delivered");
    });
  }
});
// document.querySelector("#count").addEventListener("click", e => {
//   console.log("Click");
//   socket.emit("increment");
// });
$sendLocationButton.addEventListener("click", e => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    const {
      coords: { latitude = 0, longitude = 0 }
    } = position;
    $sendLocationButton.setAttribute("disabled", "disabled");

    setTimeout(() => {
      socket.emit(
        "sendLocation",
        {
          latitude,
          longitude
        },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          console.log("Location shared");
        }
      );
    }, 2000);
  });
});

socket.emit(
  "join",
  {
    username,
    room
  },
  error => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  }
);
