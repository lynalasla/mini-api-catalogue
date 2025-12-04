import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import AuthModal from '../components/AuthModal';
import Notification from '../components/Notification';

function Layout() {
  const [showCart, setShowCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <TopBar />
      <Header 
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
        onSearch={handleSearch}
      />
      
      <Outlet context={{ 
        showNotification, 
        onLoginRequired: () => setShowLoginModal(true),
        searchQuery,
        setSearchQuery
      }} />

      <Footer />

      <CartPanel 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        showNotification={showNotification}
      />

      <AuthModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mode="login"
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <AuthModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        mode="signup"
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      {notification.show && <Notification message={notification.message} />}

      {showCart && <div className="overlay" onClick={() => setShowCart(false)} />}
    </div>
  );
}

export default Layout;
