import './AuthForm.css';

const AuthForm = ({ isLogin, onSubmit, error }) => {
  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h1 className="auth-form-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <form onSubmit={onSubmit} className="auth-form">
          {error && (
            <div className="auth-form-error">
              <p>{error}</p>
            </div>
          )}
          <div className="auth-form-group">
            <label className="auth-form-label">Username</label>
            <input
              type="text"
              name="username"
              className="auth-form-input"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <input
              type="password"
              name="password"
              className="auth-form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="auth-form-submit"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm; 