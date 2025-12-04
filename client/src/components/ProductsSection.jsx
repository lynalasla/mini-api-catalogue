import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductsSection.css';

function ProductsSection({ showNotification, onLoginRequired, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category_name === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = useCallback(async () => {
    try {
      console.log('Loading products...');
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      console.log('Products response:', productsRes.data);
      console.log('Is array?', Array.isArray(productsRes.data));
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCategories(['All', ...(categoriesRes.data.map(cat => cat.name) || [])]);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setCategories(['All']);
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

  console.log('Rendering products:', filteredProducts.length, 'Loading:', loading);

  return (
    <div className="products-section">
      <div className="section-header">
        <h2>All Products ({filteredProducts.length})</h2>
        {searchQuery && (
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            Searching for: "{searchQuery}"
          </p>
        )}
      </div>
      
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '18px' }}>
          ⏳ Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {searchQuery ? `No products found for "${searchQuery}"` : 'No products found'}
        </div>
      ) : null}
      <div className="products-grid">
        {filteredProducts.map(product => {
          const _rating = (Math.random() * 2 + 3).toFixed(1);
          const reviews = Math.floor(Math.random() * 500) + 50;
          const stockClass = product.stock < 10 ? 'low' : '';

          return (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
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
