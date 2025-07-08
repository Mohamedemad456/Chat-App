import { useEffect, useRef } from 'react';
import './ChatArea.css';

const ChatArea = ({ selectedUser, messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div className="empty-state">
          <h2>Select a user to start chatting</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h2>{selectedUser}</h2>
      </div>
      <div className="messages-container">
        {messages
          .filter(message => 
            (message.from === currentUser && message.to === selectedUser) ||
            (message.from === selectedUser && message.to === currentUser)
          )
          .map((message) => (
            <div
              key={message._id}
              className={`message ${(message.from === currentUser || message.sender === currentUser) ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea; 