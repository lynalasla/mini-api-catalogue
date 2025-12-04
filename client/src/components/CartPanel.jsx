import { useCart } from '../context/CartContext';
import './CartPanel.css';

function CartPanel({ isOpen, onClose, showNotification }) {
  const { cart, cartTotal, updateCartItem, removeFromCart, checkout } = useCart();

  const handleCheckout = async () => {
    const success = await checkout();
    if (success) {
      showNotification('Order placed successfully!');
      onClose();
    }
  };

  return (
    <div className={`cart-panel ${isOpen ? 'active' : ''}`}>
      <div className="cart-header">
        <h3>Shopping Cart ({cart.length})</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-icon">🛒</p>
            <p>Your cart is empty</p>
          </div>
        ) : (
                cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} />
                ) : (
                  <div className="no-image">🛍️</div>
                )}
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-price">${item.product.price}</div>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-amount">${cartTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPanel;
