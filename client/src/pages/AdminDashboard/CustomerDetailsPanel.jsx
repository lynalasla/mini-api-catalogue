/**
 * Customer Details Panel Component
 * Affiche les détails d'un client dans un panneau latéral
 */

import getStatusBadge from './StatusBadge';

const CustomerDetailsPanel = ({ customer, onClose, products }) => (
  <div className="details-panel">
    <div className="details-header">
      <h3>Customer Details</h3>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
    <div className="details-content">
      <div className="detail-row">
        <span className="detail-label">Order placed</span>
        <span className="detail-value">{customer.lastOrder}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Order #</span>
        <span className="detail-value">{customer.sku}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Ship to</span>
        <span className="detail-value">Order Total: {customer.spend}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Order Status</span>
        <span className="detail-value">{getStatusBadge(customer.status)}</span>
      </div>
      <div className="product-images">
        {products.slice(0, 5).map((product, idx) => (
          <img key={idx} src={product.image_url} alt="" className="mini-product-img" />
        ))}
        <span className="more-products">+5 more</span>
      </div>
    </div>
    <div className="details-footer">
      <p>Customer Service has logged 5 issues for this order. The last update was 2 hours ago.</p>
      <button className="btn-outline">Show detail list</button>
    </div>
  </div>
);

export default CustomerDetailsPanel;
