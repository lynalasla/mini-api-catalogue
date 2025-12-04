import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header({ onCartClick, onLoginClick, onSignupClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">BeliBeli</span>
          </Link>
          
          <div className="category-dropdown">
            <button className="category-btn">
              <span className="menu-icon">☰</span>
              <span>All Category</span>
              <span className="arrow-icon">▼</span>
            </button>
          </div>
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search product or brand here..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <span className="search-icon">🔍</span>
          </button>
        </form>

        <div className="header-right">
          <button className="icon-btn notification-btn">
            <span className="icon">🔔</span>
          </button>
          
          <button className="icon-btn cart-btn" onClick={onCartClick}>
            <span className="icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">{(user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}</div>
                <span className="user-name">{user.firstName || user.name}</span>
              </div>
              <div className="user-actions">
                {user.role === 'ADMIN' && (
                  <button className="btn-admin" onClick={() => window.location.href = '/admin'}>
                    <span className="icon">⚙️</span>
                    Admin
                  </button>
                )}
                <button className="btn-logout" onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={onLoginClick}>Login</button>
              <button className="btn-signup" onClick={onSignupClick}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
