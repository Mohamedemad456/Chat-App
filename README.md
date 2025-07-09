# ChatApp - Real-Time Chat Application

A modern, real-time chat simple application built with React and Node.js, featuring instant messaging, user authentication, and real-time notifications.

## 🚀 Features

### Core Features
- **Real-time messaging** - Instant message delivery using Socket.IO
- **User authentication** - Secure login and registration system
- **User management** - View online users and manage chat sessions
- **Message history** - Persistent chat history stored in MongoDB
- **Real-time notifications** - Desktop notifications for new messages
- **Responsive design** - Modern UI that works on desktop and mobile

### Authentication & Security
- **JWT-based authentication** - Secure token-based authentication
- **Password hashing** - Bcrypt encryption for password security
- **Session management** - Automatic login persistence
- **Protected routes** - API endpoints secured with middleware

### Chat Features
- **Private messaging** - One-on-one conversations
- **Message persistence** - All messages saved to database
- **Online status** - Real-time user online/offline status
- **Message timestamps** - Time-stamped messages
- **Chat history** - Complete conversation history
- **Notification system** - Click notifications to open chats

### User Interface
- **Modern design** - Clean, intuitive interface with Tailwind CSS
- **Real-time updates** - Live user list and message updates
- **Notification badges** - Visual indicators for new messages
- **Responsive layout** - Works seamlessly across devices
- **Dark/light theme support** - Customizable appearance

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Context API** - State management for authentication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling tool
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing library
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - Document-based NoSQL database
- **Mongoose ODM** - Object Document Mapper for MongoDB

### Development Tools
- **ESLint** - Code linting and formatting
- **Vite** - Fast development and build tool
- **npm** - Package manager

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chatApp
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:
```bash
cd backend
touch .env
```

Add the following environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-secret-key-here
PORT=3000
```

### 4. Database Setup

Make sure MongoDB is running on your system:
```bash
# Start MongoDB (Linux/Mac)
sudo systemctl start mongod

# Or on Windows
net start MongoDB
```

### 5. Start the Application

#### Start the Backend Server
```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3000`

#### Start the Frontend Development Server
```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 Usage

### Registration
1. Open the application in your browser
2. Click on the "Register" tab
3. Enter your desired username and password
4. Click "Register" to create your account
5. You'll be automatically logged in and redirected to the chat

### Login
1. Click on the "Login" tab
2. Enter your username and password
3. Click "Login" to access your account

### Chatting
1. Once logged in, you'll see the chat interface
2. Select a user from the sidebar to start a conversation
3. Type your message and press Enter to send
4. Receive real-time notifications for new messages
5. Click on notifications to open the corresponding chat

### Features
- **User List**: See all online users in the sidebar
- **Message History**: View complete conversation history
- **Real-time Updates**: Messages appear instantly
- **Notifications**: Get notified of new messages
- **Logout**: Click the logout button to sign out

## 🏗️ Project Structure

```
chatApp/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── AuthForm/      # Authentication forms
│   │   ├── ChatArea/      # Main chat display
│   │   ├── ChatSidebar/   # User list sidebar
│   │   ├── MessageInput/  # Message input component
│   │   ├── Navbar/        # Navigation bar
│   │   └── Notification/  # Notification components
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── backend/               # Backend source code
│   ├── models/           # Database models
│   │   ├── User.js       # User model
│   │   └── Message.js    # Message model
│   └── server.js         # Express server
├── public/               # Static assets
└── package.json          # Project dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Users
- `GET /api/users` - Get all users (requires authentication)

### Messages
- `GET /api/messages/:username` - Get chat history (requires authentication)

### Socket.IO Events
- `login` - User login event
- `private message` - Send/receive private messages
- `get messages` - Request chat history
- `get users` - Request online users list

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by modifying:
- `src/App.css` - Custom CSS styles
- `tailwind.config.js` - Tailwind configuration
- Component-specific CSS classes

### Configuration
- **Port**: Change the port in `backend/server.js` or use environment variables
- **Database**: Update MongoDB connection string in `.env`
- **JWT Secret**: Change the JWT secret in `.env` for production

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
The built files will be in the `dist` directory.

### Backend Deployment
1. Set up environment variables for production
2. Use a process manager like PM2
3. Configure your web server (Nginx, Apache)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check environment variables are set correctly

---

**Built with ❤️ using React, Node.js, and Socket.IO**
