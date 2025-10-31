const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (username) => {
    connectedUsers.set(socket.id, username);
    console.log(`${username} joined the chat`);
    
    io.emit('user_joined', {
      username,
      timestamp: new Date().toISOString(),
      userCount: connectedUsers.size
    });

    socket.emit('previous_users', Array.from(connectedUsers.values()));
  });

  socket.on('send_message', (data) => {
    const username = connectedUsers.get(socket.id);
    const messageData = {
      username: username || 'Anonymous',
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    console.log('Message received:', messageData);
    io.emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    console.log('Client disconnected:', socket.id);
    
    if (username) {
      io.emit('user_left', {
        username,
        timestamp: new Date().toISOString(),
        userCount: connectedUsers.size
      });
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});