import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersSection.css';

function OrdersSection({ onBack }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('/api/orders', { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  return (
    <div className="orders-section">
      <div className="orders-header">
        <button className="back-btn" onClick={onBack}>← Back to Shop</button>
        <h2>My Orders</h2>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>📦</p>
            <p>No orders yet</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersSection;
