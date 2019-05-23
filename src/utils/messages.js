const generateMessage = text => ({
  text,
  createdAt: new Date().getTime()
});

const generateLocationMessage = geolocation => ({
  url: `https://google.com/maps?q=${geolocation.latitude},${geolocation.longitude}`,
  createdAt: new Date().getTime()
});

module.exports = {
  generateMessage,
  generateLocationMessage
};
