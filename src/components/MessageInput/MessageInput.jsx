import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import './MessageInput.css';

const MessageInput = ({ message, onMessageChange, onSendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="message-input-field"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="message-input-button"
      >
        <PaperAirplaneIcon className="send-icon" />
      </button>
    </form>
  );
};

export default MessageInput; 