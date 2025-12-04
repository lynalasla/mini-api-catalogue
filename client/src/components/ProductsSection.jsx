import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductsSection.css';

function ProductsSection({ showNotification, onLoginRequired }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const loadProducts = useCallback(async () => {
    try {
      console.log('Loading products...');
      setLoading(true);
      const response = await axios.get('/api/products');
      console.log('Products response:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const success = await addToCart(productId);
    if (success) {
      showNotification('Product added to cart!');
    }
  };

  console.log('Rendering products:', products.length, 'Loading:', loading);

  return (
    <div className="products-section">
      <div className="section-header">
        <h2>All Products ({products.length})</h2>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '18px' }}>
          ⏳ Loading products...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No products found
        </div>
      ) : null}
      <div className="products-grid">
        {products.map(product => {
          const rating = (Math.random() * 2 + 3).toFixed(1);
          const reviews = Math.floor(Math.random() * 500) + 50;
          const stockClass = product.stock < 10 ? 'low' : '';

          return (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className="no-image">🛍️</div>
                )}
                <button className="wishlist-btn">♡</button>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-count">({reviews})</span>
                </div>
                <div className="product-price">${product.price}</div>
                <div className={`product-stock ${stockClass}`}>
                  {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </div>
                <button 
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsSection;
