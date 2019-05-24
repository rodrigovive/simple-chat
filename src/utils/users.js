const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  const existingUser = users.find(
    user => user.room === room && user.username === username
  );

  if (existingUser) {
    return {
      error: "Username is in use"
    };
  }

  const user = {
    id,
    username,
    room
  };

  users.push(user);
  return {
    user
  };
};

// addUser({
//   id: 33,
//   username: "test 1",
//   room: "xd"
// });

// addUser({
//   id: 43,
//   username: "test 2",
//   room: "xd"
// });

// addUser({
//   id: 53,
//   username: "test 3",
//   room: "xd2"
// });

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// const userRemoved = removeUser(33);
// console.log("Rmove ", userRemoved);

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room =>
  users.filter(user => user.room === room.trim().toLowerCase());

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
