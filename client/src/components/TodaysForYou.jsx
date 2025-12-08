import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TodaysForYou.css';

export default function TodaysForYou({ searchQuery }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Best Seller');

  const filters = ['Best Seller', 'Keep Stylish', 'Special Discount', 'Official Store', 'Coveted Product'];

  const loadProducts = async () => {
    try {
      const response = await axios.get('/api/products', { withCredentials: true });
      // Prendre 8 produits pour cette section
      setProducts(response.data.slice(7, 15));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  useEffect(() => {
    (async () => await loadProducts())();
  }, []);


  const filteredProducts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return products;
    }
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const _calculateDiscount = (price) => {
    const originalPrice = parseFloat(price) * 1.5;
    return Math.round(((originalPrice - parseFloat(price)) / originalPrice) * 100);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(3);
  };

  return (
    <div className="todays-container">
      <div className="todays-header">
        <h2>Todays For You!</h2>
        <div className="todays-filters">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && searchQuery ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No products found for "{searchQuery}"
        </div>
      ) : (
        <div className="todays-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="todays-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
            <div className="todays-image">
              <img src={product.image_url} alt={product.name} />
              <button className="todays-wishlist">♡</button>
            </div>
            <div className="todays-info">
              <h3 className="todays-name">{product.name}</h3>
              <div className="todays-rating">
                <span className="stars">⭐ {(4.5 + (product.id % 5) * 0.1).toFixed(1)}</span>
                <span className="sold">• {Math.floor((product.id * 13) % 100) + 10}K+ Sold</span>
              </div>
              <div className="todays-price">
                <span className="current">Rp{formatPrice(product.price)}</span>
                <span className="original">Rp{formatPrice(parseFloat(product.price) * 1.3)}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
