import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      setUser({ token, username });
      initializeSocket(token);
    }
  }, []);

  const initializeSocket = (token) => {
    const newSocket = io('http://localhost:3000');
    newSocket.on('connect', () => {
      newSocket.emit('authenticate', token);
    });
    newSocket.on('userStatus', ({ users }) => {
      setUsers(users);
    });
    setSocket(newSocket);
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setUser({ token: data.token, username: data.username });
        initializeSocket(data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle token and username like login
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setUser({ token: data.token, username: data.username });
        initializeSocket(data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, socket, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 