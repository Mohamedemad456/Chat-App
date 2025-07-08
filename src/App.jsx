import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import Navbar from './components/Navbar/Navbar';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';
import ChatArea from './components/ChatArea/ChatArea';
import MessageInput from './components/MessageInput/MessageInput';
import NotificationContainer from './components/NotificationContainer/NotificationContainer';
import './App.css';

// Create socket instance
const socket = io('http://localhost:3000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check for existing login on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setCurrentUser(username);
      setIsLoggedIn(true);
    }
  }, []);

  // Initialize socket connection when logged in
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      socket.connect();
      socket.emit('login', currentUser);
    }
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isLoggedIn, currentUser]);

  // Socket event listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleUsers = (usersList) => {
      console.log('Received users list:', usersList);
      const filteredUsers = Array.isArray(usersList) 
        ? usersList.filter(user => user !== currentUser)
        : [];
      console.log('Filtered users:', filteredUsers);
      setUsers(filteredUsers);
    };

    const handlePrivateMessage = (message) => {
      console.log('Received message:', message);
      
      // Add message to messages list
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });

      // Show notification if we're the receiver and not in the sender's chat
      if (message.from !== currentUser && message.from !== selectedUser) {
        const notification = {
          id: Date.now(),
          from: message.from,
          text: message.text,
          time: message.time
        };
        setNotifications(prev => [...prev, notification]);
      }
    };

    const handleChatHistory = (history) => {
      console.log('Received chat history:', history);
      // Format messages to ensure consistent structure
      const formattedHistory = history.map(msg => ({
        _id: msg._id,
        from: msg.sender || msg.from,
        to: msg.receiver || msg.to,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString(),
        createdAt: msg.createdAt
      }));
      setMessages(formattedHistory);
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    };

    socket.on('users', handleUsers);
    socket.on('private message', handlePrivateMessage);
    socket.on('chat history', handleChatHistory);
    socket.on('error', handleError);

    // Request initial users list
    socket.emit('get users');

    return () => {
      socket.off('users', handleUsers);
      socket.off('private message', handlePrivateMessage);
      socket.off('chat history', handleChatHistory);
      socket.off('error', handleError);
    };
  }, [isLoggedIn, currentUser, selectedUser]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isLoggedIn || !currentUser) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched users from API:', data);
          setUsers(data.map(user => user.username));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, [isLoggedIn, currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        setCurrentUser(username);
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error logging in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        setCurrentUser(username);
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error registering');
      }
    } catch (err) {
      setError('Error registering');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    socket.disconnect();
    setCurrentUser('');
    setIsLoggedIn(false);
    setSelectedUser(null);
    setMessages([]);
    setUsers([]);
    setError('');
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    setMessages([]); // Clear current messages
    
    // Request chat history
    socket.emit('get messages', { from: currentUser, to: user });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      console.log('Sending message:', { to: selectedUser, text: message.trim() });
      socket.emit('private message', {
        to: selectedUser,
        text: message.trim()
      });
      setMessage('');
    }
  };

  const handleNotificationClose = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationSelect = (username) => {
    setSelectedUser(username);
    setNotifications(prev => prev.filter(n => n.from !== username));
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <ChatBubbleLeftIcon className="auth-icon" />
              <h1 className="auth-title">Welcome to ChatApp</h1>
            </div>
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                Register
              </button>
            </div>
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <div className="chat-container">
        <ChatSidebar
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          currentUser={currentUser}
        />
        <div className="chat-main">
          <ChatArea
            selectedUser={selectedUser}
            messages={messages}
            currentUser={currentUser}
          />
          {selectedUser && (
            <MessageInput
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
      <NotificationContainer
        notifications={notifications}
        onClose={handleNotificationClose}
        onSelect={handleNotificationSelect}
      />
    </div>
  );
}

export default App;
