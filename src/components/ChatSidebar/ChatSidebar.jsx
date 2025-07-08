import { UserIcon } from '@heroicons/react/24/solid';
import './ChatSidebar.css';

const ChatSidebar = ({ users, selectedUser, onUserSelect, currentUser }) => {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Online Users</h2>
      </div>
      <div className="users-list">
        {users.length === 0 ? (
          <div className="no-users">No users online</div>
        ) : (
          users.map((user) => (
            <button
              key={user}
              className={`user-button ${selectedUser === user ? 'selected' : ''}`}
              onClick={() => onUserSelect(user)}
            >
              <UserIcon className="user-icon" />
              <span className="username">{user}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 