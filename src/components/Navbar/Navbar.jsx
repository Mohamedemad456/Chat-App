import { ChatBubbleLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import './Navbar.css';

const Navbar = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar mb-10">
      <div className="navbar-container">
        <div className="navbar-brand">
          <ChatBubbleLeftIcon className="navbar-icon" />
          <span className="navbar-title">ChatApp</span>
        </div>
        <div className="navbar-actions">
          {currentUser ? (
            <div className="navbar-user">
              <span className="navbar-username">Welcome, {currentUser}</span>
              <button onClick={onLogout} className="navbar-button">
                <ArrowRightOnRectangleIcon className="navbar-button-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navbar-guest">
              <span className="navbar-welcome">Welcome to ChatApp</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 