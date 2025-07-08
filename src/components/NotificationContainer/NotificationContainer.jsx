import Notification from '../Notification/Notification';
import './NotificationContainer.css';

const NotificationContainer = ({ notifications, onClose, onSelect }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onClose}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default NotificationContainer; 