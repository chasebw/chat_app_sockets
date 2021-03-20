const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages.js')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js')

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const botName = "Server Admin"

io.on('connection', (socket) => {
  console.log("[SERVER] A new client has connected...")


  socket.on('joinRoom', ({username, room}) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // This will emit to the single client connecting
    // This will welcome the current user
    socket.emit('message', formatMessage(botName,'Welcome to the Chat!'))

    // This will emit to everyone but the user that is connecting
    socket.broadcast
    .to(user.room)
    .emit('message',
    formatMessage(botName, `${user.username} has joined the chat`)
    )

    //Send Users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })


  }) // END JOIN ROOM

  

  //Listen for chatMessage and tell everyone
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    console.log(`[SERVER] Received message on the server: [${msg}]`)
    io.to(user.room).emit('message', formatMessage(user.username,  msg))
  })

  //Runs when client disconnects
  socket.on('disconnect', () => {

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
    }

      //Send Users and Room info on disconnect as well
      io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

  })
  
})

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
// Node we use server.listen instead of app.listen

