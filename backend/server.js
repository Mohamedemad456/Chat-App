const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Updated Vite port
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// In-memory storage (replace with a database in production)
const onlineUsers = new Map();
const JWT_SECRET = process.env.JWT_SECRET || '7e2f806a79f5b9dff8d094d695dba1509f00aa40';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword
    });
    await user.save();
    
    // Generate token for the newly registered user (same as login)
    const token = jwt.sign({ username }, JWT_SECRET);
    res.status(201).json({ token, username, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get users endpoint
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    const userList = users
      .map(user => ({
        username: user.username,
        online: onlineUsers.has(user.username)
      }))
      .filter(user => user.username !== req.user.username); // Exclude current user
    res.json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get chat history
app.get('/api/messages/:username', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.username, receiver: req.params.username },
        { sender: req.params.username, receiver: req.user.username }
      ]
    }).sort({ createdAt: 1 });

    // Format messages to match real-time message structure
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      from: msg.sender,
      to: msg.receiver,
      text: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString(),
      createdAt: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {

  socket.on('login', (username) => {
    onlineUsers.set(username, socket.id);
    socket.username = username;
    
    // Emit users list to all clients
    io.emit('users', Array.from(onlineUsers.keys()));
  });

  socket.on('get users', () => {
    socket.emit('users', Array.from(onlineUsers.keys()));
  });

  socket.on('private message', async ({ to, text }) => {
    try {
      
      // Create and save message to database
      const newMessage = new Message({
        sender: socket.username,
        receiver: to,
        text: text,
        createdAt: new Date()
      });
      
      const savedMessage = await newMessage.save();

      const messageData = {
        _id: savedMessage._id,
        from: socket.username,
        to: to,
        text: text,
        time: new Date().toLocaleTimeString(),
        createdAt: savedMessage.createdAt
      };

      // Send to receiver if online
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('private message', messageData);
      }

      // Send confirmation to sender
      socket.emit('private message', messageData);
    } catch (error) {
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  socket.on('get messages', async ({ from, to }) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: from, receiver: to },
          { sender: to, receiver: from }
        ]
      }).sort({ createdAt: 1 });

      
      // Format messages to ensure consistent structure
      const formattedMessages = messages.map(msg => ({
        _id: msg._id,
        from: msg.sender,
        to: msg.receiver,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString(),
        createdAt: msg.createdAt
      }));

      socket.emit('chat history', formattedMessages);
    } catch (error) {
      socket.emit('error', { message: 'Error fetching messages' });
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      onlineUsers.delete(socket.username);
      // Emit updated users list to all clients
      io.emit('users', Array.from(onlineUsers.keys()));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 