import { useState } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import HeroBanner from './HeroBanner';
import QuickCategories from './QuickCategories';
import FlashSale from './FlashSale';
import ProductsSection from './ProductsSection';
import CartPanel from './CartPanel';
import AuthModal from './AuthModal';
import OrdersSection from './OrdersSection';
import Notification from './Notification';

function MainLayout() {
  const [showCart, setShowCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  return (
    <div>
      <TopBar onShowOrders={() => setShowOrders(true)} />
      <Header 
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />
      
      {showOrders ? (
        <OrdersSection onBack={() => setShowOrders(false)} />
      ) : (
        <>
          <HeroBanner />
          <QuickCategories />
          <FlashSale />
          <ProductsSection showNotification={showNotification} onLoginRequired={() => setShowLoginModal(true)} />
        </>
      )}

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

export default MainLayout;
