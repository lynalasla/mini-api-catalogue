import { useState } from 'react';
import './ProductImage.css';

/**
 * Composant d'image de produit avec fallback
 * Gère les erreurs de chargement d'images externes
 */
const ProductImage = ({ src, alt, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Image placeholder par défaut
  const placeholderImage = 'https://via.placeholder.com/400x400/e0e0e0/666666?text=No+Image';

  const handleImageError = () => {
    console.warn(`Image failed to load: ${src}`);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Si pas d'URL ou erreur, afficher placeholder
  if (!src || imageError) {
    return (
      <img 
        src={placeholderImage}
        alt={alt || 'Product'} 
        className={`product-image ${className}`}
      />
    );
  }

  return (
    <>
      {isLoading && (
        <div className="image-loading-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      <img 
        src={src}
        alt={alt || 'Product'} 
        className={`product-image ${className} ${isLoading ? 'loading' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </>
  );
};

export default ProductImage;
