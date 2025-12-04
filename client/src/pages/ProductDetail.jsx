import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification, onLoginRequired } = useOutletContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      showNotification(`${quantity} item(s) added to cart!`);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <p>⏳ Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  }

  const rating = (4 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 1000) + 100;

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <div className="product-category-badge">{product.category_name}</div>
          
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{rating}</span>
            <span className="reviews-count">({reviews} reviews)</span>
            <span className="sold-count">• {Math.floor(Math.random() * 500) + 50}+ sold</span>
          </div>

          <div className="product-price-section">
            <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
            <div className="original-price">${(parseFloat(product.price) * 1.3).toFixed(2)}</div>
            <div className="discount-badge">-23%</div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'High-quality product with excellent features and durability. Perfect for your needs.'}</p>
          </div>

          <div className="product-stock">
            <span className={product.stock > 10 ? 'in-stock' : 'low-stock'}>
              {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
            </span>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button 
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
            <button 
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category_name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Product ID:</span>
              <span className="meta-value">#{product.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
