import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header({ onCartClick, onLoginClick, onSignupClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo" style={{ cursor: 'pointer' }}>BeliBeli.com</div>
        
        <div className="category-dropdown">
          <button className="category-btn">
            <span>☰</span>
            <span>All Category</span>
          </button>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search product or brand here..." />
          <button>🔍</button>
        </div>

        <div className="header-actions">
          <button className="action-btn" onClick={onCartClick}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {user ? (
          <div className="user-menu active">
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
            <span className="user-name">{user.name}</span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn-login" onClick={onLoginClick}>Login</button>
            <button className="btn-signup" onClick={onSignupClick}>Sign Up</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
