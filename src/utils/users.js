const users = []

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required.'
    }
  }

  // Check for existing usernames
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use.'
    }
  }

  // Only stores a user if the username and room are valid
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex !== -1) {
    // Faster than filter as stops searching once a match has been found
    return users.splice(userIndex, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase()
  return users.filter((user) => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
