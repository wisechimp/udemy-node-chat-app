const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let welcomeMessage = 'Welcome!'

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  // This sends to this original client
  socket.emit('message', welcomeMessage)
  // This sends to every client bar the original one
  socket.broadcast.emit('message', 'A new user has joined')

  socket.on('sendMessage', (message) => {
    // This sends to every connected client
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left')
  })
})

server.listen(port, () => {
  console.log('Server is on port ' + port + '.')
})
