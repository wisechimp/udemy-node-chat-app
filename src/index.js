const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {
  generateMessage,
  generateLocationLink } = require('./utils/messages')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let welcomeMessage = 'Welcome!'

// The various communication functions available to the app
io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  // When someone joins a room
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }

    const { username, room } = user

    socket.join(room)

    // Notifying everyone else in the room that someone has joined
    socket.emit('message', generateMessage('Admin', welcomeMessage))
    socket.broadcast.to(room).emit('message', generateMessage('Admin', `${username} has joined ${room}`))

    callback()
  })

  // When someone sends a message
  socket.on('sendMessage', (message, callback) => {
    const { username, room } = getUser(socket.id)

    const filter = new Filter()

    // A filter to prevent naughty words
    if (filter.isProfane(message)) {
      return callback('Fing error!')
    }

    // Sending the message to everyone is the words are OK
    io.to(room).emit('message', generateMessage(username, message))
    callback()
  })

  // Sharing the user's location link
  socket.on('userLocation', (coords, callback) => {
    const { username, room } = getUser(socket.id)

    socket.broadcast.to(room).emit('locationLink', generateLocationLink(username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
  })

  // Disconnecting from the chat
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      const { username, room } = user
      io.to(room).emit('message', generateMessage('Admin', `${username} has left the building!`))
    }

  })
})

server.listen(port, () => {
  console.log('Server is on port ' + port + '.')
})
