const generateMessage = ({ text, username }) => ({
  text,
  createdAt: new Date().getTime(),
  username
});

const generateLocationMessage = ({ geolocation, username }) => ({
  url: `https://google.com/maps?q=${geolocation.latitude},${
    geolocation.longitude
  }`,
  createdAt: new Date().getTime(),
  username
});

module.exports = {
  generateMessage,
  generateLocationMessage
};
