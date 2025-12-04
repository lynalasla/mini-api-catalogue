import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BestSellingStore.css';

function BestSellingStore() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('/api/products', { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const stores = [
    {
      id: 1,
      name: 'Nike Sae Mall',
      slogan: 'Just do it bro!!',
      icon: '👟',
      verified: true,
      products: products.slice(0, 3)
    },
    {
      id: 2,
      name: 'Barudak Disaster Mall',
      slogan: 'Unleash Your Fashion*',
      icon: '👕',
      verified: true,
      products: products.slice(3, 6)
    },
    {
      id: 3,
      name: 'Galaxy Galleria Mall',
      slogan: 'Be Extraordinary*',
      icon: '⭐',
      verified: true,
      products: products.slice(6, 9)
    },
    {
      id: 4,
      name: 'Aurora Well Mall',
      slogan: 'Chic, Bold, Confident*',
      icon: '💼',
      verified: true,
      products: products.slice(9, 12)
    }
  ];

  const formatPrice = (price) => {
    return `Rp${parseFloat(price).toFixed(3)}`;
  };

  return (
    <div className="best-selling-container">
      <h2 className="best-selling-title">Best Selling Store</h2>

      <div className="stores-layout">
        <div className="featured-store">
          <div className="featured-image">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" 
              alt="BeliBeli Mall" 
            />
          </div>
          <div className="featured-info">
            <h3>BeliBeli Mall</h3>
            <p>Shop, Explore, Delight and Experience Mall Magic!</p>
          </div>
        </div>

        <div className="stores-grid">
          {stores.map(store => (
            <div key={store.id} className="store-card">
              <div className="store-header">
                <div className="store-icon">{store.icon}</div>
                <div className="store-info">
                  <h4>{store.name}</h4>
                  <p>{store.slogan}</p>
                </div>
                {store.verified && (
                  <div className="verified-badge">
                    <span>✓</span>
                  </div>
                )}
              </div>

              <div className="store-products">
                {store.products.map(product => (
                  <div 
                    key={product.id} 
                    className="mini-product"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="mini-product-image">
                      <img src={product.image_url} alt={product.name} />
                    </div>
                    <div className="mini-product-price">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestSellingStore;
