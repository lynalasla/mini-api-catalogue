/**
 * Order Details Modal Component
 * Modal complet pour afficher les détails d'une commande
 */

import getStatusBadge from './StatusBadge';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = 5.00;
  const tax = subtotal * 0.1;
  const total = order.total_amount || (subtotal + shipping + tax);
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-labelledby="order-modal-title"
      aria-modal="true"
    >
      <div 
        className="order-details-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="order-modal-header">
          <div className="order-modal-title-section">
            <span className="order-icon">📦</span>
            <div>
              <h2 id="order-modal-title" className="order-modal-title">Order #{order.id}</h2>
              <p className="order-modal-subtitle">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="order-modal-close"
            aria-label="Close order details"
          >
            ✕
          </button>
        </div>
        
        <div className="order-modal-body">
          {/* Customer Info Card */}
          <div className="info-card customer-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h3 className="card-title">Customer Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Customer Name</label>
                <p className="info-value">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
              </div>
              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">{order.user?.email}</p>
              </div>
              <div className="info-item">
                <label className="info-label">Order Time</label>
                <p className="info-value">
                  {new Date(order.created_at).toLocaleString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div className="info-item">
                <label className="info-label">Order Status</label>
                <div className="info-value">{getStatusBadge(order.status?.toLowerCase() || 'pending')}</div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="info-card items-card">
            <div className="card-header">
              <span className="card-icon">🛒</span>
              <h3 className="card-title">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="order-items-list">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-image-wrapper">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product_name || 'Product'}
                        className="item-image"
                      />
                    ) : (
                      <div className="item-image-placeholder">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">
                      {item.product_name || item.product?.name || 'Unknown Product'}
                    </h4>
                    <div className="item-meta">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <span className="item-separator">×</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="info-card summary-card">
            <div className="card-header">
              <span className="card-icon">💰</span>
              <h3 className="card-title">Order Summary</h3>
            </div>
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping Fee</span>
                <span className="summary-value">${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax (10%)</span>
                <span className="summary-value">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row summary-total">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information Card */}
          <div className="info-card delivery-card">
            <div className="card-header">
              <span className="card-icon">🚚</span>
              <h3 className="card-title">Delivery Information</h3>
            </div>
            <div className="delivery-content">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Shipping Method</label>
                  <p className="info-value">Standard Shipping</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Estimated Delivery</label>
                  <p className="info-value">
                    {new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="shipping-address">
                <label className="info-label">Shipping Address</label>
                <address className="address-text">
                  {order.user?.firstName} {order.user?.lastName}<br />
                  123 Main Street<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>
              
              <div className="tracking-status">
                <label className="info-label">Tracking Status</label>
                <div className={`status-indicator status-${order.status?.toLowerCase() || 'pending'}`}>
                  <span className="status-dot"></span>
                  <span className="status-text">
                    {order.status === 'PENDING' ? 'Order Placed - Preparing for shipment' : 
                     order.status === 'PROCESSING' ? 'Processing - Being prepared' : 
                     order.status === 'SHIPPED' ? 'Shipped - In transit' : 
                     'Delivered'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
