import './HeroBanner.css';

function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-tag">FASHION SALE</div>
          <h1 className="hero-title">
            Limited Time Offer!<br />
            Up to <span className="highlight">50% OFF!</span>
          </h1>
          <p className="hero-subtitle">Shop the latest trends in fashion</p>
        </div>
        <div className="hero-image">
          <img 
            src="https://i.imgur.com/9YvBXqZ.png" 
            alt="Fashion Sale" 
          />
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
