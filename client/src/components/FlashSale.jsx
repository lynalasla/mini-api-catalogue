import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FlashSale.css';

export default function FlashSale() {
  const navigate = useNavigate();
  const [time, setTime] = useState({ hours: 8, minutes: 17, seconds: 56 });
  const [products, setProducts] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadFlashSaleProducts = async () => {
    try {
      const response = await axios.get('/api/products', { withCredentials: true });
      // Prendre les 7 premiers produits pour la vente flash
      setProducts(response.data.slice(0, 7));
    } catch (error) {
      console.error('Failed to load flash sale products:', error);
    }
  };

  useEffect(() => {
    loadFlashSaleProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280; // Width of one card + gap
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
  };



  return (
    <div className="flash-sale-container">
      <div className="flash-sale">
        <div className="flash-sale-header">
          <div className="flash-title">
            <div>
              <span className="flash-icon">⚡</span>
              <h2>Flash Sale</h2>
            </div>
            <div className="flash-timer">
              <div className="time-box pink">{formatTime(time.hours)}</div>
              <span className="timer-sep">:</span>
              <div className="time-box pink">{formatTime(time.minutes)}</div>
              <span className="timer-sep">:</span>
              <div className="time-box pink">{formatTime(time.seconds)}</div>
            </div>
          </div>
          <div className="flash-nav">
            <button 
              className="nav-arrow nav-prev" 
              onClick={() => scroll('left')}
              disabled={scrollPosition === 0}
            >
              ←
            </button>
            <button 
              className="nav-arrow nav-next" 
              onClick={() => scroll('right')}
            >
              →
            </button>
          </div>
        </div>

        <div className="flash-products" ref={scrollContainerRef}>
          {products.map(product => (
            <div 
              key={product.id} 
              className="flash-product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="flash-product-image">
                <img src={product.image_url} alt={product.name} />
                <button className="flash-wishlist">♡</button>
              </div>
              <div className="flash-product-info">
                <h3 className="flash-product-name">{product.name}</h3>
                <div className="flash-product-price">
                  <span className="flash-current-price">Rp{parseFloat(product.price).toFixed(3)}</span>
                  <span className="flash-original-price">Rp{(parseFloat(product.price) * 1.5).toFixed(3)}</span>
                </div>
                <div className="flash-product-footer">
                  <div className="flash-progress-bar">
                    <div 
                      className="flash-progress-fill" 
                      style={{ width: `${Math.min((10 - product.stock) / 10 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="flash-stock">{product.stock}/10 Sale</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
