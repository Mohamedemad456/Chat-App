import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import './Notification.css';

const Notification = ({ notification, onClose, onSelect }) => {
  useEffect(() => {
    // Auto-close notification after 5 seconds
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div 
      className="notification"
      onClick={() => onSelect(notification.from)}
    >
      <div className="notification-content">
        <p className="notification-message">
          New message from <strong>{notification.from}</strong>
        </p>
        <p className="notification-preview">{notification.text}</p>
      </div>
      <button 
        className="notification-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose(notification.id);
        }}
      >
        <XMarkIcon className="close-icon" />
      </button>
    </div>
  );
};

export default Notification; 